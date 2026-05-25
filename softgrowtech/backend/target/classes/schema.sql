-- ============================================
-- SoftGrowTech Internship Portal — Database Schema
-- Run this in MySQL before starting the app
-- ============================================

CREATE DATABASE IF NOT EXISTS softgrowtech_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE softgrowtech_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    domain VARCHAR(50),
    college VARCHAR(150),
    duration VARCHAR(30),
    password VARCHAR(255) NOT NULL,
    role ENUM('INTERN', 'ADMIN') NOT NULL DEFAULT 'INTERN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_domain (domain)
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    intern_id BIGINT NOT NULL,
    task_title VARCHAR(200) NOT NULL,
    description TEXT,
    project_type VARCHAR(100),
    project_url VARCHAR(300),
    file_path VARCHAR(500),
    file_name VARCHAR(300),
    status ENUM('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (intern_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_intern (intern_id),
    INDEX idx_status (status),
    INDEX idx_submitted (submitted_at)
);

-- ===== Sample Data (optional) =====
-- Default admin (password: admin123)
INSERT IGNORE INTO users (full_name, email, phone, domain, college, password, role)
VALUES ('Admin User', 'admin@softgrowtech.com', '+91 9000000000', 'Administration', 'SoftGrowTech',
        '$2a$10$rI.2LX3j3.LH7u9yt1b8Q.8zVHbJKvE6RrN2pMuGX5K0cD1Jjt3hW', 'ADMIN');

-- Demo intern (password: intern123)
INSERT IGNORE INTO users (full_name, email, phone, domain, college, duration, password, role)
VALUES ('Demo Intern', 'intern@softgrowtech.com', '+91 9999999999', 'Web Development', 'Demo College', '3 Months',
        '$2a$10$eI.7X2k0j.LH9u8xt1c5R.9yWIcLKwF8SsP3qNvHZ6M1dE2Kkf4iX', 'INTERN');
