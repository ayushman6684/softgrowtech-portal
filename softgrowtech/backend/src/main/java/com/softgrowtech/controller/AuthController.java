package com.softgrowtech.controller;
import com.softgrowtech.dto.Dtos.*;
import com.softgrowtech.model.User;
import com.softgrowtech.repository.UserRepository;
import com.softgrowtech.security.JwtUtil;
import com.softgrowtech.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authManager;
    private final EmailService emailService;

    public AuthController(UserRepository u, PasswordEncoder p, JwtUtil j, AuthenticationManager a, EmailService e) {
        this.userRepository=u; this.passwordEncoder=p; this.jwtUtil=j; this.authManager=a; this.emailService=e;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            return ResponseEntity.badRequest().body(ApiResponse.fail("Email already registered"));
        User user = new User();
        user.setFullName(req.getFullName()); user.setEmail(req.getEmail());
        user.setPhone(req.getPhone()); user.setDomain(req.getDomain());
        user.setCollege(req.getCollege()); user.setDuration(req.getDuration());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.INTERN);
        userRepository.save(user);
        emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
        return ResponseEntity.ok(ApiResponse.ok("Registration successful!", UserDto.from(user)));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body(ApiResponse.fail("Invalid email or password"));
        }
        User user = userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new RuntimeException("Not found"));
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return ResponseEntity.ok(AuthResponse.of(token, user));
    }
}