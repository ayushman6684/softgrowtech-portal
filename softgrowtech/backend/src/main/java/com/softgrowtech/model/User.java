package com.softgrowtech.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_name", nullable = false, length = 100) private String fullName;
    @Column(unique = true, nullable = false, length = 100) private String email;
    @Column(length = 20) private String phone;
    @Column(length = 50) private String domain;
    @Column(length = 150) private String college;
    @Column(length = 30) private String duration;
    @Column(nullable = false, length = 255) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 10) private Role role;
    @Column(name = "created_at") private LocalDateTime createdAt;
    @OneToMany(mappedBy = "intern", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Submission> submissions;
    @PrePersist void prePersist() { createdAt = LocalDateTime.now(); if (role == null) role = Role.INTERN; }
    public enum Role { INTERN, ADMIN }
    public User() {}
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getDomain() { return domain; }
    public String getCollege() { return college; }
    public String getDuration() { return duration; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Submission> getSubmissions() { return submissions; }
    public void setId(Long v) { id = v; }
    public void setFullName(String v) { fullName = v; }
    public void setEmail(String v) { email = v; }
    public void setPhone(String v) { phone = v; }
    public void setDomain(String v) { domain = v; }
    public void setCollege(String v) { college = v; }
    public void setDuration(String v) { duration = v; }
    public void setPassword(String v) { password = v; }
    public void setRole(Role v) { role = v; }
    public void setCreatedAt(LocalDateTime v) { createdAt = v; }
    public void setSubmissions(List<Submission> v) { submissions = v; }
    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final User u = new User();
        public Builder fullName(String v) { u.fullName = v; return this; }
        public Builder email(String v) { u.email = v; return this; }
        public Builder phone(String v) { u.phone = v; return this; }
        public Builder domain(String v) { u.domain = v; return this; }
        public Builder college(String v) { u.college = v; return this; }
        public Builder duration(String v) { u.duration = v; return this; }
        public Builder password(String v) { u.password = v; return this; }
        public Builder role(Role v) { u.role = v; return this; }
        public User build() { return u; }
    }
}
