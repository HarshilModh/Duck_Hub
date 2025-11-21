# Code With Vibe ⚡

> **Build, run, and ship full-stack applications directly in your browser.**

Code With Vibe is an advanced online development environment powered by **WebContainers** and **AI**. It allows developers to spin up instant dev environments for popular frameworks, write code with AI assistance, and run Node.js commands entirely within the browser—no local setup required.

![Code With Vibe Preview](https://placehold.co/1200x600/0f172a/ffffff?text=Code+With+Vibe+IDE)

## 🌟 Features

* **💻 Browser-Native Runtime**: Powered by [WebContainers](https://webcontainers.io/), enabling Node.js servers, scripts, and package managers to run entirely inside your browser tab.
* **🤖 AI Copilot**: Integrated AI chat and code completion to help you generate code, debug errors, and scaffold projects faster.
* **🚀 Instant Templates**: Start coding immediately with pre-configured starters for:
    * ⚛️ **React** (Vite, Next.js)
    * 🟢 **Vue** (Vite, Nuxt)
    * 🔥 **Svelte** (Vite, SvelteKit)
    * 🅰️ **Angular**
    * 🚀 **Astro**
    * 🛡️ **Hono**, **Express**, **Koa**, and more.
* **🖥️ Integrated Terminal**: Full-featured terminal to run commands like `npm install`, `npm run dev`, and execute scripts.
* **📂 File Explorer**: VS Code-like file management with create, rename, and delete capabilities.
* **👀 Live Preview**: Instant hot-reloading preview of your application.
* **🔐 Secure Authentication**: User accounts and project persistence managed via **Auth.js** (NextAuth).

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Runtime**: [WebContainers API](https://webcontainers.io/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
* **Database**: [PostgreSQL](https://www.postgresql.org/) (managed via [Prisma](https://www.prisma.io/))
* **Authentication**: [Auth.js](https://authjs.dev/) (NextAuth v5)
* **State Management**: React Hooks & Context

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

* Node.js (v18+)
* npm or pnpm
* A PostgreSQL database (Local or Cloud like Neon/Supabase)

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/HarshilModh/code_with_vibe.git](https://github.com/HarshilModh/code_with_vibe.git)
    cd code_with_vibe
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add the following variables:

    ```env
    # Database Connection
    DATABASE_URL="postgresql://user:password@localhost:5432/vibecode?schema=public"

    # Authentication (Generate a secret with `openssl rand -base64 32`)
    AUTH_SECRET="your-secret-key"
    
    # OAuth Providers (Optional - for GitHub login)
    GITHUB_CLIENT_ID="your-github-client-id"
    GITHUB_CLIENT_SECRET="your-github-client-secret"

    # AI Configuration (If using OpenAI/Anthropic)
    OPENAI_API_KEY="your-openai-key"
    ```

4.  **Database Setup**
    Push the Prisma schema to your database:
    ```bash
    npx prisma db push
    ```

5.  **Start the Development Server**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

* `app/`: Next.js App Router pages and API routes.
    * `api/`: Backend endpoints for auth, chat, and template handling.
    * `playground/`: The core IDE interface logic.
* `components/`: Reusable UI components (Buttons, Dialogs, etc.).
* `lib/`: Utility functions and database clients.
* `modules/`: Feature-specific logic:
    * `ai-chat`: AI assistant implementation.
    * `webcontainers`: Logic for the in-browser Node.js runtime.
    * `dashboard`: User project management.
* `vibecode-starters/`: Source code for the starter templates available in the IDE.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/HarshilModh">Harshil Modh</a>
</p>
