import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  outputDir: './test-results',
  snapshotDir: './tests/visual/screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'Desktop Chrome',
      use: {
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        viewport: { width: 375, height: 812 },
        deviceScaleFactor: 2,
      },
    },
  ],
  
  webServer: process.env.CI ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
});