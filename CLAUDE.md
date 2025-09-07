# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT: This project uses Yarn, not NPM**

```bash
# Development server with Turbopack
yarn run dev

# Build for production with Turbopack
yarn run build

# Start production server
yarn run start

# Lint code
yarn run lint

# Type check
yarn run type-check

# Install dependencies
yarn install

# Add dependencies
yarn add <package>

# Add dev dependencies
yarn add --dev <package>
```

## Architecture

This is a Next.js 15.5 blog application using the App Router architecture with MDX support for content creation.

### Core Technologies

- **Next.js 15.5** with App Router
- **React 19.1** with TypeScript
- **MDX** for markdown content with React components
- **Tailwind CSS v4** for styling
- **Turbopack** for fast development builds

### Project Structure

```
src/
  app/                    # Next.js App Router pages
    layout.tsx           # Root layout with Geist fonts
    page.tsx             # Homepage
    globals.css          # Global styles with CSS variables
```

### Key Configuration

- **MDX Integration**: Next.js configured to handle `.md` and `.mdx` files as pages via `@next/mdx`
- **Styling**: Tailwind CSS v4 with custom CSS variables for theming
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`
- **TypeScript**: Strict mode enabled with path aliases (`@/*` -> `./src/*`)

### Styling System

- Uses CSS custom properties for theming with automatic dark mode support
- Tailwind CSS configured through PostCSS with `@tailwindcss/postcss`
- Color scheme: `--background` and `--foreground` variables with media query dark mode

### Content Strategy

The application is set up to handle MDX content, suggesting this will be a content-focused blog where markdown files can contain React components.
