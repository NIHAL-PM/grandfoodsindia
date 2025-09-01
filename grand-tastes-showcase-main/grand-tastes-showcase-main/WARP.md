# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a static website for Grand Foods India, a food manufacturing company based in Bangalore. The site showcases their product catalog (125+ SKUs including muffins, biscuits, cookies, chikkis, and snacks) and serves as a business showcase for B2B partnerships and consumer engagement.

## Architecture

### Frontend Structure
- **Static HTML/CSS/JavaScript**: No build process required - pure web standards
- **Multi-page layout**: Separate HTML files for each major section
- **Component-based JavaScript**: Each page has dedicated JS modules with shared utilities
- **Theme system**: Time-of-day automatic theming with manual override capability
- **Responsive design**: Mobile-first approach with progressive enhancement

### Key Files and Directories

```
├── index.html              # Landing page with dual video hero
├── products.html           # Product catalog with filtering/search
├── about.html              # Company story and leadership
├── contact.html            # Contact forms (B2B and consumer)
├── admin.html              # Product management interface
├── assets/
│   ├── css/
│   │   ├── styles.css      # Main styles with CSS custom properties
│   │   └── loading.css     # Loading screen animations
│   ├── js/
│   │   ├── main.js         # Core interactions, video system, animations
│   │   ├── index.js        # Home page timeline animations
│   │   ├── products.js     # Product filtering, search, localStorage
│   │   ├── admin.js        # Product CRUD operations
│   │   ├── contact.js      # Form handling and validation
│   │   ├── loading.js      # Loading screen controller
│   │   └── theme.js        # Theme switching system
│   └── vendor/             # Third-party dependencies
```

### Data Architecture
- **Product catalog**: Stored in JavaScript objects within `products.js` and `admin.js`
- **localStorage persistence**: Product likes, theme preferences, and admin changes
- **No backend**: All data manipulation happens client-side
- **Image optimization**: WebP format with fallbacks, responsive srcsets

### Animation System
- **GSAP integration**: Professional animations with ScrollTrigger
- **Fallback animations**: CSS-only animations when GSAP unavailable
- **Performance optimized**: Intersection Observer for visibility-based animations
- **Dual video system**: Auto-switching hero videos with smooth transitions

## Common Development Commands

### Local Development
```bash
# Serve the site locally (using Python)
python -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```

### Testing and Validation
```bash
# Check HTML validation (requires html5validator)
html5validator --root . --also-check-css

# Test image optimization
cwebp assets/img/products/*.png -o assets/img/products/

# Validate CSS
npx stylelint "assets/css/*.css"

# Test JavaScript syntax
npx eslint "assets/js/*.js"
```

### Asset Management
```bash
# Optimize images to WebP format
cwebp -q 85 input.png -o output.webp

# Generate different sized images for responsive loading
cwebp -q 85 -resize 400 0 input.png -o input-400.webp
cwebp -q 85 -resize 800 0 input.png -o input-800.webp
```

### Content Updates
```bash
# Update product catalog via admin interface
# Visit /admin.html in browser to manage products

# Backup current product data
# Products are stored in localStorage - use browser dev tools to export
```

## Key Patterns and Conventions

### JavaScript Modules
- Each page has a dedicated JavaScript file following the pattern `[page].js`
- Shared functionality lives in `main.js`
- All modules use IIFE pattern to avoid global namespace pollution
- Event delegation and intersection observers for performance

### CSS Architecture
- CSS custom properties for theming (`:root` and `[data-theme]`)
- Mobile-first responsive design
- Component-based class naming
- Performance-focused animations with `will-change` and `transform`

### Product Data Structure
```javascript
{
  name: 'PRODUCT NAME',
  img: './assets/img/products/FILE.png',
  net: 'weight/count',
  shelf: number_of_days,
  cat: 'Category Name'
}
```

### Theme Implementation
- Automatic time-based theming (day/dusk/night)
- Manual theme toggle via `theme.js`
- CSS custom properties enable instant theme switching
- Persistent theme preference in localStorage

## Development Notes

### Video System
The dual video hero system requires careful handling:
- Videos auto-switch every 15 seconds
- User interaction resets auto-switch timer
- Fallback images for loading states
- Intersection Observer controls playback

### Performance Considerations
- Lazy loading for images with `loading="lazy"`
- WebP format with PNG fallbacks
- GSAP animations only when library is available
- Minimal DOM queries with caching

### Admin Interface
The admin panel (`admin.html`) provides a simple CMS for product management:
- Add/edit/delete products
- Data persists in localStorage
- Changes reflect immediately on products page
- Form validation included

### Accessibility Features
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Reduced motion support

## File Modification Guidelines

When editing this codebase:

1. **HTML files**: Maintain consistent navigation structure across all pages
2. **CSS**: Use existing custom properties for colors and spacing
3. **JavaScript**: Follow IIFE pattern and maintain null safety checks
4. **Images**: Always provide WebP versions with PNG fallbacks
5. **Product data**: Use admin interface or maintain consistency between `products.js` and `admin.js`

## Testing Strategy

Since this is a static site:
- Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- Validate responsive design on various screen sizes
- Check loading performance with throttled connections
- Verify accessibility with screen readers
- Test form submissions and localStorage functionality
