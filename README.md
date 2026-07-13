# Portfolio Builder

An open-source, dashboard-controlled portfolio built with Next.js. The current application powers a published personal portfolio and provides an authenticated dashboard for managing profile information, experience, education, projects, certifications, clients, blog posts, case studies, and contact queries.

This repository is now evolving into something bigger: a platform where anyone can sign in, add their content, choose a portfolio template, customize card styles and color combinations, and publish a portfolio that is rendered from those choices.

> The multi-user portfolio builder is the product direction, not a finished feature. The current release is a working single-portfolio foundation, and community contributions will help turn it into a complete platform.

## Live portfolio

[View the published portfolio](https://furqanahmad.me)

## What works today

- Responsive public portfolio with light and dark themes
- Portfolio sections for profile, experience, education, projects, and certifications
- Project details, case studies, blogs, and Markdown/MDX editing
- Credential-based authentication and protected dashboard routes
- Dashboard management for portfolio content, clients, queries, and database backups
- MongoDB persistence through Prisma
- Cloudinary uploads for portfolio media
- Contact form and email replies

## The product vision

The goal is to make portfolio creation visual, flexible, and accessible to people who do not want to design or code a site from scratch.

A user should be able to:

1. Create an account and sign in.
2. Add profile, education, experience, skills, projects, and social links.
3. Browse and select a portfolio template.
4. Choose card layouts, typography, spacing, and section styles.
5. Build a color palette or select a prepared color combination.
6. Preview changes as they are made.
7. Publish a unique portfolio generated from the selected content and design settings.
8. Return to the dashboard at any time to update or republish it.

In short, the platform should turn structured user content plus design preferences into a polished, responsive portfolio.

## Roadmap

The roadmap is intentionally open so contributors can help shape both the architecture and the user experience.

### 1. Multi-user foundation

- Public registration, sign-in, password recovery, and account management
- User-owned portfolio data with strict authorization boundaries
- Unique usernames and public portfolio URLs
- Draft, preview, and published portfolio states
- Safe migration from the current single-owner data model

### 2. Customization engine

- A reusable template registry
- Multiple portfolio templates and section arrangements
- Selectable card variants for projects, experience, education, and blogs
- Curated color palettes and custom color controls
- Typography, spacing, radius, and visual-style settings
- Accessible defaults and contrast validation

### 3. Portfolio renderer

- Render a portfolio from the user's content and saved theme configuration
- Live preview across desktop, tablet, and mobile sizes
- Stable public routes for every published portfolio
- SEO metadata, social sharing images, and sitemap support
- Fast loading, caching, and image optimization

### 4. Product experience

- Guided onboarding and sample content
- Template and palette previews
- Reordering and toggling portfolio sections
- Custom domains
- Import/export and data portability
- Analytics and portfolio insights

These phases are not fixed. If you have a better technical or product approach, start a discussion or open an issue before implementing a large change.

## Help build it

Contributions of all sizes are welcome. Useful ways to contribute include:

- Designing portfolio templates, cards, palettes, and onboarding flows
- Refactoring the data model for secure multi-user ownership
- Building the template registry and rendering system
- Improving authentication, validation, accessibility, tests, and documentation
- Reporting bugs or proposing product ideas through [GitHub Issues](https://github.com/furqanahmad03/dashboard-controlled-portfolio/issues)

For a substantial feature, please open an issue first. Describe the problem, proposed behavior, and any data-model or UI impact. This helps contributors align before investing significant time.

### Contribution workflow

1. Fork the repository.
2. Create a branch from the default branch:

   ```bash
   git checkout -b feature/short-description
   ```

3. Make a focused change and test it locally.
4. Commit with a clear message:

   ```bash
   git commit -m "Add template selection"
   ```

5. Push your branch and open a pull request.

In the pull request, explain what changed, why it changed, how it was tested, and include screenshots for visual updates.

## Tech stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4, shadcn/ui, and Radix UI
- Framer Motion
- NextAuth.js
- Prisma with MongoDB
- Cloudinary
- React Hook Form and Zod

## Run locally

### Prerequisites

- Node.js 20 or later
- npm
- A MongoDB database
- A Cloudinary account for media uploads

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/furqanahmad03/dashboard-controlled-portfolio.git
   cd dashboard-controlled-portfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="your-mongodb-connection-string"
   NEXTAUTH_SECRET="your-long-random-secret"
   NEXTAUTH_URL="http://localhost:3000"

   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   CLOUDINARY_FOLDER="your-folder-name"

   ADMIN_EMAIL=owner@example.com
   OR ADMIN_EMAILS=admin_emails
   
   ENABLE_SIGNUP=true

   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=email_port
   EMAIL_USER=sender@example.com
   EMAIL_USER_PASS="sender_app_password"
   EMAIL_RECEIVER="receiver@gmail.com"
   EMAIL_RECEIVER_PASS="receiver_app_password"
   
   NEXT_PUBLIC_GA_ID="google_analytics_id"
   ```

   `ADMIN_EMAILS` is a comma-separated allowlist for dashboard access. Set `ENABLE_SIGNUP` to `false` after creating the local owner account if you do not want additional registrations in the current single-portfolio version.

4. Generate the Prisma client and sync the database schema:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Available scripts

```bash
npm run dev      # Start the development server with Turbopack
npm run build    # Create a production build
npm run start    # Run the production build
npm run lint     # Run lint checks
```

## Project structure

```text
├── prisma/                 # Prisma schema
├── public/                 # Static files
└── src/
    ├── app/                # Pages, layouts, dashboard, and API routes
    ├── components/         # Portfolio, dashboard, editor, and UI components
    ├── constants/          # Navigation and shared static data
    ├── hooks/              # React hooks
    ├── interfaces/         # Domain interfaces
    └── lib/                # Authentication, database, email, media, and utilities
```

## Important architecture note

The existing schema was created for one managed portfolio. Some portfolio records are not yet linked to an owning user. Multi-user contributions must introduce ownership and authorization consistently across the schema, API routes, dashboard queries, media operations, and public rendering. Adding public registration alone is not sufficient to make the application safely multi-tenant.

## Support

- Email: [hfurqan.se@gmail.com](mailto:hfurqan.se@gmail.com)
- Bugs and ideas: [GitHub Issues](https://github.com/furqanahmad03/dashboard-controlled-portfolio/issues)
- Published portfolio: [furqanahmad.netlify.app](https://furqanahmad.me)

## License

This project is available under the [MIT License](LICENSE).
