/**
 * Ko Lake Villa - Development Workflow Optimizer
 * Streamlined development process with hot-reload validation and instant feedback
 */

class DevelopmentWorkflowOptimizer {
  constructor() {
    this.watchInterval = null;
    this.lastKnownState = null;
    this.changeCallbacks = [];
    this.validationQueue = [];
    this.isValidating = false;
  }

  startDevelopmentMode() {
    console.log('🚀 Starting Optimized Development Mode...');
    
    // Initialize state tracking
    this.captureInitialState();
    
    // Start change detection
    this.startChangeDetection();
    
    // Setup automatic validation
    this.setupAutoValidation();
    
    // Display developer commands
    this.showDeveloperCommands();
    
    console.log('✅ Development mode active - changes will be automatically validated');
  }

  async captureInitialState() {
    try {
      const state = {
        content: await this.fetchAPI('/api/content'),
        gallery: await this.fetchAPI('/api/gallery'),
        rooms: await this.fetchAPI('/api/rooms'),
        timestamp: Date.now()
      };
      
      this.lastKnownState = state;
      console.log('📸 Initial state captured');
    } catch (error) {
      console.warn('⚠️ Could not capture initial state:', error.message);
    }
  }

  async fetchAPI(endpoint) {
    try {
      const response = await fetch(endpoint);
      return response.ok ? await response.json() : null;
    } catch (error) {
      return null;
    }
  }

  startChangeDetection() {
    this.watchInterval = setInterval(async () => {
      await this.detectChanges();
    }, 2000); // Check every 2 seconds
    
    console.log('👀 Change detection started');
  }

  async detectChanges() {
    if (this.isValidating) return;
    
    try {
      const currentState = {
        content: await this.fetchAPI('/api/content'),
        gallery: await this.fetchAPI('/api/gallery'),
        rooms: await this.fetchAPI('/api/rooms'),
        timestamp: Date.now()
      };

      const changes = this.compareStates(this.lastKnownState, currentState);
      
      if (changes.length > 0) {
        console.log(`🔄 Detected ${changes.length} change(s):`);
        changes.forEach(change => console.log(`   • ${change}`));
        
        // Queue validation
        this.queueValidation(changes);
        
        // Update last known state
        this.lastKnownState = currentState;
        
        // Notify callbacks
        this.notifyChangeCallbacks(changes);
      }
    } catch (error) {
      console.warn('⚠️ Change detection error:', error.message);
    }
  }

  compareStates(oldState, newState) {
    const changes = [];
    
    if (!oldState || !newState) return changes;
    
    // Compare content
    if (JSON.stringify(oldState.content) !== JSON.stringify(newState.content)) {
      changes.push('Content data modified');
    }
    
    // Compare gallery
    if (JSON.stringify(oldState.gallery) !== JSON.stringify(newState.gallery)) {
      changes.push('Gallery data modified');
    }
    
    // Compare rooms
    if (JSON.stringify(oldState.rooms) !== JSON.stringify(newState.rooms)) {
      changes.push('Rooms data modified');
    }
    
    return changes;
  }

  queueValidation(changes) {
    this.validationQueue.push({
      changes,
      timestamp: Date.now()
    });
    
    // Process queue if not already processing
    if (!this.isValidating) {
      this.processValidationQueue();
    }
  }

  async processValidationQueue() {
    if (this.validationQueue.length === 0) return;
    
    this.isValidating = true;
    
    try {
      const validationItem = this.validationQueue.shift();
      await this.runQuickValidation(validationItem.changes);
    } catch (error) {
      console.error('❌ Validation failed:', error.message);
    } finally {
      this.isValidating = false;
      
      // Process next item if queue not empty
      if (this.validationQueue.length > 0) {
        setTimeout(() => this.processValidationQueue(), 100);
      }
    }
  }

  async runQuickValidation(changes) {
    console.log('⚡ Running quick validation...');
    
    const results = {
      api: { passed: 0, failed: 0 },
      data: { passed: 0, failed: 0 },
      functionality: { passed: 0, failed: 0 }
    };

    // API health checks
    const apis = ['/api/content', '/api/gallery', '/api/rooms'];
    for (const api of apis) {
      try {
        const response = await fetch(api);
        if (response.ok) {
          results.api.passed++;
        } else {
          results.api.failed++;
          console.log(`❌ API ${api} returned ${response.status}`);
        }
      } catch (error) {
        results.api.failed++;
        console.log(`❌ API ${api} error: ${error.message}`);
      }
    }

    // Data integrity checks
    if (changes.includes('Content data modified')) {
      const contentValid = await this.validateContentIntegrity();
      if (contentValid) {
        results.data.passed++;
      } else {
        results.data.failed++;
      }
    }

    // Quick functionality tests
    const functionalityTests = [
      () => this.testRichTextFormatting(),
      () => this.testContentValidation(),
      () => this.testUrlSecurity()
    ];

    for (const test of functionalityTests) {
      try {
        const passed = test();
        if (passed) {
          results.functionality.passed++;
        } else {
          results.functionality.failed++;
        }
      } catch (error) {
        results.functionality.failed++;
      }
    }

    // Display results
    const totalPassed = results.api.passed + results.data.passed + results.functionality.passed;
    const totalFailed = results.api.failed + results.data.failed + results.functionality.failed;
    
    if (totalFailed === 0) {
      console.log(`✅ Quick validation passed (${totalPassed}/${totalPassed + totalFailed})`);
    } else {
      console.log(`⚠️ Quick validation issues (${totalPassed}/${totalPassed + totalFailed})`);
    }
  }

