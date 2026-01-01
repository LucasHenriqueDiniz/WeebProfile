/**
 * Test script for height measurement
 * 
 * Tests the Playwright height measurement with a simple HTML mock.
 * 
 * Usage: pnpm --filter @weeb/svg-generator test:measure
 */

import { measureHeight } from '../src/layout/measure-height.js'
import { closeBrowser } from '../src/layout/browser.js'
import fs from 'node:fs/promises'
import path from 'node:path'

const TEST_WIDTH = 415 // Same as SVG half size

/**
 * Create a simple HTML mock for testing
 */
function createTestHTML(): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: #ffffff;
    }
    .container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .header {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      padding: 12px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .item {
      padding: 16px;
      background: #e5e7eb;
      border-radius: 6px;
      font-size: 14px;
      color: #374151;
    }
    .footer {
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Test Header</div>
    <div class="content">
      <div class="item">Item 1: This is a test item with some content.</div>
      <div class="item">Item 2: Another test item with more text content.</div>
      <div class="item">Item 3: Third item to test height calculation.</div>
      <div class="item">Item 4: Fourth item with additional content.</div>
      <div class="item">Item 5: Fifth item to ensure proper height measurement.</div>
    </div>
    <div class="footer">Test Footer</div>
  </div>
</body>
</html>
  `.trim()
}

async function main() {
  console.log('🧪 Testing Playwright height measurement...\n')
  console.log(`📐 Test width: ${TEST_WIDTH}px\n`)

  const testHTML = createTestHTML()
  
  try {
    // Measure height
    console.log('[Test] Measuring height...')
    const height = await measureHeight({
      html: testHTML,
      width: TEST_WIDTH,
      timeoutMs: 5000,
    })

    console.log(`\n✅ SUCCESS: Height measured: ${height}px`)

    // Validate result
    if (height === 0 || isNaN(height)) {
      console.error('❌ ERROR: Invalid height returned (0 or NaN)')
      process.exit(1)
    }

    if (height < 10) {
      console.warn('⚠️ WARNING: Height seems too small (< 10px)')
    }

    // Optional: Save screenshot for debugging
    if (process.env.SAVE_SCREENSHOT === '1') {
      try {
        const { getBrowserContext } = await import('../src/layout/browser.js')
        const context = await getBrowserContext()
        const page = await context.newPage()
        
        await page.setViewportSize({ width: TEST_WIDTH, height: height + 100 })
        await page.setContent(testHTML, { waitUntil: 'domcontentloaded' })
        
        const tmpDir = path.resolve(process.cwd(), 'tmp')
        await fs.mkdir(tmpDir, { recursive: true })
        const screenshotPath = path.join(tmpDir, 'measure.png')
        
        await page.screenshot({ path: screenshotPath, fullPage: true })
        await page.close()
        
        console.log(`📸 Screenshot saved: ${screenshotPath}`)
      } catch (screenshotError) {
        console.warn('⚠️ Could not save screenshot:', screenshotError)
      }
    }

    console.log('\n✅ Test passed!')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  } finally {
    // Cleanup
    await closeBrowser().catch(console.error)
  }
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})













