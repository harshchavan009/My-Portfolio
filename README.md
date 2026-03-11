# Harsh Chavan's Portfolio Website

A modern, professional personal portfolio website for Harsh Chavan, a B.Tech Computer Science Engineering student specializing in Artificial Intelligence and Machine Learning at Parul University.

## Features

✨ **Modern Design**
- Clean, minimal, and professional layout
- Gradient accents with smooth animations
- Responsive design for mobile and desktop
- Dark/Light mode toggle

🎯 **Sections Included**
1. **Hero Section** - Eye-catching introduction with CTA buttons
2. **About Me** - Professional background and personal interests
3. **Skills** - Categorized skills with progress bars
4. **Projects** - Showcase your work with descriptions and links
5. **GitHub** - Display GitHub profile information
6. **LinkedIn** - Professional networking section
7. **Contact** - Multiple ways to get in touch

🔧 **Interactive Features**
- Smooth scroll navigation
- Mobile-friendly hamburger menu
- Dark/Light mode with localStorage persistence
- Contact form with validation
- Scroll-to-top button
- Smooth animations and transitions
- Intersection Observer for scroll animations

## Project Structure

```
Portfolio/
├── index.html          # Main HTML file
├── styles.css          # All CSS styling with variables
├── script.js           # JavaScript for interactivity
└── README.md           # This file
```

## How to Use

### 1. **Basic Setup**
- No build process or dependencies required
- Simply open `index.html` in your web browser
- Or serve using a simple HTTP server:
  ```bash
  python3 -m http.server 8000
  # or
  npx http-server
  ```

### 2. **Customize with Your Information**

#### Update Basic Information
- Open `index.html`
- Replace "Harsh Chavan" with your name throughout the file
- Update the title and meta tags
- Modify the hero section subtitle and description

#### Update Contact Information
Replace these placeholders with your actual links:
- **Email**: `harshchavan1030@gmail.com`
- **GitHub**: `harshchavan009` → `https://github.com/harshchavan009`
- **LinkedIn**: `https://www.linkedin.com/in/harsh-chavan-5804a5344/`

#### Customize Skills Section
Modify the skills in `index.html`:
```html
<div class="skill-item">
    <span class="skill-name">Your Skill</span>
    <div class="skill-bar">
        <div class="skill-progress" style="width: XX%;"></div>
    </div>
</div>
```
- Change the percentage in `style="width: XX%;"` to match your proficiency

#### Add Your Projects
Replace the placeholder project cards with your actual projects:
```html
<div class="project-card">
    <div class="project-image">
        <div class="project-placeholder">
            <i class="fas fa-project-diagram"></i>
        </div>
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Title</h3>
        <p class="project-description">Your project description</p>
        <div class="project-tech">
            <span class="tech-tag">Technology1</span>
            <span class="tech-tag">Technology2</span>
        </div>
        <div class="project-links">
            <a href="your-github-link" class="project-link">
                <i class="fab fa-github"></i> GitHub
            </a>
            <a href="your-demo-link" class="project-link">
                <i class="fas fa-external-link-alt"></i> Demo
            </a>
        </div>
    </div>
</div>
```

#### Update About Section
Edit the About section in `index.html` with your own bio and interests.

### 3. **Customizing the Design**

#### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --accent-primary: #0066ff;      /* Main accent color */
    --accent-secondary: #00d9ff;    /* Secondary accent color */
    --text-primary: #212529;
    --bg-primary: #ffffff;
    /* ... other variables */
}

body.dark-mode {
    --accent-primary: #00d9ff;
    --accent-secondary: #0066ff;
    /* ... dark mode colors */
}
```

#### Modify Spacing and Sizing
Update these CSS variables in `styles.css`:
```css
--spacing-sm: 1rem;
--spacing-md: 1.5rem;
--spacing-lg: 2rem;
--spacing-xl: 3rem;
```

#### Add Your Profile Image
1. Add an `<img>` tag in the hero section to replace the avatar placeholder
2. Update the `.avatar-placeholder` styles or replace it entirely
3. Example:
   ```html
   <div class="hero-image">
       <img src="your-photo.jpg" alt="Harsh Chavan" class="avatar">
   </div>
   ```

### 4. **Add Additional Sections**

To add new sections, follow this structure:
```html
<section id="section-name" class="section-name">
    <div class="container">
        <h2 class="section-title">Section Title</h2>
        <!-- Your content -->
    </div>