  async validateContentIntegrity() {
    try {
      const content = await this.fetchAPI('/api/content');
      if (!Array.isArray(content)) return false;
      
      // Check each content item has required fields
      return content.every(item => 
        item.id && 
        item.content !== undefined && 
        item.title &&
        item.lastUpdated
      );
    } catch (error) {
      return false;
    }
  }

  testRichTextFormatting() {
    const testCases = [
      { input: '**bold**', expected: '<strong>bold</strong>' },
      { input: '*italic*', expected: '<em>italic</em>' },
      { input: '[link](url)', expected: 'href="url"' }
    ];

    return testCases.every(test => {
      const result = this.formatPreview(test.input);
      return result.includes(test.expected);
    });
  }

  testContentValidation() {
    const testCases = [
      { content: '', shouldBeValid: false },
      { content: 'valid content', shouldBeValid: true },
      { content: null, shouldBeValid: false }
    ];

    return testCases.every(test => {
      const isValid = this.validateContent(test.content);
      return isValid === test.shouldBeValid;
    });
  }

  testUrlSecurity() {
    const testCases = [
      { url: 'https://example.com', shouldBeSafe: true },
      { url: 'javascript:alert(1)', shouldBeSafe: false },
      { url: 'data:text/html,script', shouldBeSafe: false }
    ];

    return testCases.every(test => {
      const isSafe = this.validateUrl(test.url);
      return isSafe === test.shouldBeSafe;
    });
  }

  formatPreview(text) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/\*\*([^*]+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*\n]+?)\*/g, '<em>$1</em>');
  }

  validateContent(content) {
    if (!content || typeof content !== 'string') return false;
    return content.trim().length > 0;
  }

  validateUrl(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:', 'mailto:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  onStateChange(callback) {
    this.changeCallbacks.push(callback);
  }

  notifyChangeCallbacks(changes) {
    this.changeCallbacks.forEach(callback => {
      try {
        callback(changes);
      } catch (error) {
        console.warn('⚠️ Change callback error:', error.message);
      }
    });
  }

  stopDevelopmentMode() {
    if (this.watchInterval) {
      clearInterval(this.watchInterval);
      this.watchInterval = null;
      console.log('🛑 Development mode stopped');
    }
  }

  showDeveloperCommands() {
    console.log('\n🛠️ DEVELOPER COMMANDS:');
    console.log('-'.repeat(40));
    console.log('• quickTest() - Run instant validation');
    console.log('• createBackup() - Create backup before changes');
    console.log('• fullPipeline() - Run complete release pipeline');
    console.log('• rollbackStatus() - Check rollback system');
    console.log('• stopDevMode() - Stop automatic validation');
    console.log('• resumeDevMode() - Resume automatic validation');
  }

  generateDevelopmentReport() {
    const uptime = this.lastKnownState ? 
      Math.round((Date.now() - this.lastKnownState.timestamp) / 1000) : 0;
    
    console.log('\n📊 DEVELOPMENT SESSION REPORT');
    console.log('=' + '='.repeat(40));
    console.log(`Session Duration: ${uptime}s`);
    console.log(`Validations Queued: ${this.validationQueue.length}`);
    console.log(`Change Listeners: ${this.changeCallbacks.length}`);
    console.log(`Auto-validation: ${this.watchInterval ? 'Active' : 'Stopped'}`);
    
    if (this.lastKnownState) {
      console.log('\nCurrent State:');
      console.log(`• Content sections: ${this.lastKnownState.content?.length || 0}`);
      console.log(`• Gallery items: ${this.lastKnownState.gallery?.length || 0}`);
      console.log(`• Room types: ${this.lastKnownState.rooms?.length || 0}`);
    }
  }
}

// Initialize workflow optimizer
const workflowOptimizer = new DevelopmentWorkflowOptimizer();

// Quick command functions
async function quickTest() {
  await workflowOptimizer.runQuickValidation(['Manual test trigger']);
}

function startDevMode() {
  workflowOptimizer.startDevelopmentMode();
}

function stopDevMode() {
  workflowOptimizer.stopDevelopmentMode();
}

function resumeDevMode() {
  workflowOptimizer.startDevelopmentMode();
}

function devReport() {
  workflowOptimizer.generateDevelopmentReport();
}

// Export for use
if (typeof window !== 'undefined') {
  window.quickTest = quickTest;
  window.startDevMode = startDevMode;
  window.stopDevMode = stopDevMode;
  window.resumeDevMode = resumeDevMode;
  window.devReport = devReport;
  window.DevelopmentWorkflowOptimizer = DevelopmentWorkflowOptimizer;
  
  console.log('⚡ Development Workflow Optimizer loaded!');
  console.log('Commands: startDevMode(), quickTest(), devReport()');
}