# Polina Nail Salon

A luxury nail salon landing page built with React + Vite.

## Features
- 🌸 Pink/rose luxury aesthetic
- 🌍 Trilingual: English, Russian, Hebrew (with full RTL support for Hebrew)
- 📸 Real gallery photos embedded
- 📅 Appointment booking form
- ✨ Scroll-triggered reveal animations
- 📱 Responsive layout

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
polina-nail-salon/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx          # Entry point
    ├── App.jsx           # Root component + language state
    ├── index.css         # Global CSS variables
    ├── i18n.js           # All translations (EN / RU / HE)
    ├── hooks/
    │   └── useReveal.js  # Scroll animation hook
    ├── assets/
    │   └── gallery/      # Gallery photos (gallery1–7.jpeg)
    └── components/
        ├── Navbar.jsx / .module.css
        ├── Hero.jsx / .module.css
        ├── Services.jsx / .module.css
        ├── About.jsx / .module.css
        ├── Gallery.jsx / .module.css
        ├── Testimonials.jsx / .module.css
        ├── Booking.jsx / .module.css
        └── Footer.jsx / .module.css
```

## Customization

- **Business info** (address, phone, hours): edit `src/i18n.js`
- **Pricing**: edit `svc*Price` keys in `src/i18n.js`
- **Gallery photos**: replace files in `src/assets/gallery/`
- **Hero background**: update the URL in `src/components/Hero.module.css`
- **Colors**: all CSS variables are in `src/index.css`
