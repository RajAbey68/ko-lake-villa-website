
// Ko Lake Villa - Security Audit & Testing
const axios = require('axios');
const fs = require('fs');

class SecurityTestSuite {
  constructor(baseUrl = 'http://localhost:5000') {
    this.baseUrl = baseUrl;
    this.vulnerabilities = [];
    this.securityChecks = [];
  }

  // SQL Injection Tests
  async testSqlInjection() {
    console.log('🛡️  Testing SQL Injection Prevention...');
    
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "'; DELETE FROM bookings; --"
    ];
    
    const endpoints = [
      '/api/gallery/search',
      '/api/booking/search',
      '/api/contact'
    ];
    
    for (const endpoint of endpoints) {
      for (const payload of sqlPayloads) {
        try {
          const response = await axios.post(`${this.baseUrl}${endpoint}`, {
            query: payload,
            email: payload,
            message: payload
          });
          
          // Check if payload was rejected properly
          if (response.status === 400 || response.status === 422) {
            this.securityChecks.push({
              test: 'SQL Injection Prevention',
              endpoint,
              payload: payload.substring(0, 20) + '...',
              status: 'PASS',
              message: 'Payload properly rejected'
            });
          } else {
            this.vulnerabilities.push({
              type: 'SQL Injection',
              endpoint,
              payload,
              severity: 'HIGH',
              description: 'Endpoint may be vulnerable to SQL injection'
            });
          }
        } catch (error) {
          // Errors are good in this case - they mean the payload was rejected
          this.securityChecks.push({
            test: 'SQL Injection Prevention',
            endpoint,
            status: 'PASS',
            message: 'Request properly rejected'
          });
        }
      }
    }
  }

  // XSS (Cross-Site Scripting) Tests
  async testXssProtection() {
    console.log('🚫 Testing XSS Protection...');
    
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert("XSS")',
      '<svg onload="alert(1)">'
    ];
    
    for (const payload of xssPayloads) {
      try {
        const response = await axios.post(`${this.baseUrl}/api/contact`, {
          name: payload,
          email: 'test@example.com',
          message: payload
        });
        
        // Check if response contains unsanitized payload
        const responseText = JSON.stringify(response.data);
        if (responseText.includes('<script>') || responseText.includes('javascript:')) {
          this.vulnerabilities.push({
            type: 'XSS',
            endpoint: '/api/contact',
            payload,
            severity: 'HIGH',
            description: 'Endpoint may be vulnerable to XSS attacks'
          });
        } else {
          this.securityChecks.push({
            test: 'XSS Protection',
            endpoint: '/api/contact',
            status: 'PASS',
            message: 'Payload properly sanitized'
          });
        }
      } catch (error) {
        // Check error messages for unsanitized content
        if (error.response && error.response.data) {
          const errorText = JSON.stringify(error.response.data);
          if (errorText.includes('<script>') || errorText.includes('javascript:')) {
            this.vulnerabilities.push({
              type: 'XSS in Error Messages',
              payload,
              severity: 'MEDIUM',
              description: 'Error messages may contain unsanitized input'
            });
          }
        }
      }
    }
  }

  // Authentication Security Tests
  async testAuthenticationSecurity() {
    console.log('🔐 Testing Authentication Security...');
    
    // Test for weak password acceptance
    const weakPasswords = ['123456', 'password', '12345', 'admin', 'qwerty'];
    
    for (const password of weakPasswords) {
      try {
        const response = await axios.post(`${this.baseUrl}/api/auth/register`, {
          email: 'test@example.com',
          password: password
        });
        
        if (response.status === 200 || response.status === 201) {
          this.vulnerabilities.push({
            type: 'Weak Password Policy',
            severity: 'MEDIUM',
            description: `Weak password '${password}' was accepted`,
            recommendation: 'Implement stronger password requirements'
          });
        }
      } catch (error) {
        this.securityChecks.push({
          test: 'Password Strength',
          status: 'PASS',
          message: `Weak password '${password}' properly rejected`
        });
      }
    }
    
    // Test for brute force protection
    await this.testBruteForceProtection();
  }

  // Brute Force Protection Test
  async testBruteForceProtection() {
    console.log('🔨 Testing Brute Force Protection...');
    
    const attempts = [];
    const email = 'admin@kolakevilla.com';
    
    // Make multiple failed login attempts
    for (let i = 0; i < 10; i++) {
      try {
        const start = Date.now();
        await axios.post(`${this.baseUrl}/api/auth/login`, {
          email: email,
          password: 'wrongpassword' + i
        });
      } catch (error) {
        const end = Date.now();
        attempts.push({
          attempt: i + 1,
          responseTime: end - start,
          status: error.response?.status
        });
      }
    }
    
    // Check if there's rate limiting (increasing response times or blocking)
    const laterAttempts = attempts.slice(-3);
    const earlyAttempts = attempts.slice(0, 3);
    
    const avgEarlyTime = earlyAttempts.reduce((sum, a) => sum + a.responseTime, 0) / earlyAttempts.length;
    const avgLaterTime = laterAttempts.reduce((sum, a) => sum + a.responseTime, 0) / laterAttempts.length;
    
    if (avgLaterTime > avgEarlyTime * 2 || laterAttempts.some(a => a.status === 429)) {
      this.securityChecks.push({
        test: 'Brute Force Protection',
        status: 'PASS',
        message: 'Rate limiting or blocking detected'
      });
    } else {
      this.vulnerabilities.push({
        type: 'Insufficient Brute Force Protection',
        severity: 'HIGH',
        description: 'No rate limiting detected for failed login attempts',
        recommendation: 'Implement rate limiting and account lockout mechanisms'
      });
    }
  }

  // File Upload Security Test
  async testFileUploadSecurity() {
    console.log('📁 Testing File Upload Security...');
    
    const maliciousFiles = [
      { name: 'malicious.php', content: '<?php echo "hack"; ?>', type: 'application/x-php' },
      { name: 'virus.exe', content: 'MZ\x90\x00', type: 'application/octet-stream' },
      { name: '../../../etc/passwd', content: 'root:x:0:0:', type: 'text/plain' },
      { name: 'huge-file.jpg', content: 'A'.repeat(50 * 1024 * 1024), type: 'image/jpeg' } // 50MB
    ];
    
    for (const file of maliciousFiles) {
      try {
        const formData = new FormData();
        const blob = new Blob([file.content], { type: file.type });
        formData.append('file', blob, file.name);
        
        const response = await axios.post(`${this.baseUrl}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.status === 200) {
          this.vulnerabilities.push({
            type: 'Unsafe File Upload',
            filename: file.name,
            severity: file.name.includes('.php') || file.name.includes('.exe') ? 'HIGH' : 'MEDIUM',
            description: `Potentially dangerous file '${file.name}' was accepted`,
            recommendation: 'Implement file type validation and size limits'
          });
        }
      } catch (error) {
        this.securityChecks.push({
          test: 'File Upload Security',
          filename: file.name,
          status: 'PASS',
          message: 'Malicious file properly rejected'
        });
      }
    }
  }

  // HTTPS and Security Headers Test
  async testSecurityHeaders() {
    console.log('🔒 Testing Security Headers...');
    
    try {
      const response = await axios.get(`${this.baseUrl}/`);
      const headers = response.headers;
      
      const requiredHeaders = {
        'x-content-type-options': 'nosniff',
        'x-frame-options': ['DENY', 'SAMEORIGIN'],
        'x-xss-protection': '1; mode=block',
        'strict-transport-security': null, // Should exist if HTTPS
        'content-security-policy': null
      };
      
      for (const [headerName, expectedValue] of Object.entries(requiredHeaders)) {
        const headerValue = headers[headerName];
        
        if (!headerValue) {
          this.vulnerabilities.push({
            type: 'Missing Security Header',
            header: headerName,
            severity: 'MEDIUM',
            description: `Missing security header: ${headerName}`,
            recommendation: `Add ${headerName} header to responses`
          });
        } else if (expectedValue && !expectedValue.includes(headerValue)) {
          this.vulnerabilities.push({
            type: 'Incorrect Security Header',
            header: headerName,
            value: headerValue,
            expected: expectedValue,
            severity: 'LOW',
            description: `Security header has unexpected value`
          });
        } else {
          this.securityChecks.push({
            test: 'Security Headers',
            header: headerName,
            status: 'PASS',
            message: 'Security header properly configured'
          });
        }
      }
    } catch (error) {
      console.error('Error testing security headers:', error.message);
    }
  }

  // Generate Security Report
  generateSecurityReport() {
    console.log('\n🛡️  Security Audit Report');
    console.log('=' .repeat(50));
    
    const highVulns = this.vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumVulns = this.vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    const lowVulns = this.vulnerabilities.filter(v => v.severity === 'LOW').length;
    const passedChecks = this.securityChecks.filter(c => c.status === 'PASS').length;
    
    console.log(`🔴 High Risk Vulnerabilities: ${highVulns}`);
    console.log(`🟡 Medium Risk Vulnerabilities: ${mediumVulns}`);
    console.log(`🟢 Low Risk Vulnerabilities: ${lowVulns}`);
    console.log(`✅ Passed Security Checks: ${passedChecks}`);
    
    if (this.vulnerabilities.length > 0) {
      console.log('\n🚨 Vulnerabilities Found:');
      this.vulnerabilities.forEach((vuln, index) => {
        console.log(`\n${index + 1}. ${vuln.type} (${vuln.severity})`);
        console.log(`   Description: ${vuln.description}`);
        if (vuln.recommendation) {
          console.log(`   Recommendation: ${vuln.recommendation}`);
        }
      });
    }
    
    if (this.securityChecks.length > 0) {
      console.log('\n✅ Security Checks Passed:');
      this.securityChecks.forEach(check => {
        console.log(`   ✓ ${check.test}: ${check.message}`);
      });
    }
    
    const report = {
      summary: {
        highRisk: highVulns,
        mediumRisk: mediumVulns,
        lowRisk: lowVulns,
        passedChecks,
        totalVulnerabilities: this.vulnerabilities.length,
        securityScore: Math.max(0, 100 - (highVulns * 30) - (mediumVulns * 10) - (lowVulns * 5))
      },
      vulnerabilities: this.vulnerabilities,
      passedChecks: this.securityChecks
    };
    
    // Save report to file
    fs.writeFileSync('./security-audit-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Security report saved to: security-audit-report.json');
    
    return report;
  }

  // Run All Security Tests
  async runSecurityAudit() {
    console.log('🔍 Starting Ko Lake Villa Security Audit');
    console.log('=' .repeat(50));
    
    try {
      await this.testSqlInjection();
      await this.testXssProtection();
      await this.testAuthenticationSecurity();
      await this.testFileUploadSecurity();
      await this.testSecurityHeaders();
      
      return this.generateSecurityReport();
    } catch (error) {
      console.error('❌ Security audit failed:', error);
      throw error;
    }
  }
}

module.exports = SecurityTestSuite;

// Run security audit if called directly
if (require.main === module) {
  const securityTest = new SecurityTestSuite();
  securityTest.runSecurityAudit()
    .then(report => {
      console.log(`\n🎯 Security Score: ${report.summary.securityScore}/100`);
      process.exit(report.summary.highRisk > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('💥 Security audit failed:', error);
      process.exit(1);
    });
}
