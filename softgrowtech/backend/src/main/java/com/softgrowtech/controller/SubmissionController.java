package com.softgrowtech.controller;
import com.softgrowtech.dto.Dtos.*;
import com.softgrowtech.model.*;
import com.softgrowtech.repository.*;
import com.softgrowtech.service.EmailService;
import com.softgrowtech.service.PdfReceiptService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PdfReceiptService pdfService;

    @Value("${file.upload.dir}")
    private String uploadDir;

    public SubmissionController(SubmissionRepository sr, UserRepository ur, EmailService es, PdfReceiptService ps) {
        this.submissionRepository = sr;
        this.userRepository = ur;
        this.emailService = es;
        this.pdfService = ps;
    }

    @PostMapping(value="/submit", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submit(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam String taskTitle,
            @RequestParam String projectType,
            @RequestParam(required=false) String description,
            @RequestParam(required=false) String projectUrl,
            @RequestParam(required=false) MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        String fileName = null, filePath = null;
        if (file != null && !file.isEmpty()) {
            Path up = Paths.get(uploadDir);
            Files.createDirectories(up);
            String safeName = user.getFullName().replaceAll("\\s+","") + "_" + (user.getDomain()!=null ? user.getDomain().replaceAll("[\\s/]+","_") : "Unknown");
            String orig = file.getOriginalFilename();
            String ext = (orig!=null && orig.contains(".")) ? orig.substring(orig.lastIndexOf('.')) : ".bin";
            fileName = safeName + "_" + System.currentTimeMillis() + ext;
            filePath = up.resolve(fileName).toAbsolutePath().toString();
            Files.write(Paths.get(filePath), file.getBytes());
        }
        Submission sub = new Submission();
        sub.setIntern(user); sub.setTaskTitle(taskTitle); sub.setProjectType(projectType);
        sub.setDescription(description); sub.setProjectUrl(projectUrl);
        sub.setFileName(fileName); sub.setFilePath(filePath);
        sub.setStatus(Submission.Status.PENDING);
        submissionRepository.save(sub);
        emailService.sendSubmissionConfirmation(user.getEmail(), user.getFullName(), taskTitle);
        return ResponseEntity.ok(ApiResponse.ok("Submission received!", SubmissionDto.from(sub)));
    }

    @GetMapping("/my")
    public ResponseEntity<?> mySubmissions(@AuthenticationPrincipal UserDetails ud) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow(() -> new RuntimeException("Not found"));
        List<SubmissionDto> subs = submissionRepository.findByInternOrderBySubmittedAtDesc(user)
            .stream().map(SubmissionDto::from).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("success", true, "submissions", subs, "total", subs.size()));
    }

    @GetMapping("/receipt/{id}")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id) {
        Submission sub = submissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        byte[] pdf = pdfService.generateReceipt(sub);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("receipt_"+id+".pdf").build());
        return ResponseEntity.ok().headers(headers).body(pdf);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Submission sub = submissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (sub.getFilePath()==null) return ResponseEntity.notFound().build();
        Resource res = new FileSystemResource(sub.getFilePath());
        if (!res.exists()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\""+sub.getFileName()+"\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM).body(res);
    }
}