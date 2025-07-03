const axios = require('axios');
const fs = require('fs');
const https = require('https');
const chalk = require('chalk');

class WebsiteTester {
  constructor(targetUrl) {
    this.targetUrl = targetUrl;
    this.results = {
      performance: {},
      security: {},
      accessibility: {},
      seo: {},
      timestamp: new Date().toISOString()
    };
  }

  // Performance Testing Methods
  async testResponseTime() {
    try {
      console.log('🔄 Testing response times...');
      const times = [];
      const errors = [];
      
      for (let i = 0; i < 10; i++) {
        try {
          const start = Date.now();
          const response = await axios.get(this.targetUrl, { timeout: 10000 });
          const end = Date.now();
          times.push(end - start);
          
          if (i === 0) {
            this.results.performance.pageSize = response.data.length;
            this.results.performance.statusCode = response.status;
          }
        } catch (error) {
          errors.push(error.message);
        }
      }
      
      if (times.length > 0) {
        this.results.performance.responseTime = {
          average: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
          min: Math.min(...times),
          max: Math.max(...times),
          samples: times.length,
          errors: errors.length
        };
      }
      
      console.log(`✅ Response time test completed. Average: ${this.results.performance.responseTime?.average}ms`);
      return this.results.performance.responseTime;
    } catch (error) {
      console.error('❌ Response time test failed:', error.message);
    }
  }

  async testLoadTime() {
    try {
      console.log('🔄 Testing page load time...');
      const start = Date.now();
      const response = await axios.get(this.targetUrl);
      const end = Date.now();
      
      this.results.performance.loadTime = end - start;
      this.results.performance.contentLength = response.headers['content-length'] || 'Unknown';
      
      console.log(`✅ Load time: ${this.results.performance.loadTime}ms`);
      return this.results.performance.loadTime;
    } catch (error) {
      console.error('❌ Load time test failed:', error.message);
    }
  }

  // Security Testing Methods
  async testSecurityHeaders() {
    try {
      console.log('🔄 Testing security headers...');
      const response = await axios.get(this.targetUrl);
      const headers = response.headers;
      
      this.results.security.headers = {
        'X-Frame-Options': headers['x-frame-options'] || 'Missing',
        'X-Content-Type-Options': headers['x-content-type-options'] || 'Missing',
        'X-XSS-Protection': headers['x-xss-protection'] || 'Missing',
        'Strict-Transport-Security': headers['strict-transport-security'] || 'Missing',
        'Content-Security-Policy': headers['content-security-policy'] ? 'Present' : 'Missing',
        'Referrer-Policy': headers['referrer-policy'] || 'Missing'
      };
      
      const securityScore = Object.values(this.results.security.headers).filter(h => h !== 'Missing').length;
      this.results.security.headerScore = Math.round((securityScore / 6) * 100);
      
      console.log(`✅ Security headers test completed. Score: ${this.results.security.headerScore}%`);
      return this.results.security.headers;
    } catch (error) {
      console.error('❌ Security headers test failed:', error.message);
    }
  }

  async testSSLConfiguration() {
    try {
      console.log('🔄 Testing SSL configuration...');
      
      return new Promise((resolve, reject) => {
        const url = new URL(this.targetUrl);
        const options = {
          hostname: url.hostname,
          port: url.port || 443,
          method: 'GET',
          path: url.pathname + url.search
        };
        
        const req = https.request(options, (res) => {
          this.results.security.ssl = {
            protocol: res.socket.getProtocol(),
            cipher: res.socket.getCipher().name,
            valid: true,
            certificate: res.socket.getPeerCertificate()
          };
          console.log(`✅ SSL test completed. Protocol: ${this.results.security.ssl.protocol}`);
          resolve(this.results.security.ssl);
        });
        
        req.on('error', (error) => {
          this.results.security.ssl = {
            valid: false,
            error: error.message
          };
          console.log('❌ SSL test failed:', error.message);
          resolve(this.results.security.ssl);
        });
        
        req.setTimeout(10000, () => {
          req.destroy();
          reject(new Error('SSL test timeout'));
        });
        
        req.end();
      });
    } catch (error) {
      console.error('❌ SSL test failed:', error.message);
    }
  }

