package com.softgrowtech.config;
import com.softgrowtech.model.User;
import com.softgrowtech.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@softgrowtech.com")) {
            User admin = new User();
            admin.setFullName("Admin User");
            admin.setEmail("admin@softgrowtech.com");
            admin.setPhone("+91 9000000000");
            admin.setDomain("Administration");
            admin.setCollege("SoftGrowTech");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Default admin created");
        }
        if (!userRepository.existsByEmail("intern@softgrowtech.com")) {
            User intern = new User();
            intern.setFullName("Demo Intern");
            intern.setEmail("intern@softgrowtech.com");
            intern.setPhone("+91 9999999999");
            intern.setDomain("Web Development");
            intern.setCollege("Demo College");
            intern.setDuration("3 Months");
            intern.setPassword(passwordEncoder.encode("intern123"));
            intern.setRole(User.Role.INTERN);
            userRepository.save(intern);
            System.out.println("Demo intern created");
        }
    }
}