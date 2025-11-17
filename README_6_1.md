# Virima Documentation - Version 6.1

![Build Status](https://github.com/[username]/[repository]/actions/workflows/deploy.yml/badge.svg)

This repository contains the documentation website for **Virima version 6.1**. The documentation is built using React, Vite, and MDX, providing a modern, interactive documentation experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Version 6.1 Content](#version-61-content)
- [Development](#development)
- [Building and Deployment](#building-and-deployment)
- [Documentation Modules](#documentation-modules)
- [Contributing](#contributing)

## Overview

This documentation site provides comprehensive guides, references, and tutorials for Virima version 6.1. The content is organized by modules and sections, making it easy to find information about specific features and functionalities.

**Key Features:**
- ✅ Interactive navigation with sidebar and breadcrumbs
- ✅ MDX-based content for rich formatting
- ✅ Version-specific documentation organization
- ✅ Search functionality
- ✅ Responsive design
- ✅ Automated testing and deployment

## Getting Started

### Prerequisites

- Node.js 18 or 20
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:3000`

### Building for Production

```bash
# Build the project
npm run build

# The build output will be in the 'build' directory
```

## Project Structure

```
src/
├── content/
│   └── 6_1/                    # Version 6.1 content
│       ├── index.mdx          # Main TOC for version 6.1
│       ├── application_overview_6_1/
│       │   ├── all_about_virima_v6_1_6_1.mdx
│       │   ├── icons_6_1.mdx
│       │   ├── user_specific_functions_6_1.mdx
│       │   ├── online_help_6_1.mdx
│       │   └── shared_functions_6_1/
│       ├── admin_6_1/
│       ├── cmdb_6_1/
│       ├── discovery_scan_6_1/
│       ├── itsm_6_1/
│       ├── itam_6_1/
│       ├── my-dashboard-6_1/
│       ├── program-project-management-6_1/
│       ├── reports-6_1/
│       ├── risk-register-6_1/
│       ├── self-service-6_1/
│       └── vulnerability_management-6_1/
├── components/                 # React components
├── utils/                      # Utility functions
└── ...
```

## Version 6.1 Content

Version 6.1 documentation includes comprehensive coverage of all Virima modules:

### Application Overview
- **All About Virima v6.1** - Overview of Virima modules and functions
- **System Icons** - Understanding system icons and their meanings
- **User Specific Functions** - Functions specific to individual users
- **Shared Functions** - 37+ common functions used across modules
- **Online Help** - Accessing and using online help resources

### Core Modules

1. **My Dashboard** - Personalized dashboard and system icons
2. **CMDB** - Configuration Management Database
3. **Discovery Scan** - Network and asset discovery
4. **ITSM** - IT Service Management
5. **ITAM** - IT Asset Management
6. **Vulnerability Management** - Security scanning and remediation
7. **Self Service** - Self Service Portal
8. **Program and Project Management** - Project planning and tracking
9. **Risk Register** - Risk identification and mitigation
10. **Reports** - Reports, analytics, and dashboards
11. **Admin** - Administrative functions and configuration

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev
```

### File Naming Conventions

All files for version 6.1 follow this naming convention:
- **Format**: `{topic-name}_6_1.mdx`
- **Example**: `access_cmdb_6_1.mdx`, `discovery_scan_6_1.mdx`
- **Rules**:
  - Use lowercase letters
  - Separate words with underscores (`_`)
  - Always end with `_6_1.mdx`

### Adding New Content

1. Create MDX file in the appropriate module folder under `src/content/6_1/`
2. Follow the naming convention: `{topic-name}_6_1.mdx`
3. Use proper frontmatter:
   ```mdx
   ---
   title: Page Title
   description: Page description
   ---
   ```
4. Update the TOC in `src/content/6_1/index.mdx` if needed

## Building and Deployment

### Automated Deployment

This project uses GitHub Actions for automated testing and deployment:

- **Test Workflow**: Runs on every pull request and push
- **Deploy Workflow**: Automatically deploys to GitHub Pages on push to `main`/`master`

### Manual Build

```bash
# Build for production
npm run build

# Output will be in the 'build' directory
```

### Build Verification

The build process:
1. ✅ TypeScript type checking
2. ✅ Build compilation
3. ✅ Artifact verification
4. ✅ Build size monitoring

## Documentation Modules

### Application Overview Structure

```
Application Overview
├── All About Virima v6.1
├── System Icons
├── User Specific Functions
├── Shared Functions (37+ topics)
│   ├── Advanced Search
│   ├── Attachments
│   ├── Auto Refresh
│   ├── Comments
│   ├── Export/Import
│   └── ... (and 32 more)
└── Online Help
```

### Module Documentation

Each module contains comprehensive documentation:
- Overview pages
- Feature guides
- Configuration instructions
- Best practices
- Troubleshooting guides

## Contributing

### Content Updates

1. Edit MDX files in `src/content/6_1/`
2. Follow the existing naming conventions
3. Test locally with `npm run dev`
4. Submit pull request

### Code Changes

1. Make changes to components or utilities
2. Test thoroughly
3. Ensure build passes: `npm run build`
4. Submit pull request

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Ensure tests pass (automated via GitHub Actions)
4. Submit PR with clear description
5. Wait for review and approval

## CI/CD Status

The project uses GitHub Actions for continuous integration and deployment:

- **Build Status**: Check the badge at the top of this README
- **Test Results**: Available in the "Actions" tab
- **Deployment**: Automatic on merge to main branch

**Note**: Replace `[username]` and `[repository]` in the build status badge with your actual GitHub username and repository name.

## Resources

- **Main Documentation**: See `src/content/6_1/index.mdx` for complete TOC
- **Content Guidelines**: See `src/content/README.md`
- **Architecture**: See `src/docs/architecture-diagram.md`
- **Testing**: See `src/docs/testing-checklist.md`

## Support

For issues or questions:
1. Check existing documentation
2. Review GitHub Issues
3. Contact the documentation team

---

**Version**: 6.1  
**Last Updated**: 2024  
**Build Status**: [Check badge above](#)

