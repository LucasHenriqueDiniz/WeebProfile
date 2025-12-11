/**
 * Default Style Definition
 * 
 * Modern UI style with Poppins font and color theme variations
 */

import { defaultThemes, type ThemeVariables } from '../../themes/themes'
import type { DefaultTheme } from '../../themes/types'
import { getDefaultThemeVariables as getDefaultThemeVariablesFromUtils } from '../../themes/theme-utils'

/**
 * Default style CSS (embedded for browser compatibility)
 */
const DEFAULT_STYLE_CSS = `/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}


/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */

/* Default Style CSS */

/* Load Poppins font from Google Fonts */
@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfecg.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/poppins/v21/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Container */
#svg-main .default-container {
  --font-family: Poppins, sans-serif;
  font-family: Poppins, sans-serif;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* Ensure foreignObject content doesn't overflow */
#svg-main foreignObject {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#svg-main foreignObject > div {
  width: 100%;
  max-width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  max-width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* Plugin CSS Classes - Using CSS theme variables */
#svg-main .text-default-muted {
  color: var(--default-color-muted) !important;
}

#svg-main .text-default-muted-light {
  color: var(--default-color-muted-light) !important;
}

#svg-main .text-default-highlight {
  color: var(--default-color-highlight) !important;
}

#svg-main .text-default-raw {
  color: var(--default-color-raw) !important;
}

#svg-main .text-default-success {
  color: var(--default-color-success) !important;
}

#svg-main .text-default-fg {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-text {
  color: var(--default-color-default) !important;
}

#svg-main .text-default-link {
  color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-highlight {
  background-color: var(--default-color-highlight) !important;
}

#svg-main .bg-default-surface {
  background-color: var(--default-color-surface) !important;
}

#svg-main .bg-default-muted {
  background-color: var(--default-color-muted) !important;
}

#svg-main .bg-default-muted\\/20 {
  background-color: color-mix(in srgb, var(--default-color-muted) 20%, transparent) !important;
}

#svg-main .bg-default-15 {
  background-color: color-mix(in srgb, var(--default-color-highlight) 15%, transparent) !important;
}

#svg-main .border-default-highlight {
  border-color: var(--default-color-highlight) !important;
}

#svg-main .fill-default-highlight {
  fill: var(--default-color-highlight) !important;
}

#svg-main .text-default {
  color: var(--default-color-default) !important;
}

/* Image Square Container Classes */
#svg-main .image-square-container-50 {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-60 {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-75 {
  width: 75px;
  height: 75px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-100 {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

#svg-main .image-square-container-200 {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* When inside col-span-2, container should take full width/height including gap */
#svg-main .col-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

#svg-main .image-square-container-50 img,
#svg-main .image-square-container-60 img,
#svg-main .image-square-container-75 img,
#svg-main .image-square-container-100 img,
#svg-main .image-square-container-200 img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Image classes for direct use (not in containers) */
#svg-main .image-portrait {
  width: 75px;
  height: 120px;
  object-fit: cover;
  border-radius: 0.375rem;
  flex-shrink: 0;
}

#svg-main .image-square {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.375rem;
}

/* Favorite Container - used as image container with overlay */
#svg-main .favorite-container {
  position: relative;
  width: 75px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Favorite Container when used in simple grid (portrait images) */
#svg-main .favorite-container img.image-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Favorite Overlay */
#svg-main .favorite-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  font-weight: 500;
}

#svg-main .favorite-overlay * {
  color: white !important;
}

/* Favorite Overlay Simple - smaller for image grid */
#svg-main .favorite-overlay-simple {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
}

#svg-main .favorite-overlay-simple * {
  color: white !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Additional plugin utilities */
#svg-main .items-baseline {
  align-items: baseline;
}

#svg-main .shrink-0 {
  flex-shrink: 0;
}

#svg-main .grid-cols-\\[auto_auto_min-content\\] {
  grid-template-columns: auto auto min-content;
}

#svg-main .grid-cols-\\[75px_1fr\\] {
  grid-template-columns: 75px 1fr;
}

#svg-main .h-\\[50px\\] {
  height: 50px;
}

#svg-main .rounded-2xl {
  border-radius: 1rem;
}

#svg-main .shadow-md {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

#svg-main .h-\\[15px\\] {
  height: 15px;
}

#svg-main .leading-none {
  line-height: 1;
}

#svg-main .text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#svg-main .sm-text {
  font-size: 0.875rem;
}

#svg-main .md-2-text {
  font-size: 0.875rem;
}

#svg-main .text-md {
  font-size: 1rem;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .text-bold {
  font-weight: 700;
}

/* Line clamp utilities */
#svg-main .line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Synopsis text */
#svg-main .synopsis-text {
  font-size: 12px;
  line-height: 1.25rem;
  color: var(--default-color-muted);
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Grid utilities are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: grid-cols-10 half:grid-cols-5 */

/* Half-mode variant classes are now auto-generated by Tailwind CSS */
/* Use Tailwind classes like: half:grid-cols-5, half:flex-col, etc. */

/* Ensure all content respects half mode width */
#svg-main.half * {
  max-width: 100%;
  box-sizing: border-box;
}

#svg-main.half .default-container {
  max-width: 100% !important;
  width: 100% !important;
}

#svg-main.half section {
  max-width: 100% !important;
  width: 100% !important;
}

/* Min height utilities */
#svg-main .min-h-100 {
  min-height: 100px;
}

/* Grid span utilities */
#svg-main .col-span-2 {
  grid-column: span 2 / span 2;
}

#svg-main .row-span-2 {
  grid-row: span 2 / span 2;
}

/* Width utilities */
#svg-main .w-auto {
  width: auto;
}

#svg-main .min-w-0 {
  min-width: 0;
}

/* Ensure grid items with span take full space */
#svg-main .col-span-2.row-span-2 {
  width: 100%;
  height: 100%;
}

/* Ensure image containers inside spanned items take full space */
#svg-main .col-span-2 .image-square-container-200,
#svg-main .col-span-2.row-span-2 .image-square-container-200 {
  width: 100%;
  height: 100%;
}

/* Tailwind utility classes are now auto-generated by generate-tailwind-css script */
/* See src/styles/shared.css for all Tailwind utilities */
`

/**
 * Get CSS for default style
 * Browser-compatible: uses embedded CSS string
 */
function getCSS(): string {
  return DEFAULT_STYLE_CSS
}

/**
 * Get theme variables for default style
 * Delegates to theme-utils for consistency
 */
export function getDefaultThemeVariables(theme: DefaultTheme | string): Record<string, string> {
  return getDefaultThemeVariablesFromUtils(theme) as Record<string, string>
}

/**
 * Default style definition
 */
export const defaultStyle = {
  name: 'default',
  displayName: 'Default',
  fontFamily: "'Poppins', sans-serif",
  containerClass: 'default-container',
  getCSS: getCSS,
  getThemeVariables: getDefaultThemeVariables,
  themes: defaultThemes,
}

export default defaultStyle
