package com.softgrowtech.controller;
import com.softgrowtech.dto.Dtos.*;
import com.softgrowtech.model.User;
import com.softgrowtech.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/intern")
public class InternController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public InternController(UserRepository u, PasswordEncoder p) {
        this.userRepository=u; this.passwordEncoder=p;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
            .map(u -> ResponseEntity.ok(ApiResponse.ok("OK", UserDto.from(u))))
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails ud, @RequestBody UserDto dto) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow(() -> new RuntimeException("Not found"));
        if (dto.getPhone()!=null) user.setPhone(dto.getPhone());
        if (dto.getCollege()!=null) user.setCollege(dto.getCollege());
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("Updated", UserDto.from(user)));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails ud, @RequestBody ChangePasswordRequest req) {
        User user = userRepository.findByEmail(ud.getUsername()).orElseThrow(() -> new RuntimeException("Not found"));
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword()))
            return ResponseEntity.badRequest().body(ApiResponse.fail("Wrong current password"));
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.ok("Password changed"));
    }
}