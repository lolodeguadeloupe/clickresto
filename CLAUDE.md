# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Clickresto is a French-language marketing landing page for a click-and-collect mobile application solution targeting restaurants. It's a single-file static website with no backend.

## Tech Stack

- **HTML5/CSS3/Vanilla JavaScript** - No frameworks
- **Single file architecture** - Everything in `index.html` (1,500+ lines)
- **Google Fonts** - DM Sans, DM Serif Display (CDN)
- **No build system** - Pure static HTML, no transpilation needed

## Running the Project

Open `index.html` directly in a browser, or serve via any static HTTP server:
```bash
python -m http.server 8000
# or
npx http-server
```

## Architecture

### Page Structure (index.html)
The page is organized into semantic sections:
- `<nav>` - Fixed navigation bar with mobile hamburger menu
- `<section class="hero">` - Landing section with phone mockup
- `<section class="features">` - Three feature cards
- `<section class="pricing">` - Pricing information
- `<section class="affiliation">` - Partner program details
- `<section class="contact">` - Contact form
- `<footer>` - Footer with links

### CSS Design System
CSS custom properties defined at `:root`:
- `--primary: #E63946` (red)
- `--secondary: #1D3557` (dark blue)
- `--accent: #F4A261` (orange)
- `--background: #F1FAEE` (light)

Responsive breakpoints at 968px and 768px.

### JavaScript Functionality
- Form submission with success message display (5s timeout)
- Smooth scrolling for anchor links
- Mobile menu toggle

## Testing

Manual browser testing only:
- Verify responsive design at breakpoints (968px, 768px)
- Test smooth scrolling navigation
- Test contact form submission (shows success message)
- Test mobile menu toggle
