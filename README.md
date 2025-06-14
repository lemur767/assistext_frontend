# AssisText - AI-Powered SMS Response System

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-blue.svg)](https://tailwindcss.com/)

> **AssisText** is an intelligent SMS automation platform that uses AI to generate personalized responses for your text messages. Perfect for businesses, professionals, and anyone who needs to manage high-volume SMS communications efficiently.

## 🚀 Features

### Core Functionality
- **🤖 AI-Powered Responses** - Intelligent SMS reply generation using advanced language models
- **📱 Real-time Messaging** - Live SMS conversation management with WebSocket support
- **👤 Profile Management** - Multiple response profiles for different business contexts
- **📊 Analytics Dashboard** - Comprehensive usage statistics and conversation insights
- **👥 Client Management** - Organize and manage your contacts effectively

### Business Features
- **💳 Subscription Management** - Integrated billing with Stripe
- **🔒 Authentication & Security** - JWT-based secure user authentication
- **⚙️ AI Settings** - Customize AI behavior and response styles
- **📈 Usage Analytics** - Track response rates, engagement metrics, and ROI
- **🌙 Dark Mode** - Beautiful dark/light theme switching

### Technical Features
- **⚡ Real-time Updates** - WebSocket integration for instant message delivery
- **📱 Responsive Design** - Mobile-first approach with beautiful UI
- **🎨 Modern UI/UX** - Clean, professional interface with smooth animations
- **🔧 Developer-Friendly** - TypeScript, ESLint, and modern tooling

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.2** - Modern React with Hooks and Suspense
- **TypeScript 5.3** - Type-safe development
- **Vite 6.3** - Lightning-fast development server and build tool

### Styling & UI
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Custom Design System** - Brand-consistent components and themes
- **React Icons** - Comprehensive icon library
- **Lucide React** - Beautiful, customizable SVG icons

### State Management & Data
- **TanStack Query 5.8** - Powerful data fetching and caching
- **React Hook Form 7.48** - Performant form management
- **React Context** - Global state management for auth and UI

### Real-time & Communication
- **Socket.IO Client 4.7** - Real-time bidirectional communication
- **Axios 1.6** - HTTP client for API requests
- **React Toastify** - Beautiful toast notifications

### Development Tools
- **ESLint 8.57** - Code linting and quality enforcement
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic vendor prefixing

## 📦 Installation

### Prerequisites
- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (or **yarn** 1.22+)
- **Git** for version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/assistext-frontend.git
   cd assistext-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_WS_URL=ws://localhost:5000
   VITE_APP_NAME=AssisText
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout/         # Layout components (AppLayout, AuthLayout)
│   ├── common/         # Common components (ProtectedRoute, ErrorBoundary)
│   └── ui/             # Basic UI components (Button, Input, etc.)
├── pages/              # Route components
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Authentication pages
│   ├── Register.tsx    
│   ├── MessagingInterface.tsx
│   ├── ProfileManagement.tsx
│   ├── AISettings.tsx
│   ├── Analytics.tsx
│   ├── ClientManagement.tsx
│   ├── Settings.tsx
│   └── Billing.tsx
├── context/            # React context providers
│   ├── AuthContext.tsx # Authentication state
│   └── UIContext.tsx   # UI state (theme, modals)
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── useUI.ts        # UI state hook
│   └── useWebSocket.ts # WebSocket connection
├── api/                # API client functions
│   ├── auth.ts         # Authentication endpoints
│   ├── messages.ts     # Message management
│   ├── profiles.ts     # Profile management
│   └── analytics.ts    # Analytics endpoints
├── types/              # TypeScript type definitions
│   ├── auth.ts         # Authentication types
│   ├── message.ts      # Message types
│   └── api.ts          # API response types
├── utils/              # Utility functions
│   ├── formatters.ts   # Data formatting utilities
│   ├── validators.ts   # Form validation helpers
│   └── constants.ts    # App constants
├── styles/             # Global styles
│   └── globals.css     # Tailwind base styles + custom CSS
├── App.tsx             # Main app component with routing
└── index.tsx           # Entry point
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build locally

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors automatically
npm run type-check       # Run TypeScript type checking

# Testing (when implemented)
npm run test             # Run unit tests
npm run test:coverage    # Run tests with coverage report
npm run test:e2e         # Run end-to-end tests
```

## ⚙️ Environment Configuration

### Development (.env.local)
```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000

# App Configuration
VITE_APP_NAME=AssisText
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION="AI-Powered SMS Response System"

# Third-party Services
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
VITE_DEBUG_MODE=true
```

### Production (.env.production)
```env
# API Configuration
VITE_API_URL=https://api.assistext.ca
VITE_WS_URL=wss://api.assistext.ca

# App Configuration
VITE_APP_NAME=AssisText
VITE_APP_VERSION=1.0.0

# Third-party Services
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DARK_MODE=true
VITE_DEBUG_MODE=false
```

## 🎨 Customization

### Theme Configuration
The app uses a custom design system built on Tailwind CSS. You can customize the theme in `tailwind.config.js`:

```javascript
// Brand colors
colors: {
  brand: {
    primary: '#0b5775',    // Main brand color
    secondary: '#be5cf0',  // Secondary accent
    accent: '#d214c2',     // Call-to-action color
  }
}
```

### Component Styling
Global styles are defined in `src/styles/globals.css` using CSS custom properties for easy theme switching:

```css
:root {
  --primary-color: #0b5775;
  --secondary-color: #be5cf0;
  --accent-color: #d214c2;
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist/ folder to Netlify or connect your Git repository
```

### Deploy with Docker
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔌 API Integration

The frontend connects to the AssisText backend API. Key integration points:

### Authentication
```typescript
// Login flow
const { login } = useAuth();
await login(email, password);
```

### Real-time Messaging
```typescript
// WebSocket connection
const socket = useWebSocket();
socket.on('new_message', handleNewMessage);
```

### Data Fetching
```typescript
// Using TanStack Query
const { data: messages } = useQuery({
  queryKey: ['messages'],
  queryFn: fetchMessages
});
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards
- **TypeScript** - All new code must be written in TypeScript
- **ESLint** - Follow the project's ESLint configuration
- **Prettier** - Code formatting is handled automatically
- **Testing** - Write tests for new features (when test setup is complete)

### Commit Convention
```
feat: add new messaging interface
fix: resolve authentication bug
docs: update README
style: improve button styling
refactor: reorganize component structure
test: add unit tests for auth service
```

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🔒 Security

- **Environment Variables** - Sensitive data is stored in environment variables
- **JWT Authentication** - Secure token-based authentication
- **HTTPS Only** - Production deployment requires HTTPS
- **Input Validation** - All user inputs are validated client and server-side
- **XSS Protection** - React's built-in XSS protection + additional sanitization

## 📊 Performance

- **Bundle Splitting** - Automatic code splitting with Vite
- **Tree Shaking** - Unused code elimination
- **Image Optimization** - Optimized image loading
- **Caching** - Intelligent caching with TanStack Query
- **Lazy Loading** - Route-based code splitting

## 🐛 Troubleshooting

### Common Issues

**Development server won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**
```bash
# Run type checking
npm run type-check
```

**Styling issues**
```bash
# Rebuild Tailwind
npm run build
```

**API connection issues**
```bash
# Check environment variables
echo $VITE_API_URL
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Development** - [Your Team]
- **UI/UX Design** - [Design Team]
- **Backend Integration** - [Backend Team]

## 📞 Support

- **Documentation** - [docs.assistext.ca](https://docs.assistext.ca)
- **Email** - support@assistext.ca
- **Issues** - [GitHub Issues](https://github.com/your-org/assistext-frontend/issues)

---

**Made with ❤️ in Canada 🇨🇦**

For more information, visit [assistext.ca](https://assistext.ca)