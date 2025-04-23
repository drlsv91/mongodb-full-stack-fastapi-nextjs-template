# Full Stack MongoDB + FastAPI + Next.js Admin Dashboard

This is a complete admin dashboard template built with Next.js, FastAPI, and MongoDB. It provides a modern, responsive interface with authentication, user management, CRUD operations, and theming support.

![Dashboard Screenshot](https://via.placeholder.com/800x450?text=Dashboard+Screenshot)

## Features

- 🔐 **Authentication** - Secure login and session management
- 👥 **User Management** - Create, update, and delete users with different roles
- 📊 **Item Management** - Full CRUD operations with search capability
- 🎨 **Theming** - Light, dark, and system theme modes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🛡️ **Role-based Access** - Different navigation based on user permissions
- 🔎 **Search Functionality** - Search across all data tables
- 🧩 **Modular Components** - Built with reusable ShadCN UI components

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB running locally or a MongoDB Atlas account
- FastAPI backend running (see backend README)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# API URL - Base URL for your FastAPI backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Authentication
SESSION_SECRET_KEY=your-nextauth-secret-key-here

```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/drlsv91/pymongo-orm-fastapi-next-template.git
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
frontend/
├── app/             # Next.js app router folders
│   ├── admin/       # Admin dashboard pages
│   ├── (auth)/       # Authentication pages
│   └── api/         # API routes
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and API client
├── public/          # Static assets
└── types/           # TypeScript type definitions
```

## Backend Integration

This dashboard connects to a FastAPI backend. Make sure your backend is running and accessible at the URL specified in your environment variables.

To set up the backend, refer to the backend README in the `backend/` directory.

## Authentication

The application uses token-based authentication with HTTP-only cookies. Login credentials are sent to the backend, which returns a token stored in cookies for subsequent authenticated requests.

## Customization

### Theming

This project uses [Tailwind CSS](https://tailwindcss.com/) and the shadcn/ui component library for styling. You can customize the theme by editing the following files:

- `app/globals.css` - Global CSS styles
- `components/ui/theme-provider.tsx` - Theme provider configuration
- `tailwind.config.js` - Tailwind CSS configuration

### Adding New Pages

To add new pages to the admin dashboard:

1. Create a new page component in `app/admin/your-page/page.tsx`
2. Add the route to the sidebar navigation in `components/app-sidebar.tsx`

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Docker

A Dockerfile is included for containerized deployment. Build and run with:

```bash
# Build the Docker image
docker build -t nextjs-admin-dashboard .

# Run the container
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://api-url nextjs-admin-dashboard
```

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - FastAPI framework
- [Pymongo-orm Documentation](https://github.com/drlsv91/pymongo-orm) - MongoDB ORM
- [ShadCN UI](https://ui.shadcn.com/) - UI component library
- [TanStack Query](https://tanstack.com/query) - Data fetching library

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/) - The React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Fast API framework
- [MongoDB](https://www.mongodb.com/) - Document database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - UI components
- [Lucide Icons](https://lucide.dev/) - Icons used in the dashboard
