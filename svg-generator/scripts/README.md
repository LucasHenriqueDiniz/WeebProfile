# SVG Generator Test Scripts

This directory contains test scripts for the SVG generator system.

## Available Scripts

### `test-svg-generator.ts` (Recommended)

**Complete SVG generator test with mock data**

Tests the full SVG generation pipeline including:

- Mock plugin data (16personalities example)
- Playwright height measurement
- Both half and full sizes
- Performance timing
- Result validation

**Usage:**

```bash
pnpm --filter @weeb/svg-generator test:generator
```

**Features:**

- ✅ Complete pipeline testing
- ✅ Mock data for consistent results
- ✅ Performance measurement
- ✅ Debug file generation (set SAVE_DEBUG=1)
- ✅ Height validation and warnings
- ✅ Type-safe implementation

### `test-measure-height.ts` (Legacy)

**Basic Playwright height measurement test**

Tests only the height measurement functionality with simple HTML mock.

**Usage:**

```bash
pnpm --filter @weeb/svg-generator test:measure
```

**Features:**

- ⚠️ Basic HTML testing only
- ⚠️ Does not test full SVG generation
- ⚠️ Limited to simple layout testing

## Which to Use?

**Use `test:generator` for:**

- Complete integration testing
- SVG generation validation
- Performance benchmarking
- Real-world mock data testing
- Debugging generation issues

**Use `test:measure` for:**

- Quick Playwright functionality check
- Simple height measurement verification
- Browser setup testing

## Debug Features

Both scripts support debug mode:

```bash
# Save debug files (SVG + metadata)
SAVE_DEBUG=1 pnpm --filter @weeb/svg-generator test:generator

# Save screenshot from test:measure
SAVE_SCREENSHOT=1 pnpm --filter @weeb/svg-generator test:measure
```

Debug files are saved to `./debug/` directory.

## Expected Results

### Successful Test Output

```
🧪 Testing SVG Generator with Playwright height measurement...

📐 Testing half size...
  Width: 415px
  ⏱️  Generation time: 1247ms
  📏 Measured height: 180px
  📐 Generated width: 415px
  📄 SVG size: 2847 characters
  ✅ half test passed!

📐 Testing full size...
  Width: 830px
  ⏱️  Generation time: 2156ms
  📏 Measured height: 180px
  📐 Generated width: 830px
  📄 SVG size: 2847 characters
  ✅ full test passed!

📊 Test Summary:
  HALF: 180px (1247ms)
  FULL: 180px (2156ms)

✅ All tests passed!
```

## Troubleshooting

### Common Issues

1. **Playwright not installed**

   ```bash
   pnpm --filter @weeb/svg-generator postinstall
   ```

2. **Height measurement fails**
   - Check if browser is launching correctly
   - Verify Playwright dependencies
   - Try running with SAVE_DEBUG=1

3. **SVG generation errors**
   - Check mock data structure
   - Verify plugin configuration
   - Review error logs

4. **Performance issues**
   - Generation should complete within 5 seconds
   - Check for infinite loops in plugins
   - Verify browser cleanup

## Development

When adding new tests:

1. Use `test-svg-generator.ts` as template
2. Add mock data for new scenarios
3. Include validation for expected results
4. Add debug output for troubleshooting
5. Update this README with new test details
