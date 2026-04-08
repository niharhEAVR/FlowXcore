# FlowXcore

FlowXcore is a workflow automation platform inspired by tools like n8n.  
It allows users to create, manage, and execute automated workflows by connecting different actions and services.

---

## Overview

FlowXcore enables users to:

- Build workflows using connected steps (nodes)
- Automate repetitive tasks
- Execute workflows based on triggers or manual actions
- Manage and monitor workflow executions

---

## Tech Stack

- Next.js (App Router)
- tRPC (type-safe API layer)
- Prisma (database ORM)
- Better Auth (authentication and session management)
- PostgreSQL (database)

---

## Getting Started

### 1. Environment Setup

Create and configure the following files:

- `.env` → required environment variables  
- `.env.sentry` → Sentry configuration (if enabled)

---

### 2. Install Dependencies

```sh
npm install
```

---

### 3. Database Setup

```sh
npx prisma migrate dev
npx prisma generate
```

---

### 4. Run the Application

```sh
npm run dev
```

Or run all services:

```sh
npm run dev:all
```

---

## Features

* Workflow creation and management
* Node-based automation structure
* Secure authentication system
* Protected API layer using middleware
* Scalable backend architecture with tRPC