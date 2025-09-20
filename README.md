# Grand Foods India

Premium food manufacturer in Bangalore offering muffins, chikki, biscuits, cookies, and snacks.

## 🚀 Deployment

This site is optimized for Vercel deployment and can be deployed with zero configuration.

### Deploy to Vercel

1. **Automatic Deployment**: Connect your GitHub repository to Vercel
2. **Manual Deployment**: Run `vercel` in the project directory

The site will be automatically deployed when you push to the main branch.

### Local Development

```bash
# Serve locally using Python
npm run dev
# or
python3 -m http.server 8000

# Visit http://localhost:8000
```

## 📁 Project Structure

```
├── index.html          # Homepage
├── products.html       # Product catalog
├── about.html          # About page  
├── contact.html        # Contact page
├── admin.html          # Admin panel
├── 404.html           # Custom 404 page
├── assets/            # Static assets
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── img/           # Images
│   └── video/         # Video files
├── package.json       # Project configuration
├── vercel.json        # Vercel deployment config
└── .gitignore         # Git ignore rules
```

## ⚡ Vercel Optimizations

- **Static asset caching**: Assets cached for 1 year
- **Custom 404 page**: Proper error handling
- **Security headers**: XSS protection, content type validation
- **Clean URLs**: `/products` instead of `/products.html`
- **Optimal builds**: Zero-config static deployment

## 🛠 Features

- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Structured data and meta tags
- **Performance**: Optimized images and lazy loading
- **Admin Panel**: Content management via localStorage
- **Contact Forms**: B2B and consumer inquiries

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)  
- Safari (latest)
- Edge (latest)

## 📧 Contact

For technical questions about this website, contact the development team.