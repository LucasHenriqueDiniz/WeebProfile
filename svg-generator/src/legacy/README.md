# Legacy Code Migration Guide

## Overview

This directory contains the original server.ts and other legacy code that has been migrated to the new architecture. The code here is kept for reference and gradual migration.

## Migration Status

### ✅ Completed

- **Logging System**: Migrated to `infrastructure/logging/`
- **Directory Structure**: Reorganized according to Clean Architecture
- **Types**: Moved to `shared/types/`
- **Utils**: Moved to `shared/utils/`
- **Database**: Moved to `infrastructure/database/`
- **Browser/Layout**: Moved to `infrastructure/browser/`

### 🔄 In Progress

- **Server Logic**: Being migrated to `infrastructure/http/routes/`
- **Configuration**: Being centralized in `core/config/`
- **Error Handling**: Being standardized in `core/errors/`

### 📋 Next Steps

1. Create new HTTP handlers in `infrastructure/http/routes/`
2. Implement ConfigManager in `core/config/`
3. Set up error hierarchy in `core/errors/`
4. Update all imports to use new structure
5. Test integration
6. Remove legacy code

## New Architecture

```
src/
├── core/                    # Business logic
│   ├── config/             # Configuration management
│   ├── errors/             # Error hierarchy
│   └── plugins/            # Plugin management
├── infrastructure/         # Technical details
│   ├── http/               # HTTP handlers
│   ├── database/           # Database access
│   ├── browser/            # Browser automation
│   └── logging/            # Logging system
├── shared/                 # Shared code
│   ├── types/              # Type definitions
│   ├── utils/              # Utility functions
│   └── constants/          # Global constants
└── legacy/                 # Old code (to be removed)
    └── server.ts           # Original server
```

## Import Updates

When migrating code from legacy, update imports:

### Before

```typescript
import { getUserEssentialConfigs } from "./db/essential-configs.js"
import { measureHeight } from "./layout/measure-height.js"
import { Logger } from "./infrastructure/logging/Logger.js"
```

### After

```typescript
import { getUserEssentialConfigs } from "./infrastructure/database/essential-configs.js"
import { measureHeight } from "./infrastructure/browser/measure-height.js"
import { Logger } from "./infrastructure/logging/Logger.js"
```

## Notes

- The legacy server.ts is fully functional and can be used as reference
- All console.log statements have been migrated to structured logging
- Database connections remain the same, only imports changed
- Browser automation code is now in infrastructure/browser
- No breaking changes to the external API
