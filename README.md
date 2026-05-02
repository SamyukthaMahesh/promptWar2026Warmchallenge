# TaskBoard Pro 🚀

![Glassmorphism UI](https://img.shields.io/badge/UI-Glassmorphism-8B5CF6?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cloud Run](https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

**TaskBoard Pro** is a modern, lightweight, and highly responsive web-based Kanban task management application. Built entirely with Vanilla JavaScript, HTML5, and CSS3, it offers a blazing-fast user experience without the overhead of heavy frameworks. 

The application is fully containerized using Docker and securely hosted on Google Cloud Run.

### 🔗 [Live Demo (Google Cloud Run)](https://task-board-app-712574756217.us-central1.run.app/)

---

## ✨ Key Features

* **Interactive Drag-and-Drop Kanban Board:** Seamlessly move tasks across workflow stages (Unassigned, To Do, In Progress, Done).
* **Advanced Task Tracking:** 
  * Add custom titles, creators, and assignees to every task.
  * Assign **Priority Badges** (Low, Medium, High).
  * Set **Due Dates** — tasks automatically highlight as **(Overdue)** if the deadline passes!
* **Real-Time Search & Filtering:** Instantly filter tasks by title, creator, or assignee using the sleek search bar.
* **Live Progress Tracking:** The built-in progress bar dynamically calculates your completion rate (e.g., *3/10 tasks done — 30% complete*).
* **Data Persistence:** Built-in Local Storage functionality ensures you never lose your workflow progress when you refresh the page.
* **Premium Aesthetics:** Features a stunning "Glassmorphism" design with frosted glass panels, dynamic gradients, and smooth micro-animations.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript
* **Web Server:** Nginx (Alpine)
* **Containerization:** Docker
* **Deployment & Hosting:** Google Cloud Run (Continuous Deployment via GitHub)

---

## 💻 Local Setup Instructions

Since this app uses Vanilla JavaScript and Local Storage, running it locally is incredibly simple:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SamyukthaMahesh/promptWar2026Warmchallenge.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd promptWar2026Warmchallenge
   ```
3. **Run the app:**
   Simply double-click the `index.html` file to open it in any modern web browser! No `npm install` or local servers required!

*(Alternatively, you can build and run the Docker container locally using `docker build -t taskboard .` and `docker run -p 8080:8080 taskboard`)*

---

## 🎯 Project Agenda / Objective
Designed as a robust solution to help individuals and small teams intuitively organize, track, and manage their daily workflow without the clutter of overly complex enterprise tools.