  async testCommonVulnerabilities() {
    try {
      console.log('🔄 Testing common vulnerabilities...');
      
      const tests = [
        { name: 'SQL Injection Test', url: `${this.targetUrl}?id=1' OR '1'='1` },
        { name: 'XSS Test', url: `${this.targetUrl}?search=<script>alert('XSS')</script>` },
        { name: 'Directory Traversal Test', url: `${this.targetUrl}../../../etc/passwd` },
        { name: 'Open Redirect Test', url: `${this.targetUrl}?redirect=https://malicious.com` }
      ];
      
      for (const test of tests) {
        try {
          const response = await axios.get(test.url, { 
            timeout: 5000,
            validateStatus: () => true // Accept all status codes
          });
          
          this.results.security[test.name.replace(' Test', '')] = {
            status: response.status,
            vulnerable: response.status === 200 && response.data.length > 0,
            responseSize: response.data.length
          };
        } catch (error) {
          this.results.security[test.name.replace(' Test', '')] = {
            status: 'Error',
            vulnerable: false,
            error: error.message
          };
        }
      }
      
      console.log('✅ Vulnerability tests completed');
      return this.results.security;
    } catch (error) {
      console.error('❌ Vulnerability test failed:', error.message);
    }
  }

  // Accessibility Testing
  async testAccessibility() {
    try {
      console.log('🔄 Testing accessibility...');
      
      const response = await axios.get(this.targetUrl);
      const html = response.data;
      
      this.results.accessibility = {
        hasTitle: /<title[^>]*>.*<\/title>/i.test(html),
        hasMetaDescription: /<meta[^>]*name=["']description["'][^>]*>/i.test(html),
        hasAltTags: (html.match(/<img[^>]*>/gi) || []).filter(img => /alt=["'][^"']+["']/i.test(img)).length,
        totalImages: (html.match(/<img[^>]*>/gi) || []).length,
        hasHeadingStructure: /<h[1-6][^>]*>/i.test(html),
        hasFormLabels: (html.match(/<input[^>]*>/gi) || []).filter(input => /id=["'][^"']+["']/i.test(input)).length,
        totalInputs: (html.match(/<input[^>]*>/gi) || []).length
      };
      
      const altTagPercentage = this.results.accessibility.totalImages > 0 
        ? Math.round((this.results.accessibility.hasAltTags / this.results.accessibility.totalImages) * 100)
        : 100;
      
      this.results.accessibility.score = Math.round(
        (this.results.accessibility.hasTitle ? 20 : 0) +
        (this.results.accessibility.hasMetaDescription ? 20 : 0) +
        (altTagPercentage * 0.3) +
        (this.results.accessibility.hasHeadingStructure ? 20 : 0) +
        (this.results.accessibility.totalInputs > 0 ? 20 : 0)
      );
      
      console.log(`✅ Accessibility test completed. Score: ${this.results.accessibility.score}%`);
      return this.results.accessibility;
    } catch (error) {
      console.error('❌ Accessibility test failed:', error.message);
    }
  }

  // SEO Testing
  async testSEO() {
    try {
      console.log('🔄 Testing SEO...');
      
      const response = await axios.get(this.targetUrl);
      const html = response.data;
      
      this.results.seo = {
        hasTitle: /<title[^>]*>.*<\/title>/i.test(html),
        hasMetaDescription: /<meta[^>]*name=["']description["'][^>]*>/i.test(html),
        hasMetaKeywords: /<meta[^>]*name=["']keywords["'][^>]*>/i.test(html),
        hasCanonical: /<link[^>]*rel=["']canonical["'][^>]*>/i.test(html),
        hasOpenGraph: /<meta[^>]*property=["']og:/i.test(html),
        hasTwitterCard: /<meta[^>]*name=["']twitter:/i.test(html),
        hasStructuredData: /<script[^>]*type=["']application\/ld\+json["'][^>]*>/i.test(html),
        hasRobotsMeta: /<meta[^>]*name=["']robots["'][^>]*>/i.test(html)
      };
      
      const seoScore = Object.values(this.results.seo).filter(Boolean).length;
      this.results.seo.score = Math.round((seoScore / 8) * 100);
      
      console.log(`✅ SEO test completed. Score: ${this.results.seo.score}%`);
      return this.results.seo;
    } catch (error) {
      console.error('❌ SEO test failed:', error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log(`🚀 Starting comprehensive testing of ${this.targetUrl}`);
    console.log('=' .repeat(60));
    
    await Promise.all([
      this.testResponseTime(),
      this.testLoadTime(),
      this.testSecurityHeaders(),
      this.testSSLConfiguration(),
      this.testCommonVulnerabilities(),
      this.testAccessibility(),
      this.testSEO()
    ]);
    
    this.generateReport();
  }

  generateReport() {
    const report = {
      targetUrl: this.targetUrl,
      timestamp: this.results.timestamp,
      summary: {
        performance: {
          loadTime: this.results.performance.loadTime,
          averageResponseTime: this.results.performance.responseTime?.average,
          pageSize: this.results.performance.pageSize
        },
        security: {
          headerScore: this.results.security.headerScore,
          sslValid: this.results.security.ssl?.valid,
          vulnerabilitiesFound: Object.keys(this.results.security).filter(key => 
            this.results.security[key]?.vulnerable
          ).length
        },
        accessibility: {
          score: this.results.accessibility.score,
          altTagPercentage: this.results.accessibility.totalImages > 0 
            ? Math.round((this.results.accessibility.hasAltTags / this.results.accessibility.totalImages) * 100)
            : 100
        },
        seo: {
          score: this.results.seo.score
        }
      },
      recommendations: this.generateRecommendations(),
      details: this.results
    };
    
    const filename = `test-report-${Date.now()}.json`;
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' .repeat(60));
    console.log(`🌐 Target: ${this.targetUrl}`);
    console.log(`📅 Date: ${new Date().toLocaleString()}`);
    console.log(`⚡ Load Time: ${report.summary.performance.loadTime}ms`);
    console.log(`🛡️ Security Score: ${report.summary.security.headerScore}%`);
    console.log(`♿ Accessibility Score: ${report.summary.accessibility.score}%`);
    console.log(`🔍 SEO Score: ${report.summary.seo.score}%`);
    console.log(`📄 Report saved as: ${filename}`);
    
    if (report.recommendations.length > 0) {
      console.log('\n💡 RECOMMENDATIONS:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Performance recommendations
    if (this.results.performance.loadTime > 3000) {
      recommendations.push('Optimize page load time - consider image compression, minification, and caching');
    }
    
    // Security recommendations
    const headers = this.results.security.headers || {};
    if (headers['X-Frame-Options'] === 'Missing') {
      recommendations.push('Add X-Frame-Options header to prevent clickjacking attacks');
    }
    if (headers['Content-Security-Policy'] === 'Missing') {
      recommendations.push('Implement Content Security Policy to prevent XSS attacks');
    }
    if (headers['Strict-Transport-Security'] === 'Missing') {
      recommendations.push('Add HSTS header to enforce HTTPS connections');
    }
    
    // Accessibility recommendations
    if (this.results.accessibility.score < 80) {
      recommendations.push('Improve accessibility - add alt tags to images and ensure proper heading structure');
    }
    
    // SEO recommendations
    if (this.results.seo.score < 80) {
      recommendations.push('Enhance SEO - add meta descriptions, Open Graph tags, and structured data');
    }
    
    return recommendations;
  }
}

// Usage function
async function testWebsite(url) {
  if (!url) {
    console.log('🌐 Website Performance & Security Tester');
    console.log('=' .repeat(50));
    console.log('This tool tests:');
    console.log('✅ Performance (load time, response time)');
    console.log('✅ Security (headers, SSL, vulnerabilities)');
    console.log('✅ Accessibility (alt tags, structure)');
    console.log('✅ SEO (meta tags, structured data)');
    console.log('\nUsage: node website-tester.js <website-url>');
    console.log('Example: node website-tester.js https://example.com');
    return;
  }
  
  const tester = new WebsiteTester(url);
  await tester.runAllTests();
}

// Get URL from command line arguments
const targetUrl = process.argv[2];

if (targetUrl) {
  testWebsite(targetUrl).catch(console.error);
} else {
  console.log('🌐 Website Performance & Security Tester');
  console.log('=' .repeat(50));
  console.log('This tool tests:');
  console.log('✅ Performance (load time, response time)');
  console.log('✅ Security (headers, SSL, vulnerabilities)');
  console.log('✅ Accessibility (alt tags, structure)');
  console.log('✅ SEO (meta tags, structured data)');
  console.log('\nUsage: node website-tester.js <website-url>');
  console.log('Example: node website-tester.js https://example.com');
} 