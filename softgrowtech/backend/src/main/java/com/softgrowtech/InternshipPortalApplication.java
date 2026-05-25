package com.softgrowtech;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class InternshipPortalApplication {
    public static void main(String[] args) {
        SpringApplication.run(InternshipPortalApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("  SoftGrowTech Internship Portal");
        System.out.println("  Running at: http://localhost:8080");
        System.out.println("  Swagger UI:  http://localhost:8080/swagger-ui.html");
        System.out.println("========================================\n");
    }
}
