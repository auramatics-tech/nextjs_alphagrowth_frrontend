# Frontend Project Structure

This document outlines the scalable and maintainable structure implemented for the AlphaGrowth frontend application.

## Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group for auth pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/              # Route group for authenticated pages
│   │   ├── dashboard/
│   │   ├── campaigns/
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── onboarding/               # Onboarding flow
│   │   ├── business-overview/
│   │   ├── business-profile/
│   │   ├── icp-drafts/
│   │   ├── gtm-goal/
│   │   └── success/
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # Shared components
│   ├── common/                   # Reusable UI components
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── AlphaGrowthLogo/
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── Header/
│   │   ├── DashboardLayout/
│   │   ├── AuthLayout/
│   │   └── index.ts
│   ├── navigation/               # Navigation components
│   └── index.ts
│
├── features/                     # Feature-based organization
│   ├── auth/                     # Authentication feature
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   ├── campaigns/                # Campaigns feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── onboarding/               # Onboarding feature
│   │   ├── components/
│   │   │   └── OnboardingStepper.tsx
│   │   ├── hooks/
│   │   └── services/
│   └── dashboard/                # Dashboard feature
│       ├── components/
│       ├── hooks/
│       └── services/
│
├── services/                     # API services
│   └── authService.ts            # Auth API calls
│
├── hooks/                        # Shared hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
│
├── utils/                        # Utility functions
│   ├── validation.ts
│   ├── formatters.ts
│   ├── constants.ts
│   └── index.ts
│
├── types/                        # TypeScript types
│   ├── common.types.ts
│   ├── auth.types.ts
│   └── index.ts
│
├── lib/                          # Third-party library configs
│   └── apiClient.ts
│
├── public/                       # Static assets
├── .env.local                    # Environment variables
└── package.json
```

## Key Features

### 1. Feature-Based Organization
- Each feature has its own directory with components, hooks, services, and types
- Easier to maintain and scale as the team grows
- Clear separation of concerns

### 2. Reusable Components
- Common UI components in `components/common/`
- Layout components in `components/layout/`
- Each component has its own directory with index.ts for clean exports

### 3. Centralized API Layer
- `lib/apiClient.ts` - Centralized Axios configuration
- `services/` - Feature-specific API calls
- Consistent error handling and authentication

### 4. Type Safety
- Centralized type definitions in `types/`
- Feature-specific types in feature directories
- Shared common types

### 5. Custom Hooks
- Shared hooks in `hooks/`
- Feature-specific hooks in feature directories
- Reusable logic extraction

### 6. Utility Functions
- Validation helpers
- Formatters
- Constants and configuration

## Usage Examples

### Importing Components
```typescript
// Import from main components index
import { Button, Input, AlphaGrowthLogo } from '../components';

// Import specific components
import { DashboardLayout } from '../components/layout';
import { OnboardingStepper } from '../features/onboarding/components';
```

### Using Hooks
```typescript
import { useAuth } from '../features/auth/hooks/useAuth';
import { useDebounce } from '../hooks';
```

### API Calls
```typescript
import { authService } from '../services/authService';
import apiClient from '../lib/apiClient';
```

### Types
```typescript
import { User, LoginCredentials } from '../types';
import { AuthState } from '../features/auth/types';
```

## Benefits

1. **Scalability**: Easy to add new features without affecting existing code
2. **Maintainability**: Clear organization makes code easier to find and modify
3. **Reusability**: Shared components and utilities reduce code duplication
4. **Type Safety**: Comprehensive TypeScript coverage
5. **Team Collaboration**: Clear structure helps team members understand the codebase
6. **Testing**: Organized structure makes it easier to write and maintain tests

## Migration Notes

- All existing designs and functionality have been preserved
- Components have been refactored to use the new structure
- Import statements have been updated to use the new paths
- No breaking changes to the user experience










