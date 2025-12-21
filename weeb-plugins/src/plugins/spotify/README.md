# Spotify Plugin

⚠️ **IMPORTANT NOTICE: Spotify API Limitations**

This plugin is **currently not functional** due to Spotify's API restrictions for non-enterprise developers.

## Why it's not working

Spotify has implemented strict limitations on their Web API:

- **Development mode**: Limited to only **25 pre-approved users** maximum
- **Commercial/Enterprise**: Requires applications with **250k+ monthly active users**
- **User approval**: Each user must be manually approved in the Spotify Developer Dashboard before they can use the app

These restrictions make it **impossible** to create a public-facing plugin that allows users to connect their Spotify accounts freely, which is the core requirement for this plugin.

## References

- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
- [Spotify API Documentation](https://developer.spotify.com/documentation/web-api)
- [Spotify Developer Blog - Redirect URI Validation](https://developer.spotify.com/blog/)

## Status

This plugin implementation exists in the codebase but is **disabled** (no essential config keys required). The code serves as a reference for future OAuth implementations, but cannot be used with Spotify due to the aforementioned restrictions.

---

**Last updated**: Based on Spotify's policies as of 2025. These restrictions are expected to be enforced starting April 9, 2025, with full migration required by November 2025.
