# 🚀 Portfolio Website

A modern, responsive portfolio website built with Next.js 15, featuring a sleek dashboard, authentication system, and comprehensive portfolio management tools.

## ✨ Features

### 🎨 **Modern Design**
- **Responsive Layout** - Optimized for all devices and screen sizes
- **Dark/Light Theme** - Toggle between themes with persistent preferences
- **Smooth Animations** - Engaging hover effects and transitions
- **Professional UI** - Clean, minimalist design using shadcn/ui components

### 🔐 **Authentication & Security**
- **NextAuth.js Integration** - Secure authentication system for portfolio management
- **Protected Routes** - Dashboard access requires authentication
- **Session Management** - Persistent user session
- **Singleton Login Functionality** - Only master user can signup and then he can disable that functionality
- **Secure API Endpoints** - Protected backend routes

### 📊 **Dashboard System**
- **Responsive Sidebar** - Collapsible navigation on mobile devices
- **Statistics Overview** - Visual representation of portfolio data
- **Quick Actions** - Easy access to common tasks
- **Recent Activity** - Track portfolio updates and changes
- **Mobile-First Design** - Touch-friendly interface with mobile toggle

### 📝 **Portfolio Management**
- **Profile Management** - Edit personal information and social links
- **Education Tracking** - Manage educational background
- **Experience Management** - Track work history and positions
- **Project Portfolio** - Showcase projects with details and status
- **Certifications** - Display professional achievements
- **Company Management** - Track work experience by company

### 🎯 **Portfolio Sections**
- **Hero Section** - Eye-catching introduction
- **About Section** - Personal story and background
- **Skills & Technologies** - Technical expertise showcase
- **Project Gallery** - Interactive project showcase
- **Contact Information** - Multiple ways to connect

## 🛠️ Technologies Used

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations

### **Backend & Database**
- **Prisma** - Type-safe database ORM
- **MongoDB** - Non-Relational database
- **NextAuth.js** - Authentication framework
- **API Routes** - RESTful API endpoints

### **Styling & UI**
- **CSS Variables** - Dynamic theming system
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG compliant components
- **Modern CSS** - Grid, Flexbox, and advanced layouts
- **Radix UI** - For consistency in designing
- **Shadcn UI** - Dynamic and smooth component functionality

### **Development Tools**
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Hot Reload** - Fast development experience

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- MongoDB database

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nextjs-portfolio.git
   cd nextjs-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="your-mongodb-url"
   NEXTAUTH_SECRET="your-next-auth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
   CLOUDINARY_API_KEY="cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   CLOUDINARY_FOLDER="your-cloudinary-folder-name"
   ADMIN_EMAILS="owner@example.com" # Optional comma-separated admin emails for dashboard write access
   ENABLE_SIGNUP=false # TRUE will allow to sign up and FALSE will not
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard pages
│   │   └── projects/          # Project showcase
│   ├── components/            # Reusable components
│   │   ├── ui/                # shadcn/ui components
│   │   └── providers/         # Context providers
│   ├── constants/             # Static data and constants
│   ├── hooks/                 # Custom React hooks
│   ├── interfaces/            # TypeScript interfaces
│   ├── lib/                   # Utility functions
│   └── middleware.ts          # Next.js middleware
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── components.json            # shadcn/ui configuration
```

## 🎨 Customization

### **Theme Configuration**
The project uses CSS variables for theming. Update colors in `globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --muted: 210 40% 96%;
  --border: 214.3 31.8% 91.4%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --border: 217.2 32.6% 17.5%;
}
```

### **Adding New Sections**
1. Create new components in `src/components/`
2. Add routes in `src/app/`
3. Update navigation in `src/constants/NavLinks.ts`
4. Style with Tailwind CSS classes

## 📱 Responsive Features

### **Mobile-First Design**
- **Collapsible Sidebar** - Hidden by default on mobile, toggle with button
- **Touch-Friendly** - Large touch targets and smooth gestures
- **Adaptive Layout** - Grid systems that work on all screen sizes
- **Mobile Navigation** - Optimized navigation for small screens

### **Breakpoint System**
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking

# Database
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma migrate   # Run database migrations
```

## 🌟 Recent Updates

### **v2.0.0 - Dashboard & Responsiveness**
- ✨ **New Dashboard System** - Comprehensive portfolio management
- 📱 **Mobile Responsiveness** - Collapsible sidebar and touch-friendly interface
- 🎨 **Theme System** - Dark/light mode with CSS variables
- 🔐 **Authentication** - Secure login and protected routes
- 📊 **Statistics Cards** - Visual data representation
- 🚀 **Performance** - Optimized loading and smooth animations

### **v1.0.0 - Initial Release**
- 🌐 **Portfolio Website** - Professional showcase
- 📝 **Content Management** - Easy content updates
- 🎯 **SEO Optimized** - Search engine friendly
- 📱 **Responsive Design** - Works on all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Next.js Team** - Amazing React framework
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel** - Deployment platform

## 📞 Support

If you have any questions or need help:

- 📧 **Email**: hfurqan.se@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/furqanahmad03/nextjs-portfolio/issues)
- 📖 **Portfolio**: [Furqan Ahmad](https://furqanahmad.netlify.app)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
