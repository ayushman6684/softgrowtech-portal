package com.softgrowtech.controller;

import com.softgrowtech.dto.Dtos.*;
import com.softgrowtech.model.*;
import com.softgrowtech.repository.*;
import com.softgrowtech.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public AdminController(SubmissionRepository s, UserRepository u, EmailService e) {
        this.submissionRepository = s;
        this.userRepository = u;
        this.emailService = e;
    }

    @GetMapping("/submissions")
    public ResponseEntity<?> getAllSubmissions(@RequestParam(required=false) String domain, @RequestParam(required=false) String status) {
        List<Submission> subs;
        if (domain != null || status != null) {
            Submission.Status st = status != null ? Submission.Status.valueOf(status) : null;
            subs = submissionRepository.findByFilters(domain, st);
        } else {
            subs = submissionRepository.findAllByOrderBySubmittedAtDesc();
        }
        List<SubmissionDto> dtos = subs.stream().map(SubmissionDto::from).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("success", true, "submissions", dtos, "total", dtos.size(),
            "pending", subs.stream().filter(s -> s.getStatus()==Submission.Status.PENDING).count(),
            "approved", subs.stream().filter(s -> s.getStatus()==Submission.Status.APPROVED).count()));
    }

    @PutMapping("/submissions/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest req) {
        Submission sub = submissionRepository.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        sub.setStatus(Submission.Status.valueOf(req.getStatus()));
        sub.setFeedback(req.getFeedback());
        sub.setReviewedAt(LocalDateTime.now());
        submissionRepository.save(sub);
        emailService.sendStatusUpdate(sub.getIntern().getEmail(), sub.getIntern().getFullName(), sub.getTaskTitle(), req.getStatus(), req.getFeedback());
        return ResponseEntity.ok(ApiResponse.ok("Status updated", SubmissionDto.from(sub)));
    }

    @GetMapping("/interns")
    public ResponseEntity<?> getAllInterns(@RequestParam(required=false) String domain) {
        List<User> users = userRepository.findAll().stream()
            .filter(u -> u.getRole()==User.Role.INTERN)
            .filter(u -> domain==null || domain.equals(u.getDomain()))
            .collect(Collectors.toList());
        List<Map<String,Object>> result = users.stream().map(u -> {
            Map<String,Object> map = new LinkedHashMap<>();
            map.put("id", u.getId()); map.put("fullName", u.getFullName());
            map.put("email", u.getEmail()); map.put("phone", u.getPhone());
            map.put("domain", u.getDomain()); map.put("college", u.getCollege());
            map.put("duration", u.getDuration()); map.put("createdAt", u.getCreatedAt());
            map.put("submissionCount", u.getSubmissions()!=null ? u.getSubmissions().size() : 0);
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(Map.of("success", true, "interns", result, "total", result.size()));
    }

    @DeleteMapping("/interns/{id}")
    public ResponseEntity<?> deleteIntern(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Intern removed"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        return ResponseEntity.ok(Map.of(
            "totalInterns", userRepository.countByRole(User.Role.INTERN),
            "totalSubmissions", submissionRepository.count(),
            "pending", submissionRepository.countByStatus(Submission.Status.PENDING),
            "approved", submissionRepository.countByStatus(Submission.Status.APPROVED),
            "reviewed", submissionRepository.countByStatus(Submission.Status.REVIEWED),
            "rejected", submissionRepository.countByStatus(Submission.Status.REJECTED)
        ));
    }
    @GetMapping("/submissions/download-zip")
    @PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<byte[]> downloadAllFiles() throws Exception {
    java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
    java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(baos);
    List<Submission> subs = submissionRepository.findAll();
    int count = 0;
    for (Submission sub : subs) {
        if (sub.getFilePath() != null) {
            java.io.File file = new java.io.File(sub.getFilePath());
            if (file.exists()) {
                zos.putNextEntry(new java.util.zip.ZipEntry(sub.getFileName()));
                zos.write(java.nio.file.Files.readAllBytes(file.toPath()));
                zos.closeEntry();
                count++;
            }
        }
    }
    zos.close();
    if (count == 0) return ResponseEntity.status(404).body("No files found".getBytes());
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDisposition(ContentDisposition.attachment().filename("all_submissions.zip").build());
    return ResponseEntity.ok().headers(headers).body(baos.toByteArray());
}
}