</section>
```

Then add the corresponding CSS:
```css
.section-name {
    padding: var(--spacing-2xl) var(--spacing-lg);
    background-color: var(--bg-secondary);
}
```

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Features Explained

### Dark Mode
- Automatically saved to browser localStorage
- Toggle with the moon/sun icon in the navigation bar
- All colors adapt smoothly

### Mobile Responsive
- Hamburger menu appears on screens < 768px
- All sections adapt to mobile layout
- Touch-friendly buttons and links

### Contact Form
- Client-side validation
- Opens default email client with pre-filled information
- No backend required

### Smooth Animations
- Scroll animations for elements
- Hover effects on buttons and cards
- Page load animations
- Skill progress bars animated on scroll

## Deployment Options

### 1. **GitHub Pages** (Free)
```bash
# Create a repository named: yourusername.github.io
# Push your portfolio files
# Visit: https://yourusername.github.io
```

### 2. **Netlify** (Free)
- Connect your GitHub repository
- Auto-deploys on push
- Visit: `yourname.netlify.app`

### 3. **Vercel** (Free)
- Import your repository
- Automatic deployments
- Custom domain support

### 4. **Traditional Hosting**
- Upload files via FTP
- Use any web hosting provider

## Performance Tips

1. Optimize images if you add custom images
2. Use lazy loading for images
3. Minify CSS and JS for production
4. Enable gzip compression on your server

## Customization Checklist

- [ ] Replace name with yours
- [ ] Update email address
- [ ] Update GitHub username
- [ ] Update LinkedIn profile link
- [ ] Customize About section
- [ ] Add your projects
- [ ] Adjust skill progress bars
- [ ] Choose your color scheme
- [ ] Add profile photo (optional)
- [ ] Test on mobile devices
- [ ] Deploy to hosting

## JavaScript Interactivity

The portfolio includes:
- **Dark Mode Toggle**: Theme preference saved to localStorage
- **Mobile Menu**: Hamburger menu for mobile navigation
- **Smooth Scrolling**: Smooth navigation to sections
- **Contact Form**: Validation and email integration
- **Scroll Animations**: Elements fade in on scroll
- **Scroll to Top**: Button appears when scrolled down
- **Keyboard Navigation**: Escape key closes mobile menu

## File Sizes

- `index.html`: ~15 KB
- `styles.css`: ~20 KB
- `script.js`: ~8 KB
- **Total**: ~43 KB (very lightweight!)

## License

This portfolio template is free to use and modify for personal use.

## Tips for Success

1. **Keep it Updated**: Regularly update projects and skills
2. **Add Real Projects**: Replace template projects with your actual work
3. **Use High-Quality Content**: Write clear project descriptions
4. **Keep Resume Updated**: The "Download Resume" button should link to your actual resume
5. **Test Everything**: Check all links and contact form
6. **Mobile Testing**: Test on real mobile devices, not just browser dev tools

## Troubleshooting

**Dark mode not persisting?**
- Check browser's localStorage is enabled
- Clear browser cache and reload

**Images not showing?**
- Ensure image path is correct
- Check file exists in the right directory

**Contact form not working?**
- Make sure you're using a valid email address
- Try a different email client
- Alternative: Use a form service like Formspree

## Need Help?

- Check browser console for errors (F12)
- Ensure Font Awesome CDN is loading (check internet connection)
- Validate HTML: https://validator.w3.org/
- Validate CSS: https://jigsaw.w3.org/css-validator/

## Future Enhancements

- Add blog section
- Add testimonials section
- Add certificate section
- Integrate with form backend service
- Add animation library (AOS)
- Add newsletter subscription
- Add code snippets showcase

---

Made with ❤️ by Harsh Chavan
Portfolio Built: 2024
