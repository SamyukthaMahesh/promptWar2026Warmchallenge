# TaskBoard Pro 🚀

![Glassmorphism UI](https://img.shields.io/badge/UI-Glassmorphism-8B5CF6?style=for-the-badge)
![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cloud Run](https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)

**TaskBoard Pro** is a modern, lightweight, and highly responsive web-based Kanban task management application built with Vanilla JavaScript, HTML5, and CSS3.

---

## Google Cloud Run Deployment

This application is containerized using Docker and served through Nginx.
It is deployed on Google Cloud Run.

Architecture:
GitHub Repository → Dockerfile → Nginx Static Server → Google Cloud Run → Public URL

Live URL:
https://task-board-app-712574756217.us-central1.run.app/

Health Check:
https://task-board-app-712574756217.us-central1.run.app/health.html

---

## ✨ Features

- Kanban board with drag-and-drop across columns (Unassigned, To Do, In Progress, Done)
- Priority tags (Low / Medium / High) shown as colored badges with text
- Due date field with automatic **Overdue** detection for past dates
- Real-time search and filter by title, creator, or assignee (debounced)
- Progress percentage bar showing tasks done vs total
- Column counters that update in real-time
- LocalStorage persistence across browser refresh
- Accessible keyboard navigation with visible focus states

---

## 🛠️ Tech Stack

| Layer          | Technology                  |
|----------------|-----------------------------|
| Frontend       | HTML5, CSS3, Vanilla JavaScript |
| Web Server     | Nginx (Alpine)              |
| Container      | Docker                      |
| Hosting        | Google Cloud Run            |
| CI/CD          | GitHub → Cloud Build        |

---

## 🔒 Security

- All user inputs are sanitized via `escapeHTML()` before rendering to prevent XSS.
- Task title field is validated — empty titles are rejected with a clear error message.
- No external dependencies or third-party scripts are loaded.

---

## ♿ Accessibility

- All form inputs have explicit `<label>` elements.
- Edit and delete icon buttons include descriptive `aria-label` attributes.
- All interactive elements are keyboard focusable with visible `:focus-visible` outlines.
- Priority badges include both color and text for color-blind users.
- Semantic HTML: `<header>`, `<main>`, `<section>`, `<form>` used appropriately.

---

## 🧪 Testing

See [MANUAL_TESTING.md](./MANUAL_TESTING.md) for the full test case checklist.

Automated console-based logic validation runs on page load via `tests.js`.
Open the browser console (F12) after loading the app to view test results.

---

## 💻 Local Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/SamyukthaMahesh/promptWar2026Warmchallenge.git
   cd promptWar2026Warmchallenge
   ```
2. Open `index.html` directly in any browser — no build step or server required.

Or run via Docker:
```bash
docker build -t taskboard .
docker run -p 8080:8080 taskboard
```

---

## 🔮 Future Enhancements

- Google Sign-In for authenticated users
- Firebase Firestore for multi-user real-time sync
- Multi-board and team workspace support
- Email notifications for overdue tasks

---

## 🎯 Project Objective

Designed to help individuals and small teams intuitively organize, track, and manage their workflow without the complexity of enterprise tools.
