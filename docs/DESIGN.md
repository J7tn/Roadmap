# Career Atlas App – Design Document

## 1. **Overview**

- **App Name**: *Career Atlas*
- **Purpose**: To help users discover and explore career paths through clear, visual roadmaps.
- **Target Audience**: Career switchers, students, professionals seeking growth or transition.
- **Scope**: Simple, focused app for career roadmap exploration only.

---

## 2. **Core Features**

### 🧭 Career Roadmaps

- Visual, step-by-step guides for each career path.
- Includes entry-level roles, mid-level progression, and advanced positions.
- Each node includes:
    - Required skills
    - Certifications
    - Time estimates
    - Salary ranges
    - Real-world job titles

### 🔍 Career Search & Discovery

- Browse careers by industry categories
- Search functionality with filters (experience level, salary range, remote-friendly)
- Clear, organized presentation of career information

### 📱 Mobile-Optimized Experience

- Responsive design for mobile devices
- Touch-friendly navigation
- Fast loading times for mobile networks
- Offline support for basic functionality

---

## 3. **User Flow**

1. **Landing**: View industry categories and featured career paths
2. **Browse**: Select an industry to see available career paths
3. **Explore**: View detailed roadmap for a specific career
4. **Search**: Use filters to find relevant careers
5. **Save**: Bookmark interesting career paths for later reference

---

## 4. **Technical Architecture (High-Level)**

- **Frontend**: React with TypeScript, Vite, Tailwind CSS
- **Data Storage**: Local JSON files with optimized structure
- **Performance**: Lazy loading, intelligent caching, bundle optimization
- **Mobile**: Progressive Web App (PWA) capabilities

---

## 5. **Simplified Scope**

### ✅ Included Features
- Career roadmap visualization
- Industry-based browsing
- Search and filtering
- Mobile-responsive design
- Offline support
- Bookmarking system

### ❌ Excluded Features (Simplified Scope)
- AI-powered recommendations
- Teen mode interface
- Career branching visualization
- Skill gap analysis
- User authentication/profiles
- Progress tracking
- Monetization features
- Community features
- Advanced AI features

---

## 6. **Current Implementation Status**

### ✅ Completed Features
- React/TypeScript setup with Vite
- Tailwind CSS styling system
- Radix UI component library integration
- Optimized TypeScript interfaces for career data
- Performance-optimized career service with caching
- Custom React hooks for data management
- Industry categories and sample career paths (4 industries)
- Advanced search component with filters
- Career roadmap visualization component
- Category selector for different career fields
- Career details modal/popup
- Responsive navigation header

### 🚧 In Progress
- Creating remaining career path data for 11 industries
- Mobile-specific optimizations
- Offline support implementation

### 📋 Next Steps
1. Complete data population for all 15 industries
2. Implement offline support
3. Add mobile-specific optimizations
4. Prepare for Google Play Store deployment

---

## 7. **Data Models**

### Career Node Interface
```typescript
interface CareerNode {
  id: string;
  title: string;
  level: 'Entry' | 'Intermediate' | 'Advanced' | 'Expert';
  skills: string[];
  certifications: string[];
  salaryRange: string;
  timeEstimate: string;
  description: string;
  jobTitles: string[];
  requirements: {
    education: string[];
    experience: string;
    skills: string[];
  };
}
```

### Career Path Interface
```typescript
interface CareerPath {
  id: string;
  name: string;
  category: string;
  nodes: CareerNode[];
  connections: Array<{
    source: string;
    target: string;
    requirements: string[];
  }>;
}
```

### Industry Category Interface
```typescript
interface IndustryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  jobCount: number;
  avgSalary: string;
  growthRate: string;
}
```

---

## 8. **UI/UX Guidelines**

### Design System
- **Primary Colors**: Professional blues and grays
- **Accent Colors**: Success greens, warning oranges, error reds
- **Typography**: Clean, readable fonts with clear hierarchy
- **Spacing**: Consistent 8px grid system
- **Components**: Accessible, reusable UI components

### User Experience Principles
1. **Intuitive Navigation**: Clear, logical flow between features
2. **Progressive Disclosure**: Show relevant information at the right time
3. **Mobile-First**: Responsive design optimized for mobile devices
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Performance**: Fast loading and smooth interactions

### Interaction Patterns
- **Hover States**: Provide feedback for interactive elements
- **Loading States**: Clear indication of data loading
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation of user actions

---

## 9. **Performance Requirements**

### Frontend Performance
- **Initial Load**: < 3 seconds on 3G connection
- **Interactive Elements**: < 100ms response time
- **Bundle Size**: < 500KB initial JavaScript bundle
- **Image Optimization**: WebP format with fallbacks

### Mobile Optimization
- **Touch Targets**: Minimum 44px for touch interactions
- **Swipe Gestures**: Intuitive navigation patterns
- **Battery Optimization**: Efficient data loading and caching
- **Memory Management**: Optimized for mobile device constraints

---

## 10. **Security Considerations**

### Data Protection
- **Local Storage**: Secure handling of user preferences
- **Input Validation**: Sanitize all user inputs
- **HTTPS**: Secure all communications when online

### Privacy Compliance
- **Data Minimization**: Only collect necessary data
- **User Consent**: Clear privacy policy
- **Transparency**: Open about data usage

---

## 11. **Testing Strategy**

### Testing Levels
1. **Unit Tests**: Individual component and function testing
2. **Integration Tests**: Component interaction testing
3. **E2E Tests**: Complete user journey testing
4. **Performance Tests**: Load and stress testing
5. **Accessibility Tests**: WCAG compliance verification

### Testing Tools
- **Frontend**: Jest, React Testing Library, Cypress
- **Performance**: Lighthouse, WebPageTest
- **Accessibility**: axe-core, Lighthouse

---

## 12. **Deployment Strategy**

### Environment Setup
- **Development**: Local development with hot reloading
- **Staging**: Pre-production testing environment
- **Production**: Live application deployment

### CI/CD Pipeline
- **Code Quality**: ESLint, Prettier, TypeScript checks
- **Testing**: Automated test suite execution
- **Build**: Optimized production builds
- **Deploy**: Automated deployment to staging/production

### Mobile App Deployment
- **Google Play Store**: APK/AAB package optimization
- **App Size**: Target < 50MB for initial download
- **Updates**: Efficient delta updates

---

*Last Updated: [Current Date]*
*Version: 2.0 - Simplified Scope*
