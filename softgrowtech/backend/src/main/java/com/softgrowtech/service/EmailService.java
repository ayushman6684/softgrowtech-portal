package com.softgrowtech.service;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendWelcomeEmail(String to, String name) {
        System.out.println("Welcome email -> " + to);
    }
    public void sendSubmissionConfirmation(String to, String name, String taskTitle) {
        System.out.println("Submission email -> " + to + " : " + taskTitle);
    }
    public void sendStatusUpdate(String to, String name, String taskTitle, String status, String feedback) {
        System.out.println("Status email -> " + to + " : " + status);
    }
}