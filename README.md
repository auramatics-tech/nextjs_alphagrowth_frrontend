# AlphaGrowth Frontend

A modern, responsive login page for the AlphaGrowth AI-powered growth platform.

## Features

- 🔐 Secure login form with email/password authentication
- 👁️ Password visibility toggle
- 🔄 Loading states and error handling
- 🌐 SSO integration (Google & Outlook)
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion
- 🎨 Beautiful UI with Tailwind CSS
- 🏗️ Built with Next.js 14 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Login page component
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── next.config.js       # Next.js configuration
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Customization

The login page uses a custom AlphaGrowth logo and brand colors:
- Primary: Orange gradient (#FF6B2C to #3AA3FF)
- Secondary: Blue accent (#3AA3FF)

You can modify colors in `tailwind.config.js` and the logo in the `AlphaGrowthLogo` component.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

Private project for AlphaGrowth.
