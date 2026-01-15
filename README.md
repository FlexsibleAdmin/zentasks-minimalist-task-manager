# ZenTasks - Minimalist Task Manager

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FlexsibleAdmin/zentasks-minimalist-task-manager)

ZenTasks is a visually stunning, minimalist task management application designed to bring clarity and focus to daily planning. Built on the Aurelia platform using Cloudflare Workers and Durable Objects, it leverages a serverless architecture for instant syncing and persistence.

The application features a clean, distraction-free interface where users can add, manage, and organize tasks with fluid animations and delightful micro-interactions. Key components include a 'Focus Mode' dashboard that highlights the most critical task, a draggable list interface for prioritization, and a 'Zen Mode' that simplifies the UI to just the essentials.

## Key Features

- **Minimalist Aesthetic**: A distraction-free interface using a monochrome base with subtle gradients and generous whitespace.
- **Focus Mode**: A dedicated view that isolates the single most important task to prevent multitasking and improve productivity.
- **Instant Persistence**: Powered by Cloudflare Durable Objects for low-latency, transactional storage and real-time capabilities.
- **Fluid Interactions**: Smooth animations powered by Framer Motion, including satisfying completion effects and list transitions.
- **Optimistic UI**: Instant feedback for all user actions, synchronized asynchronously with the backend.
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile devices.
- **Dark/Light Mode**: Built-in theme switching with persistent preferences.

## Technology Stack

**Frontend:**
- **React 18**: Component-based UI library.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework.
- **Shadcn UI**: Reusable component library built on Radix UI.
- **Framer Motion**: Production-ready animation library.
- **Zustand**: Small, fast, and scalable bearbones state-management solution.
- **Lucide React**: Beautiful & consistent icons.

**Backend:**
- **Cloudflare Workers**: Serverless execution environment.
- **Durable Objects**: Strongly consistent coordination and storage.
- **Hono**: Ultrafast web framework for the Edges.
- **TypeScript**: Typed superset of JavaScript.

## Architecture

ZenTasks follows a modern serverless architecture:

1.  **Client**: React application managing local state via Zustand for immediate user feedback.
2.  **API Layer**: Hono running on Cloudflare Workers handles routing and request validation.
3.  **Storage Layer**: A Global Durable Object acts as the single source of truth, managing the transactional state of the task list.

## Getting Started

### Prerequisites

- **Bun**: This project uses Bun as the package manager and runtime. Ensure you have it installed.
- **Cloudflare Account**: Required for deploying Workers and Durable Objects.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/zen-tasks.git
    cd zen-tasks
    ```

2.  Install dependencies:
    ```bash
    bun install
    ```

### Development

To start the development server with hot reload:

```bash
bun run dev
```

This will start the Vite development server locally. Note that for local development, the backend API calls are proxied to the Cloudflare Worker environment or mocked depending on your configuration.

### Linting

To run the linter:

```bash
bun run lint
```

## Deployment

This project is configured for seamless deployment to the Cloudflare network.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/FlexsibleAdmin/zentasks-minimalist-task-manager)

### Manual Deployment

To deploy the application to your Cloudflare account:

1.  Login to Cloudflare (if not already logged in):
    ```bash
    npx wrangler login
    ```

2.  Deploy the worker and frontend assets:
    ```bash
    bun run deploy
    ```

This command builds the frontend and deploys the Worker script along with the static assets to Cloudflare.

## Project Structure

- `src/`: Frontend source code (React, Components, Pages, Hooks).
    - `components/ui/`: Shadcn UI components.
    - `pages/`: Application views (Dashboard, Focus Mode).
    - `store/`: Zustand state management.
- `worker/`: Backend source code.
    - `index.ts`: Worker entry point.
    - `durableObject.ts`: Durable Object logic and storage methods.
    - `userRoutes.ts`: API route definitions.
- `shared/`: Types shared between frontend and backend.

## License

This project is open source and available under the MIT License.