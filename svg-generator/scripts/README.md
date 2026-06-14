# SVG Generator Test Scripts

This directory contains test scripts for the SVG generator system.

## Available Scripts

### `test-svg-generator.ts`

**Complete SVG generator test with mock data**

Tests the full SVG generation pipeline including:

- Mock plugin data (16personalities example)
- Per-plugin height calculation (`calculateHeight`)
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

## Debug Features

```bash
# Save debug files (SVG + metadata)
SAVE_DEBUG=1 pnpm --filter @weeb/svg-generator test:generator
```

Debug files are saved to `./debug/` directory.

## Expected Results

### Successful Test Output

```
🧪 Testing SVG Generator with per-plugin height calculation...

📐 Testing half size...
  Width: 415px
  ⏱️  Generation time: 1247ms
  📏 Calculated height: 180px
  📐 Generated width: 415px
  📄 SVG size: 2847 characters
  ✅ half test passed!

📐 Testing full size...
  Width: 830px
  ⏱️  Generation time: 2156ms
  📏 Calculated height: 180px
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

1. **SVG generation errors**
   - Check mock data structure
   - Verify plugin configuration
   - Review error logs

2. **Performance issues**
   - Generation should complete within 5 seconds
   - Check for infinite loops in plugins

## Development

When adding new tests:

1. Use `test-svg-generator.ts` as template
2. Add mock data for new scenarios
3. Include validation for expected results
4. Add debug output for troubleshooting
5. Update this README with new test details
