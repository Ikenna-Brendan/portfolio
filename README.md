# Ikenna Iwuoha - Portfolio

A modern, responsive portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🌙 Dark/Light mode support
- 📱 Progressive Web App (PWA)
- 🎨 Content Management System (CMS)
- 🔍 Project filtering and search
- 📧 Contact form with email integration
- 📊 Analytics tracking
- ⚡ Offline support
- 🎯 SEO optimized

## 🚀 Live Demo

Visit: [https://ikenna-iwuoha.github.io/portfolio](https://ikenna-iwuoha.github.io/portfolio)

## 🛠️ Tech Stack

- **Framework**: Next.js 13
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/ikenna-iwuoha/portfolio.git

# Navigate to the project directory
cd portfolio

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 🎨 Customization

### Content Management
1. Click the "CMS" button (top-right corner)
2. Edit your information in real-time
3. Changes are automatically saved to localStorage
4. Export/Import content as JSON files

### Styling
- Edit `app/globals.css` for global styles
- Modify `tailwind.config.ts` for theme customization
- Update `data/content.json` for default content

## 📧 Contact Form Setup

1. Go to [Formspree](https://formspree.io)
2. Create a new form
3. Copy your form ID
4. Replace `YOUR_FORM_ID` in `components/ContactForm.tsx`

## 🚀 Deployment

### GitHub Pages Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial portfolio setup"
   git push origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" tab
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/docs" folder
   - Click "Save"

3. **Build for Production**:
   ```bash
   npm run build
   npm run export
   ```

4. **Deploy**:
   - Copy the `out` folder contents to a `docs` folder
   - Push the `docs` folder to GitHub
   - Your site will be available at `https://username.github.io/repository-name`

## 📁 Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI components
│   ├── Hero.tsx          # Hero section
│   ├── About.tsx         # About section
│   ├── Skills.tsx        # Skills section
│   ├── Experience.tsx    # Experience section
│   ├── Projects.tsx      # Projects section
│   ├── Contact.tsx       # Contact section
│   └── ...               # Other components
├── data/                 # Content data
│   └── content.json      # Portfolio content
├── lib/                  # Utility functions
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🎯 Features Guide

### Content Management System
- **Access**: Click "CMS" button (top-right)
- **Edit**: Modify content in real-time
- **Save**: Changes auto-save to localStorage
- **Export**: Download content as JSON
- **Import**: Upload JSON to restore content
- **Reset**: Restore default content

### Project Filtering
- **Search**: Use search bar to find projects
- **Filter**: Click technology badges to filter
- **Clear**: Reset all filters

### Dark Mode
- **Toggle**: Click sun/moon icon (top-left)
- **Auto**: Matches system preference
- **Persistent**: Remembers your choice

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Custom Domain
1. Add custom domain in GitHub Pages settings
2. Update `app/layout.tsx` metadata
3. Configure DNS records

## 📊 Analytics

The portfolio includes built-in analytics tracking:
- Page views
- Project interactions
- Contact form submissions
- CMS usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Ikenna Iwuoha**
- Email: ikenna.b.iwuoha@gmail.com
- LinkedIn: [linkedin.com/in/ikenna-iwuoha](https://linkedin.com/in/ikenna-iwuoha)
- GitHub: [github.com/ikenna-iwuoha](https://github.com/ikenna-iwuoha)

---

⭐ Star this repository if you found it helpful! 