package com.softgrowtech.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "intern_id", nullable = false) private User intern;
    @Column(name = "task_title", nullable = false, length = 200) private String taskTitle;
    @Column(columnDefinition = "TEXT") private String description;
    @Column(name = "project_type", length = 100) private String projectType;
    @Column(name = "project_url", length = 300) private String projectUrl;
    @Column(name = "file_path", length = 500) private String filePath;
    @Column(name = "file_name", length = 300) private String fileName;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Status status = Status.PENDING;
    @Column(columnDefinition = "TEXT") private String feedback;
    @Column(name = "submitted_at") private LocalDateTime submittedAt;
    @Column(name = "reviewed_at") private LocalDateTime reviewedAt;
    @PrePersist void prePersist() { submittedAt = LocalDateTime.now(); }
    public enum Status { PENDING, REVIEWED, APPROVED, REJECTED }
    public Submission() {}
    public Long getId() { return id; }
    public User getIntern() { return intern; }
    public String getTaskTitle() { return taskTitle; }
    public String getDescription() { return description; }
    public String getProjectType() { return projectType; }
    public String getProjectUrl() { return projectUrl; }
    public String getFilePath() { return filePath; }
    public String getFileName() { return fileName; }
    public Status getStatus() { return status; }
    public String getFeedback() { return feedback; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setId(Long v) { id = v; }
    public void setIntern(User v) { intern = v; }
    public void setTaskTitle(String v) { taskTitle = v; }
    public void setDescription(String v) { description = v; }
    public void setProjectType(String v) { projectType = v; }
    public void setProjectUrl(String v) { projectUrl = v; }
    public void setFilePath(String v) { filePath = v; }
    public void setFileName(String v) { fileName = v; }
    public void setStatus(Status v) { status = v; }
    public void setFeedback(String v) { feedback = v; }
    public void setSubmittedAt(LocalDateTime v) { submittedAt = v; }
    public void setReviewedAt(LocalDateTime v) { reviewedAt = v; }
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final Submission s = new Submission();
        public Builder intern(User v) { s.intern = v; return this; }
        public Builder taskTitle(String v) { s.taskTitle = v; return this; }
        public Builder description(String v) { s.description = v; return this; }
        public Builder projectType(String v) { s.projectType = v; return this; }
        public Builder projectUrl(String v) { s.projectUrl = v; return this; }
        public Builder filePath(String v) { s.filePath = v; return this; }
        public Builder fileName(String v) { s.fileName = v; return this; }
        public Builder status(Status v) { s.status = v; return this; }
        public Submission build() { return s; }
    }
}
