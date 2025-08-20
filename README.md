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

# Website Performance & Security Testing Tool

A comprehensive automated testing tool for website performance, security, accessibility, and SEO analysis.

## Features

### 🚀 Performance Testing
- **Response Time Analysis**: Measures average, min, and max response times
- **Page Load Time**: Tracks total page load duration
- **Page Size Analysis**: Monitors content length and optimization opportunities

### 🛡️ Security Testing
- **Security Headers**: Checks for essential security headers (X-Frame-Options, CSP, HSTS, etc.)
- **SSL Configuration**: Validates SSL/TLS setup and certificate information
- **Vulnerability Scanning**: Tests for common vulnerabilities (SQL Injection, XSS, Directory Traversal)

### ♿ Accessibility Testing
- **Alt Tag Analysis**: Checks image accessibility with alt attributes
- **Heading Structure**: Validates proper heading hierarchy
- **Form Labels**: Ensures form inputs have proper labels
- **Meta Tags**: Verifies essential accessibility meta tags

### 🔍 SEO Testing
- **Meta Tags**: Checks for title, description, keywords
- **Open Graph**: Validates social media optimization
- **Structured Data**: Looks for JSON-LD structured data
- **Canonical URLs**: Ensures proper canonical tag implementation

## Installation

1. **Clone or create the project directory:**
```bash
mkdir website-testing-tool
cd website-testing-tool
```

2. **Install dependencies:**
```bash
npm install
```

## Usage

### Basic Usage
```bash
node website-tester.js https://example.com
```

### Examples
```bash
# Test your portfolio website
node website-tester.js https://your-portfolio.com

# Test a local development server
node website-tester.js http://localhost:3000

# Test an e-commerce site
node website-tester.js https://shop.example.com
```

## Output

The tool generates:
1. **Console Output**: Real-time colored progress and results
2. **JSON Report**: Detailed test results saved as `test-report-[timestamp].json`

### Sample Output
```
🚀 Starting comprehensive testing of https://example.com
============================================================
🔄 Testing response times...
✅ Response time test completed. Average: 245ms
🔄 Testing page load time...
✅ Load time: 1200ms
🔄 Testing security headers...
✅ Security headers test completed. Score: 83%
🔄 Testing SSL configuration...
✅ SSL test completed. Protocol: TLSv1.3
🔄 Testing common vulnerabilities...
✅ Vulnerability tests completed
🔄 Testing accessibility...
✅ Accessibility test completed. Score: 85%
🔄 Testing SEO...
✅ SEO test completed. Score: 75%

============================================================
📊 TEST RESULTS SUMMARY
============================================================
🌐 Target: https://example.com
📅 Date: 12/19/2023, 2:30:45 PM
⚡ Load Time: 1200ms
🛡️ Security Score: 83%
♿ Accessibility Score: 85%
🔍 SEO Score: 75%
📄 Report saved as: test-report-1703001045000.json

💡 RECOMMENDATIONS:
1. Add HSTS header to enforce HTTPS connections
2. Enhance SEO - add meta descriptions, Open Graph tags, and structured data
```

## Resume Skills You Can Add

After using this tool, you can add these skills to your resume:

### Technical Skills
- **Automated Testing**: Website performance and security testing automation
- **Performance Analysis**: Load time optimization and response time analysis
- **Security Assessment**: Vulnerability scanning and security header validation
- **Accessibility Testing**: WCAG compliance and accessibility audit automation
- **SEO Analysis**: Search engine optimization testing and recommendations

### Tools & Technologies
- **Node.js**: Server-side JavaScript for automation
- **Axios**: HTTP client for API testing
- **Security Testing**: OWASP guidelines implementation
- **Performance Monitoring**: Real-time performance metrics collection
- **Automated Reporting**: JSON-based test result generation

### Testing Methodologies
- **Automated Security Testing**: Vulnerability assessment automation
- **Performance Benchmarking**: Load time and response time analysis
- **Accessibility Compliance**: WCAG 2.1 guideline testing
- **SEO Audit Automation**: Search engine optimization testing
- **Comprehensive Test Reporting**: Detailed analysis and recommendations

## Customization

You can modify the testing parameters in `website-tester.js`:

- **Response Time Samples**: Change the number of samples (default: 10)
- **Timeout Values**: Adjust timeout settings for different tests
- **Vulnerability Tests**: Add or modify security test cases
- **Scoring Weights**: Customize scoring algorithms for different metrics

## Advanced Usage

### Batch Testing
```javascript
const websites = [
  'https://example1.com',
  'https://example2.com',
  'https://example3.com'
];

for (const site of websites) {
  const tester = new WebsiteTester(site);
  await tester.runAllTests();
}
```

### Custom Test Suite
```javascript
const tester = new WebsiteTester('https://example.com');

// Run specific tests only
await tester.testPerformance();
await tester.testSecurity();
```

## Contributing

Feel free to enhance this tool by:
- Adding more security test cases
- Implementing additional performance metrics
- Creating custom accessibility checks
- Adding support for different output formats

## License

MIT License - Feel free to use this tool for your projects and resume! 