# Comprehensive Prompt: Virima Documentation Website

## Project Overview
Build a world-class, corporate professional documentation website for Virima - a comprehensive documentation platform designed for long-term use with exceptional design quality, comparable to industry-leading documentation sites like Stripe, Tailwind CSS, or Vercel.

## Brand & Design System

### Color Palette
- **Background**: Milky white (#FEFEFE or #FAFAFA) for main content areas
- **Text**: Dark slate black (#1E293B or #0F172A) - avoid pure black (#000000)
- **Brand Color**: Virima brand green (use emerald-600 #059669 as primary green)
- **Accent Gradients**: Emerald/blue/green gradient themes for premium elements
- **Secondary Colors**: Subtle grays for borders and backgrounds

### Design Principles
- **Premium & Classy**: The site should feel enterprise-grade and sophisticated
- **Clean Aesthetics**: Minimalist approach, generous whitespace
- **No Icon Clutter**: Do NOT use icons before deliverable names in navigation
- **Version Display**: Show version numbers WITHOUT "v" prefix (e.g., "6.1" not "v6.1")
- **Typography**: Use default typography from globals.css, avoid custom font size/weight classes unless specifically needed
- **Consistent Spacing**: Maintain visual rhythm throughout

## Landing Page (Homepage)

### Hero Section
- **Premium Design**: Classy hero with emerald/blue/green gradient background
- **Headline**: "Virima Documentation" with professional tagline
- **Description**: Brief intro about comprehensive documentation for IT service management
- **CTA Buttons**: 
  - Primary: "Get Started" (links to documentation)
  - Secondary: "View API Docs"
- **Visual Elements**: Modern, clean design with subtle animations

### Features Section
- Highlight key capabilities:
  - Comprehensive module documentation
  - Multi-version support
  - AI-powered search
  - API integration guides
  - Compatibility matrices

### Version Selector Preview
- Show available versions in an elegant grid/card layout
- Versions: 5.13, 6.1, 6.1.1, NextGen
- Each version card should be clickable

### Module Overview
- Display all 10 Virima modules in a grid
- Clean card design for each module
- Modules:
  1. My Dashboard
  2. CMDB
  3. Discovery & Scan
  4. ITAM
  5. ITSM
  6. Reports
  7. Self Service
  8. Program & Project Management
  9. Risk Register
  10. Vulnerability Management

### Quick Links Section
- Getting Started
- Online Help
- Release Notes
- Manuals
- API Integration
- Compatibility Matrix

### Footer
- Links to important resources
- Copyright information
- Social links (optional)

## Documentation Structure

### Version Control System
Support for 4 versions:
- **5.13** (Version 5.13)
- **6.1** (Version 6.1)
- **6.1.1** (Version 6.1.1)
- **NextGen** (NextGen)

### Deliverable Categories
Six main deliverable types across all modules:
1. **Getting Started** - Quick start guides and tutorials
2. **Online Help** - Comprehensive help documentation
3. **Release Notes** - Version-specific release information
4. **Manuals** - Detailed user guides
5. **API Integration** - API documentation and integration guides
6. **Compatibility Matrix** - System requirements and compatibility info

### Module List
10 Virima modules (use exact naming):
1. My Dashboard
2. CMDB
3. Discovery & Scan
4. ITAM
5. ITSM
6. Reports
7. Self Service
8. Program & Project Management
9. Risk Register
10. Vulnerability Management

### Navigation Hierarchy (Three Parent Topics)
The left navigation should be organized under three collapsible parent topics:

#### 1. Modules (Parent Topic)
- Contains all 10 modules as sub-items
- Each module expands to show deliverables
- Structure: Modules → [Module Name] → [Deliverable Type] → [Content]

#### 2. Documentation (Parent Topic)
- Cross-cutting documentation not specific to modules
- Contains:
  - Getting Started (general)
  - Online Help (general)
  - Release Notes (general)

#### 3. Resources (Parent Topic)
- API Integration (general guides)
- Compatibility Matrix (system-wide requirements)
- Manuals (general documentation)

## Three-Pane Documentation Layout

### Left Pane - Navigation Sidebar
- **Collapsible Sections**: Three parent topics with expand/collapse functionality
- **Module Navigation**: Hierarchical tree structure
- **Active States**: Highlight current page/section
- **Sticky Position**: Sidebar remains fixed during scroll
- **Smooth Scrolling**: Auto-scroll to active item
- **Width**: ~280-320px

### Center Pane - Main Content Area
- **Milky White Background**: Clean, easy-to-read
- **Max Width**: ~800-900px for optimal readability
- **Breadcrumb Navigation**: 
  - Full hierarchical path (Module → Deliverable → Page)
  - Clickable breadcrumb items
  - Separator: "/" or "›"
- **MDX Rendering**: Rich content support
- **Code Blocks**: Syntax highlighted
- **Typography**: Optimized for long-form reading
- **Images**: Support for screenshots and diagrams
- **Tables**: Styled data tables
- **Responsive**: Adapts to screen size

### Right Pane - Table of Contents
- **On-Page Navigation**: Auto-generated from H2/H3 headings
- **Sticky Position**: Follows scroll
- **Active Heading**: Highlight current section in viewport
- **Smooth Scroll**: Click to jump to section
- **Width**: ~220-260px
- **Show on Desktop Only**: Hide on tablet/mobile

## Header & Navigation

### Top Header
- **Logo**: "Virima" branding with brand green color
- **Version Selector Dropdown**: 
  - Current version displayed
  - Dropdown to switch versions
  - Versions: 5.13, 6.1, 6.1.1, NextGen (no "v" prefix)
- **AI Search Button**: 
  - Prominent placement
  - Icon: AI/sparkle/stars icon
  - Opens AI search dialog
- **Login Button**: 
  - Secondary style
  - Opens premium login dialog
- **Responsive**: Hamburger menu on mobile

## AI-Powered Search

### Search Dialog
- **Trigger**: Click AI search button or keyboard shortcut (Cmd+K / Ctrl+K)
- **Modal/Dialog**: Full-screen or large centered dialog
- **Search Input**: 
  - Placeholder: "Ask AI anything about Virima..."
  - Auto-focus on open
- **AI Icon**: Display AI/sparkle icon
- **Search Scope**: 
  - Can filter by version
  - Can filter by module
  - Can filter by deliverable type
- **Results Display**: 
  - Show relevant documentation matches
  - Highlight matching text
  - Link to full content
- **Keyboard Navigation**: Arrow keys + Enter
- **Close**: ESC key or click outside

### Search Functionality
- Real-time search as user types (with debounce)
- Search across all MDX content
- Fuzzy matching for better results
- Context preview in results

## Login Dialog

### Premium Design
- **Elegant Modal**: Centered, clean design
- **Gradient Accents**: Subtle emerald/blue/green gradient
- **Form Fields**:
  - Email/Username input
  - Password input
  - "Remember me" checkbox
  - "Forgot password?" link
- **Submit Button**: Virima brand green
- **Social Login**: Optional (Google, Microsoft, etc.)
- **Sign Up Link**: "Don't have an account? Sign up"
- **Close Button**: X in top-right

### Authentication (Mock)
- For demo purposes, accept any credentials
- Show success message
- Update UI to show logged-in state
- Display user avatar/name in header

## MDX Content System

### File Structure
```
/content/
  ├── [version]/              # 5_13, 6_1, 6_1_1, NG
  │   └── [module]/           # my-dashboard, cmdb, etc.
  │       └── [content].mdx   # Individual content files
  │
  ├── [module]/               # Module-specific deliverables
  │   ├── getting-started/
  │   ├── online-help/
  │   ├── release-notes/
  │   ├── manuals/
  │   ├── api-integration/
  │   └── compatibility-matrix/
  │
  └── [deliverable]/          # General deliverables
      └── [content].mdx
```

### Content Loader (contentLoader.ts)
- **Static Imports**: Pre-import all MDX files
- **Dynamic Loading**: Load content based on route parameters
- **Fallback System**: 
  - Gracefully handle missing content
  - Display "Content coming soon" message for unavailable files
  - Show hardcoded placeholder content when MDX not available
- **Type Safety**: TypeScript interfaces for content structure

### MDX Features Support
- **Headings**: H1-H6 with proper hierarchy
- **Lists**: Ordered and unordered
- **Code Blocks**: Syntax highlighting
- **Tables**: Formatted data tables
- **Links**: Internal and external
- **Images**: With proper paths
- **Blockquotes**: For callouts
- **Custom Components**: Support MDX component imports

### Path Resolution
- **Utility**: mdxPathResolver.ts
- **Purpose**: Resolve correct MDX file path based on:
  - Current version
  - Current module
  - Current deliverable
  - Current page/topic
- **Normalization**: Handle different path formats

## Breadcrumb Navigation

### Requirements
- **Fully Hierarchical**: Show complete navigation path
- **Clickable**: Each segment is a link
- **Dynamic**: Updates based on current location
- **Format**: Home › Modules › My Dashboard › Getting Started › Quick Start
- **Separators**: Use › or / for visual separation
- **Responsive**: Truncate or scroll on mobile
- **Styling**: Use shadcn/ui breadcrumb component

### Example Paths
- Home › Documentation › Getting Started
- Home › Modules › CMDB › API Integration › Overview
- Home › Resources › Compatibility Matrix
- Home › Modules › My Dashboard › Online Help › System Icons

## Responsive Design

### Breakpoints
- **Desktop**: 1280px+ (three-pane layout)
- **Tablet**: 768px-1279px (two-pane: content + collapsible sidebar)
- **Mobile**: <768px (single pane with hamburger menu)

### Mobile Behavior
- Hide right TOC panel
- Collapsible left sidebar (hamburger)
- Full-width content
- Simplified header
- Touch-friendly interactive elements

## Technical Implementation

### Tech Stack
- **React**: Main framework
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling (use design tokens from globals.css)
- **shadcn/ui**: Component library
- **Lucide React**: Icons
- **MDX**: Content format

### Required Components

#### Custom Components
1. **HomePage.tsx** - Landing page
2. **DocumentationLayout.tsx** - Three-pane layout wrapper
3. **DocumentationContent.tsx** - Main content renderer
4. **MDXContent.tsx** - MDX file renderer
5. **TableOfContents.tsx** - Right sidebar TOC
6. **AISearchDialog.tsx** - AI search modal
7. **LoginDialog.tsx** - Authentication modal
8. **Footer.tsx** - Site footer

#### shadcn/ui Components to Use
- Dialog (for search and login)
- Button
- Input
- Breadcrumb
- Separator
- Scroll Area
- Accordion (for collapsible nav)
- Dropdown Menu (for version selector)
- Card (for landing page)

### Routing Structure
```
/                                    → Landing page
/docs                               → Documentation home
/docs/[version]                     → Version-specific docs
/docs/[version]/[module]            → Module docs
/docs/[version]/[module]/[deliverable]   → Deliverable category
/docs/[version]/[module]/[deliverable]/[page]  → Specific page
```

### State Management
- **URL State**: Version, module, deliverable, page from route
- **Local State**: 
  - Sidebar open/closed
  - Search dialog open/closed
  - Login dialog open/closed
  - Active TOC item
- **No External State Library Needed**: Use React hooks

## Content Guidelines

### Sample MDX Content
Create placeholder content for:
- At least 3-4 pages for My Dashboard module (version 6.1)
- Overview pages for each module
- Sample Getting Started guides
- Sample API documentation
- Sample Release Notes

### Content Structure
```mdx
---
title: "Page Title"
description: "Brief description"
version: "6.1"
module: "My Dashboard"
deliverable: "Getting Started"
---

# Main Heading

Introduction paragraph...

## Section 1
Content...

## Section 2
Content...

### Subsection
More details...
```

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: For interactive elements
- **Keyboard Navigation**: Full keyboard support
- **Focus States**: Visible focus indicators
- **Alt Text**: For all images
- **Color Contrast**: WCAG AA compliance

## Performance

- **Code Splitting**: Lazy load components where appropriate
- **MDX Optimization**: Pre-compile MDX files
- **Image Optimization**: Use ImageWithFallback component
- **Smooth Scrolling**: CSS scroll-behavior or smooth scroll utilities
- **Fast Initial Load**: Optimize critical rendering path

## Special Features

### Auto-Generated Table of Contents
- Parse MDX headings (H2, H3)
- Create scrollspy navigation
- Highlight active section
- Smooth scroll to sections

### Version Persistence
- Remember last selected version (localStorage)
- Maintain version context across navigation
- Show version indicator in UI

### Search Scope Filters
- Filter by version
- Filter by module
- Filter by deliverable type
- Combine multiple filters

### Content Fallback System
- Primary: Load from MDX file
- Secondary: Load hardcoded content
- Tertiary: Show "Coming soon" message
- Never show broken/error states to users

## File Organization

```
/
├── App.tsx                          # Main app component
├── components/
│   ├── HomePage.tsx                 # Landing page
│   ├── DocumentationLayout.tsx      # Three-pane layout
│   ├── DocumentationContent.tsx     # Content renderer
│   ├── MDXContent.tsx              # MDX renderer
│   ├── TableOfContents.tsx         # Right sidebar TOC
│   ├── AISearchDialog.tsx          # Search modal
│   ├── LoginDialog.tsx             # Auth modal
│   ├── Footer.tsx                  # Footer
│   └── ui/                         # shadcn components
├── content/
│   ├── [version]/[module]/         # Version-specific content
│   ├── [module]/[deliverable]/     # Module deliverables
│   ├── [deliverable]/              # General deliverables
│   └── contentLoader.ts            # Content loading logic
├── utils/
│   └── mdxPathResolver.ts          # Path resolution
└── styles/
    └── globals.css                 # Global styles + tokens
```

## Example User Flows

### Flow 1: New User Visits Site
1. Lands on beautiful homepage with gradient hero
2. Sees version options and module overview
3. Clicks "Get Started" → Goes to documentation
4. Sees three-pane layout with navigation
5. Breadcrumb shows: Home › Documentation › Getting Started

### Flow 2: User Searches for Content
1. Clicks AI search button (or presses Cmd+K)
2. Search dialog opens with focus on input
3. Types "dashboard configuration"
4. Sees filtered results from relevant modules
5. Clicks result → Navigates to that page
6. Breadcrumb updates: Home › Modules › My Dashboard › Getting Started › Configuration

### Flow 3: User Navigates Documentation
1. Selects version "6.1" from dropdown
2. Expands "Modules" parent topic in left sidebar
3. Clicks "My Dashboard" → Expands deliverables
4. Clicks "Getting Started" → Shows content in center
5. Right sidebar shows TOC with page sections
6. Clicks section in TOC → Smooth scrolls to that section
7. Breadcrumb shows: Home › Modules › My Dashboard › Getting Started

### Flow 4: User Switches Versions
1. Currently viewing My Dashboard docs for version 6.1
2. Clicks version dropdown in header
3. Selects "NextGen"
4. Page reloads with same module/deliverable but NextGen version
5. Content updates to NextGen-specific information
6. Breadcrumb updates with new version context

## Design Inspiration
Look at these documentation sites for inspiration:
- **Stripe Docs**: Clean, professional, excellent navigation
- **Tailwind CSS Docs**: Beautiful design, great search
- **Vercel Docs**: Modern, premium feel
- **Linear Docs**: Minimalist, excellent UX
- **Supabase Docs**: Great three-pane layout

## Brand Assets
- **Primary Brand Color**: Emerald/green (#059669 or similar)
- **Logo**: Text-based "Virima" logo with brand color
- **Tagline**: "Enterprise IT Management Documentation"

## Quality Checklist
- ✅ Premium, classy design throughout
- ✅ Milky white background with dark slate text
- ✅ Emerald/blue/green gradients on landing page
- ✅ No "v" prefix on version numbers
- ✅ No icons before deliverable names
- ✅ Three-pane layout (left nav, center content, right TOC)
- ✅ Fully functional hierarchical breadcrumbs
- ✅ AI-powered search dialog
- ✅ Premium login dialog
- ✅ Three parent navigation topics
- ✅ MDX file loading with fallback system
- ✅ Version selector in header
- ✅ Responsive design
- ✅ Smooth interactions and animations
- ✅ Table of contents with scrollspy
- ✅ All 10 modules supported
- ✅ All 6 deliverables supported
- ✅ All 4 versions supported

## Implementation Priority

### Phase 1: Foundation
1. Set up project structure
2. Create design system in globals.css
3. Implement routing structure
4. Build basic layout components

### Phase 2: Landing Page
1. Hero section with gradients
2. Features section
3. Module grid
4. Version cards
5. Footer

### Phase 3: Documentation Layout
1. Three-pane layout structure
2. Left sidebar navigation
3. Center content area
4. Right TOC sidebar
5. Breadcrumb navigation

### Phase 4: Features
1. MDX content loading system
2. AI search dialog
3. Login dialog
4. Version selector
5. Table of contents with scrollspy

### Phase 5: Polish
1. Responsive design
2. Animations and transitions
3. Error states and fallbacks
4. Performance optimization
5. Accessibility improvements

## Success Criteria
The documentation website should:
- Feel premium and enterprise-grade
- Have world-class design quality
- Be extremely easy to navigate
- Load and display MDX content smoothly
- Support all versions, modules, and deliverables
- Provide excellent search experience
- Work perfectly on all devices
- Be maintainable and scalable for long-term use

---

**Now build this comprehensive Virima documentation website following all specifications above.**
