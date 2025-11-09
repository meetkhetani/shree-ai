# Shree AI - Frontend Website

🚀 **A futuristic, multi-page, fully responsive frontend website for Shree AI**

Built by young developers from Kutch, showcasing AI innovation with modern web technologies.

---

## 🌟 Features

- ✅ **8 Complete Pages**: Home, About, Products, Developers, Demo, Pricing, Blog, Contact
- ✅ **Fully Responsive**: Mobile-first design that works on all devices
- ✅ **Dark Mode**: Smooth theme toggle with localStorage persistence
- ✅ **Interactive Demos**: Live AI simulations (frontend-only)
- ✅ **Smooth Animations**: AOS (Animate On Scroll) integration
- ✅ **Modern Design**: Clean UI with gradient accents and hover effects
- ✅ **SEO Ready**: Meta tags and semantic HTML
- ✅ **No Backend Required**: Pure HTML, CSS, JavaScript

---

## 🛠 Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling with custom design system
- **Vanilla JavaScript (ES6+)** - Interactivity
- **Font Awesome 6.5** - Icons
- **AOS Library** - Scroll animations
- **Google Fonts** - Inter & Space Grotesk

---

## 📂 Project Structure

```
services/
├── index.html              # Home page
├── about.html              # About page
├── products.html           # Products page
├── developers.html         # Developers/API docs page
├── demo.html               # Interactive demos
├── pricing.html            # Pricing plans
├── blog.html               # Blog posts
├── contact.html            # Contact form
│
├── css/
│   └── style.css          # Main stylesheet (1900+ lines)
│
├── js/
│   ├── main.js            # Core functionality
│   ├── demo.js            # Demo simulations
│   ├── pricing.js         # Pricing interactions
│   ├── blog.js            # Blog filtering & modal
│   └── contact.js         # Form validation
│
└── assets/
    └── favicon.svg        # Site favicon
```

---

## 🚀 Quick Start

### Local Development

1. **Clone or download** this project
2. **Open** `index.html` in your browser
3. **That's it!** No build process required

### Using Live Server (Recommended)

```bash
# If you have VS Code with Live Server extension
Right-click on index.html → Open with Live Server

# Or use Python
python -m http.server 8000

# Or use Node.js http-server
npx http-server
```

---

## 🌐 Deployment

### Deploy to Netlify

1. Drag and drop the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site is live! 🎉

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and root folder
4. Your site will be live at `https://username.github.io/repo-name`

---

## 🎨 Design System

### Colors
- **Primary Blue**: `#0048FF`
- **Gold**: `#FFD700`
- **White**: `#FFFFFF`

### Fonts
- **Headings**: Space Grotesk
- **Body**: Inter

### Components
- Responsive navbar with mobile menu
- Hero section with floating animations
- Product cards with hover effects
- Pricing tables with toggle
- Blog cards with filtering
- Contact form with validation
- Interactive demo simulations

---

## ⚡ Key Features Breakdown

### 🏠 Home Page
- Animated hero section
- Stats counter
- Featured products
- Testimonials
- CTA sections

### 📄 About Page
- Company story
- Mission & vision
- Animated timeline
- Team members
- Statistics

### 🛍 Products Page
- Detailed product showcases
- Feature comparison table
- Hover animations

### 👨‍💻 Developers Page
- API documentation with syntax highlighting
- SDK listings
- Code examples (Python, JavaScript, cURL)
- Community links

### 🎮 Demo Page
- **Sentiment Analyzer** - Analyzes text emotions
- **Image Classifier** - Simulated image recognition
- **AI Chatbot** - Interactive chat interface
- **Stock Predictor** - Market trend simulation
- **Text-to-Speech** - TTS demo

### 💰 Pricing Page
- Three-tier pricing (Free, Pro, Enterprise)
- Monthly/Yearly toggle
- Feature comparison
- FAQ accordion

### 📝 Blog Page
- Grid layout
- Category filtering
- Modal for full posts
- Newsletter signup

### 📧 Contact Page
- Form validation
- Success modal
- Social links
- Map placeholder

---

## 🎯 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

---

## 📱 Responsive Breakpoints

- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

---

## 🔧 Customization

### Change Colors

Edit CSS variables in `css/style.css`:

```css
:root {
    --color-primary: #0048FF;  /* Change primary color */
    --color-gold: #FFD700;     /* Change accent color */
}
```

### Add New Pages

1. Copy any existing HTML page
2. Update navigation links
3. Customize content
4. Add to `main.js` for nav highlighting

---

## 📊 Performance

- ⚡ Fast load times (no heavy frameworks)
- 🎨 Optimized CSS
- 📦 Minimal JavaScript
- 🖼 SVG icons (scalable & lightweight)

---

## 🤝 Credits

**Built by Shree AI Team**
- Young developers from Kutch, Gujarat
- Making AI accessible for everyone

**Libraries Used:**
- AOS - [michalsnik.github.io/aos](https://michalsnik.github.io/aos/)
- Font Awesome - [fontawesome.com](https://fontawesome.com/)
- Google Fonts - [fonts.google.com](https://fonts.google.com/)

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🎉 Next Steps

- [ ] Add actual backend integration
- [ ] Implement real AI APIs
- [ ] Add user authentication
- [ ] Create admin dashboard
- [ ] Add blog CMS
- [ ] Implement analytics

---

**Made with ❤️ in Kutch, Gujarat**

For questions or suggestions, visit the contact page!
