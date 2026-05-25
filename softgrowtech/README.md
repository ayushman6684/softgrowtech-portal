# SoftGrowTech — Internship Management Portal

> **Full-stack** Internship Portal | Java Spring Boot + MySQL Backend | Vanilla HTML/CSS/JS Frontend

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | HTML5, CSS3, Vanilla JS, Chart.js   |
| Backend    | Java 17 + Spring Boot 3.2           |
| Security   | JWT + Spring Security + BCrypt      |
| Database   | MySQL 8+                            |
| Email      | JavaMailSender (Gmail SMTP)         |
| PDF        | iTextPDF                            |
| API Docs   | Swagger / OpenAPI 3                 |
| Build      | Maven                               |

---

## 📁 Project Structure

```
softgrowtech/
├── frontend/
│   ├── index.html              ← Landing page
│   ├── css/
│   │   ├── main.css            ← Shared styles + variables
│   │   ├── landing.css         ← Landing page styles
│   │   └── dashboard.css       ← Dashboard + admin styles
│   ├── js/
│   │   ├── main.js             ← Shared utilities, API, demo data
│   │   ├── dashboard.js        ← Intern dashboard logic
│   │   └── admin.js            ← Admin panel logic
│   └── pages/
│       ├── login.html          ← Login page
│       ├── register.html       ← Intern registration
│       ├── dashboard.html      ← Intern dashboard
│       └── admin.html          ← Admin panel
│
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/softgrowtech/
        │   ├── InternshipPortalApplication.java
        │   ├── controller/
        │   │   ├── AuthController.java
        │   │   ├── InternController.java
        │   │   ├── SubmissionController.java
        │   │   └── AdminController.java
        │   ├── model/
        │   │   ├── User.java
        │   │   └── Submission.java
        │   ├── repository/
        │   │   ├── UserRepository.java
        │   │   └── SubmissionRepository.java
        │   ├── service/
        │   │   ├── EmailService.java
        │   │   └── PdfReceiptService.java
        │   ├── security/
        │   │   ├── JwtUtil.java
        │   │   └── SecurityConfig.java
        │   ├── dto/
        │   │   └── Dtos.java
        │   └── config/
        │       ├── DataInitializer.java
        │       └── OpenApiConfig.java
        └── resources/
            ├── application.properties
            └── schema.sql
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+ (install from https://adoptium.net)
- Maven 3.8+ (install from https://maven.apache.org)
- MySQL 8+ (install from https://dev.mysql.com/downloads)
- VS Code with **Live Server** extension (for frontend)

---

### Step 1 — Set up MySQL

Open MySQL Workbench or terminal:
```sql
CREATE DATABASE softgrowtech_db;
```
Or just run the provided schema:
```bash
mysql -u root -p < backend/src/main/resources/schema.sql
```

---

### Step 2 — Configure Backend

Edit `backend/src/main/resources/application.properties`:

```properties
# Change these:
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Optional — for email (Gmail):
spring.mail.username=your_gmail@gmail.com
spring.mail.password=your_16_char_app_password
```

> **Gmail App Password:** Go to Google Account → Security → 2FA → App Passwords → Generate

---

### Step 3 — Run the Backend

Open VS Code terminal in the `backend/` folder:

```bash
# Navigate to backend folder
cd backend

# Build and run
mvn spring-boot:run
```

Wait for:
```
========================================
  SoftGrowTech Internship Portal
  Running at: http://localhost:8080
  Swagger UI:  http://localhost:8080/swagger-ui.html
========================================
```

---

### Step 4 — Run the Frontend

**Option A — VS Code Live Server (recommended):**
1. Install the **Live Server** extension in VS Code
2. Right-click `frontend/index.html` → **Open with Live Server**
3. Site opens at `http://127.0.0.1:5500`

**Option B — Python simple server:**
```bash
cd frontend
python -m http.server 5500
# Open http://localhost:5500
```

**Option C — Node http-server:**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

---

## 🔑 Default Login Credentials

| Role  | Email                        | Password   |
|-------|------------------------------|------------|
| Admin | admin@softgrowtech.com       | admin123   |
| Intern| intern@softgrowtech.com      | intern123  |

> **Demo Mode:** If backend is offline, the frontend works with demo data. Use the credentials above.

---

## 🌐 API Endpoints

| Method | Endpoint                             | Auth     | Description                    |
|--------|--------------------------------------|----------|--------------------------------|
| POST   | `/api/auth/register`                 | None     | Register new intern            |
| POST   | `/api/auth/login`                    | None     | Login, get JWT token           |
| GET    | `/api/intern/profile`                | Intern   | Get own profile                |
| PUT    | `/api/intern/profile`                | Intern   | Update profile                 |
| POST   | `/api/intern/change-password`        | Intern   | Change password                |
| POST   | `/api/submissions/submit`            | Intern   | Submit task (with file upload) |
| GET    | `/api/submissions/my`                | Intern   | Get own submissions            |
| GET    | `/api/submissions/receipt/{id}`      | Intern   | Download PDF receipt           |
| GET    | `/api/submissions/download/{id}`     | Intern   | Download submitted file        |
| GET    | `/api/admin/submissions`             | Admin    | Get all submissions            |
| PUT    | `/api/admin/submissions/{id}/status` | Admin    | Update status + feedback       |
| GET    | `/api/admin/interns`                 | Admin    | List all interns               |
| DELETE | `/api/admin/interns/{id}`            | Admin    | Remove intern                  |
| GET    | `/api/admin/analytics`               | Admin    | Platform analytics             |

📋 **Full API docs:** http://localhost:8080/swagger-ui.html

---

## ✨ Features

- 🔐 JWT Authentication with role-based access (INTERN / ADMIN)
- 📤 File upload with auto-formatted naming (`FullName_Domain_timestamp.ext`)
- 📧 Email notifications (welcome, submission confirmation, status updates)
- 🧾 PDF receipt generation for each submission
- 📊 Analytics dashboard with Chart.js visualizations
- 📥 CSV export for submissions and intern list
- 🌙 Dark theme (default) with light mode toggle
- 🔔 Notification system with unread badge
- 📱 Fully responsive — works on mobile
- 🔄 Demo mode — frontend works without backend

---

## 🛠️ VS Code Extensions Recommended

- **Live Server** — `ritwickdey.liveserver`
- **Spring Boot Extension Pack** — `vmware.vscode-boot-dev-pack`
- **Java Extension Pack** — `vscjava.vscode-java-pack`
- **MySQL** — `cweijan.vscode-mysql-client2`

---

## 📦 Build for Production

```bash
cd backend
mvn clean package -DskipTests
java -jar target/internship-portal-1.0.0.jar
```

---

*SoftGrowTech © 2025 — Learn • Build • Evolve*
