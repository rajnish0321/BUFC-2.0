# BUFC-2.0
💻 Built at Bennett. ⚙️ Engineered for speed. ⚡ Synced to serve.

# BUFC – Bennett University Food Courtyard

> *BUFC* is a live, end‑to‑end campus food‑ordering platform—no more lines, real‑time updates, and full transparency for students and staff at Bennett University.

---

## 🚀 Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Architecture](#architecture)  
4. [Screenshots](#screenshots)  
5. [Getting Started](#getting-started)  
   - [Prerequisites](#prerequisites)  
   - [Installation](#installation)  
   - [Environment Variables](#environment-variables)  
   - [Database Setup & Migrations](#database-setup--migrations)  
   - [Seeding & Health‑Check Scripts](#seeding--health-check-scripts)  
6. [Running the App](#running-the-app)  
7. [Scripts & Commands](#scripts--commands)  
8. [Deployment](#deployment)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Contact](#contact)

---

## ✨ Features

- *Effortless Pre‑Ordering*: Reserve your meal and pickup slot in seconds.  
- *Live Status Updates*: Track your order from “preparing” → “ready.”  
- *Staff Dashboard*: Real‑time order queue and status management.  
- *Data‑Driven Insights*: Analytics on order volumes, peak hours, and menu popularity.  
- *Spending Transparency*: Full order history with cost breakdown.  
- *Campus‑Only Access*: Secured behind Bennett WiFi and dynamic QR onboarding.  

---

## 🛠 Tech Stack

| Layer                  | Technology                                        |
|------------------------|---------------------------------------------------|
| *Frontend*           | React, TypeScript, Vite, Tailwind CSS, Radix UI   |
| *Backend & DB*       | Supabase (Postgres + Auth + RLS), SQL migrations  |
| *Automation & Scripts* | TypeScript (ts‑node), custom CLI routines       |
| *Forms & Validation* | React Hook Form, Zod                              |
| *Routing*            | React Router DOM                                  |
| *Tooling*            | ESLint, Prettier, PostCSS, npm/Bun                |
| *Deployment*         | Vercel / Netlify                                   |

---

## 🏗 Architecture

---

## 📸 Screenshots

| Home / Menu Browse | Student Order History |
|:------------------:|:---------------------:|
| ![Menu](./public/hero-food.png) | ![Orders](./public/placeholder.svg) |

> More screenshots available in the */docs* folder.

---

## 🏁 Getting Started

### Prerequisites

- Node.js 18+ (or Bun)  
- npm or yarn (or Bun)  
- Access to Bennett University WiFi  

### Installation

1. *Clone the repo*  
   ```bash
   git clone https://github.com/TeamTechSetu/BUFC.git
   cd BUFC
