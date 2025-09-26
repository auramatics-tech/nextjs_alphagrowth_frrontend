# Layout Structure - Best Practices Implementation

## Overview
This document outlines the proper layout structure implemented following Next.js best practices, where layout components are used once and pages are passed as children.

## Layout Hierarchy

### 1. Root Layout (`app/layout.tsx`)
- **Purpose**: Global layout for the entire application
- **Contains**: HTML structure, global styles, metadata
- **Used by**: All pages

### 2. Auth Layout (`components/layout/AuthLayout`)
- **Purpose**: Clean layout for authentication pages
- **Contains**: Logo, centered form, no sidebar
- **Used by**: Login, Signup pages
- **Features**: 
  - Clean, focused design
  - No navigation distractions
  - Responsive design

### 3. Main Layout (`components/layout/MainLayout`)
- **Purpose**: Main application layout with sidebar
- **Contains**: Sidebar, header, main content area
- **Used by**: All authenticated pages via route groups
- **Features**:
  - Collapsible sidebar
  - Navigation menu
  - User profile section
  - Header with actions

### 4. Route Group Layouts

#### Dashboard Route Group (`app/(dashboard)/layout.tsx`)
- **Purpose**: Wraps all dashboard-related pages
- **Uses**: MainLayout component
- **Pages**: Dashboard, Campaigns
- **Features**: Consistent sidebar and navigation

#### Dynamic Layout Features
- **Dynamic Page Titles**: Uses `usePageTitle` hook to set titles based on route
- **Shared Header Actions**: Search, notifications, and help buttons for all pages
- **Consistent Navigation**: Same sidebar and layout for all dashboard pages

## File Structure

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Login (uses AuthLayout)
├── signup/page.tsx               # Signup (uses AuthLayout)
├── (dashboard)/                  # Route group for authenticated pages
│   ├── layout.tsx               # Single layout for all dashboard pages
│   ├── dashboard/page.tsx       # Dashboard page
│   └── campaigns/page.tsx       # Campaigns page
└── onboarding/                  # Onboarding pages (use Header only)
    ├── business-overview/page.tsx
    ├── business-profile/page.tsx
    ├── icp-drafts/page.tsx
    ├── gtm-goal/page.tsx
    └── success/page.tsx

components/layout/
├── MainLayout/                   # Main app layout with sidebar
├── AuthLayout/                   # Clean auth layout
├── Header/                       # Simple header component
└── index.ts                      # Exports
```

## Best Practices Implemented

### 1. **Single Layout Component**
- ✅ MainLayout is defined once and reused
- ✅ No duplication of sidebar/header code
- ✅ Consistent behavior across all pages

### 2. **Route Groups**
- ✅ `(dashboard)` group for authenticated pages
- ✅ Shared layout for related pages
- ✅ Clean URL structure

### 3. **Layout Composition**
- ✅ Pages are passed as children to layouts
- ✅ Layouts can be nested (route group + page-specific)
- ✅ Flexible header actions per page

### 4. **Separation of Concerns**
- ✅ Auth pages: Clean, focused design
- ✅ Dashboard pages: Full sidebar navigation
- ✅ Onboarding pages: Simple header only

### 5. **Reusability**
- ✅ MainLayout can be used for any authenticated page
- ✅ Header component can be used independently
- ✅ Easy to add new pages with consistent layout

## Usage Examples

### Adding a New Dashboard Page
```typescript
// app/(dashboard)/new-page/page.tsx
export default function NewPage() {
  return (
    <div>
      {/* Page content - layout is provided by (dashboard)/layout.tsx */}
    </div>
  );
}
```

### Adding a New Auth Page
```typescript
// app/new-auth/page.tsx
import { AuthLayout } from '../components/layout';

export default function NewAuthPage() {
  return (
    <AuthLayout title="New Auth Page">
      {/* Auth form content */}
    </AuthLayout>
  );
}
```

### Custom Header Actions
```typescript
// app/(dashboard)/custom-page/layout.tsx
import { MainLayout } from '../../../components/layout/MainLayout';

export default function CustomLayout({ children }) {
  const customActions = (
    <div>
      {/* Custom header actions */}
    </div>
  );

  return (
    <MainLayout title="Custom Page" headerActions={customActions}>
      {children}
    </MainLayout>
  );
}
```

## Benefits

1. **Maintainability**: Layout changes in one place affect all pages
2. **Consistency**: All pages have the same look and feel
3. **Performance**: Layout components are not re-rendered unnecessarily
4. **Scalability**: Easy to add new pages with consistent layout
5. **Flexibility**: Can customize specific pages while maintaining consistency

## Migration Notes

- ✅ Removed duplicate layout code from individual pages
- ✅ Centralized layout logic in reusable components
- ✅ Maintained all existing designs and functionality
- ✅ Improved code organization and maintainability
