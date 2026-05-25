package com.softgrowtech.dto;
import com.softgrowtech.model.Submission;
import com.softgrowtech.model.User;
import java.time.LocalDateTime;

public class Dtos {

    public static class RegisterRequest {
        private String fullName, email, phone, domain, college, duration, password;
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getDomain() { return domain; }
        public String getCollege() { return college; }
        public String getDuration() { return duration; }
        public String getPassword() { return password; }
        public void setFullName(String v) { fullName = v; }
        public void setEmail(String v) { email = v; }
        public void setPhone(String v) { phone = v; }
        public void setDomain(String v) { domain = v; }
        public void setCollege(String v) { college = v; }
        public void setDuration(String v) { duration = v; }
        public void setPassword(String v) { password = v; }
    }

    public static class LoginRequest {
        private String email, password;
        public String getEmail() { return email; }
        public String getPassword() { return password; }
        public void setEmail(String v) { email = v; }
        public void setPassword(String v) { password = v; }
    }

    public static class AuthResponse {
        private String token, message;
        private UserDto user;
        public String getToken() { return token; }
        public UserDto getUser() { return user; }
        public String getMessage() { return message; }
        public void setToken(String v) { token = v; }
        public void setUser(UserDto v) { user = v; }
        public void setMessage(String v) { message = v; }
        public static AuthResponse of(String token, User u) {
            AuthResponse r = new AuthResponse();
            r.token = token; r.user = UserDto.from(u); r.message = "Login successful"; return r;
        }
    }

    public static class UserDto {
        private Long id;
        private String fullName, email, phone, domain, college, duration, role;
        private LocalDateTime createdAt;
        public Long getId() { return id; }
        public String getFullName() { return fullName; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getDomain() { return domain; }
        public String getCollege() { return college; }
        public String getDuration() { return duration; }
        public String getRole() { return role; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setId(Long v) { id = v; }
        public void setFullName(String v) { fullName = v; }
        public void setEmail(String v) { email = v; }
        public void setPhone(String v) { phone = v; }
        public void setDomain(String v) { domain = v; }
        public void setCollege(String v) { college = v; }
        public void setDuration(String v) { duration = v; }
        public void setRole(String v) { role = v; }
        public void setCreatedAt(LocalDateTime v) { createdAt = v; }
        public static UserDto from(User u) {
            UserDto d = new UserDto();
            d.id = u.getId(); d.fullName = u.getFullName(); d.email = u.getEmail();
            d.phone = u.getPhone(); d.domain = u.getDomain(); d.college = u.getCollege();
            d.duration = u.getDuration(); d.role = u.getRole().name(); d.createdAt = u.getCreatedAt();
            return d;
        }
    }

    public static class SubmissionDto {
        private Long id, internId;
        private String internName, internEmail, domain, taskTitle, description, projectType, projectUrl, fileName, status, feedback;
        private LocalDateTime submittedAt, reviewedAt;
        public Long getId() { return id; }
        public Long getInternId() { return internId; }
        public String getInternName() { return internName; }
        public String getInternEmail() { return internEmail; }
        public String getDomain() { return domain; }
        public String getTaskTitle() { return taskTitle; }
        public String getDescription() { return description; }
        public String getProjectType() { return projectType; }
        public String getProjectUrl() { return projectUrl; }
        public String getFileName() { return fileName; }
        public String getStatus() { return status; }
        public String getFeedback() { return feedback; }
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public LocalDateTime getReviewedAt() { return reviewedAt; }
        public void setId(Long v) { id = v; }
        public void setInternId(Long v) { internId = v; }
        public void setInternName(String v) { internName = v; }
        public void setInternEmail(String v) { internEmail = v; }
        public void setDomain(String v) { domain = v; }
        public void setTaskTitle(String v) { taskTitle = v; }
        public void setDescription(String v) { description = v; }
        public void setProjectType(String v) { projectType = v; }
        public void setProjectUrl(String v) { projectUrl = v; }
        public void setFileName(String v) { fileName = v; }
        public void setStatus(String v) { status = v; }
        public void setFeedback(String v) { feedback = v; }
        public void setSubmittedAt(LocalDateTime v) { submittedAt = v; }
        public void setReviewedAt(LocalDateTime v) { reviewedAt = v; }
        public static SubmissionDto from(Submission s) {
            SubmissionDto d = new SubmissionDto();
            d.id = s.getId(); d.internId = s.getIntern().getId();
            d.internName = s.getIntern().getFullName(); d.internEmail = s.getIntern().getEmail();
            d.domain = s.getIntern().getDomain(); d.taskTitle = s.getTaskTitle();
            d.description = s.getDescription(); d.projectType = s.getProjectType();
            d.projectUrl = s.getProjectUrl(); d.fileName = s.getFileName();
            d.status = s.getStatus().name(); d.feedback = s.getFeedback();
            d.submittedAt = s.getSubmittedAt(); d.reviewedAt = s.getReviewedAt();
            return d;
        }
    }

    public static class StatusUpdateRequest {
        private String status, feedback;
        public String getStatus() { return status; }
        public String getFeedback() { return feedback; }
        public void setStatus(String v) { status = v; }
        public void setFeedback(String v) { feedback = v; }
    }

    public static class ChangePasswordRequest {
        private String currentPassword, newPassword;
        public String getCurrentPassword() { return currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setCurrentPassword(String v) { currentPassword = v; }
        public void setNewPassword(String v) { newPassword = v; }
    }

    public static class ApiResponse {
        private boolean success;
        private String message;
        private Object data;
        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Object getData() { return data; }
        public void setSuccess(boolean v) { success = v; }
        public void setMessage(String v) { message = v; }
        public void setData(Object v) { data = v; }
        public static ApiResponse ok(String msg) { ApiResponse r = new ApiResponse(); r.success = true; r.message = msg; return r; }
        public static ApiResponse ok(String msg, Object data) { ApiResponse r = ok(msg); r.data = data; return r; }
        public static ApiResponse fail(String msg) { ApiResponse r = new ApiResponse(); r.success = false; r.message = msg; return r; }
    }
}
