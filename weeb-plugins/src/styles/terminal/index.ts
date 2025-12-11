/**
 * Terminal Style Definition
 * 
 * Terminal/console style with monospace font and terminal themes
 */

import { terminalThemes } from '../../themes/themes'
import type { TerminalTheme } from '../../themes/types'

/**
 * Terminal style CSS (embedded for browser compatibility)
 */
const TERMINAL_STYLE_CSS = `/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: ui-monospace, 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: ui-monospace, 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: ui-monospace, 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: ui-monospace, 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
  border-radius: 0;
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: ui-monospace, 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: ui-monospace, 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
  border-radius: 0;
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
  border-radius: 0;
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
  border-radius: 0;
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 0;
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal sections - background estilo terminal */
#svg-main .terminal-container section {
  background-color: var(--terminal-color-background);
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 0;
}

/* Terminal body - espaçamento entre seções */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
  background-color: var(--terminal-color-background);
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal Command */
#svg-main .terminal-command {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-family: var(--font-family);
  color: var(--terminal-color-default);
}

#svg-main .terminal-prompt {
  color: var(--terminal-color-highlight);
  font-weight: 700;
  user-select: none;
}

#svg-main .terminal-command-text {
  color: var(--terminal-color-default);
  font-family: var(--font-family);
}

/* Terminal Line With Dots */
#svg-main .terminal-line-with-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-family: var(--font-family);
  width: 100%;
  overflow: hidden;
}

#svg-main .terminal-line-title {
  color: var(--terminal-color-muted);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

#svg-main .terminal-line-dots {
  flex: 1;
  min-width: 0.5rem;
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    var(--terminal-color-muted) 0,
    var(--terminal-color-muted) 2px,
    transparent 2px,
    transparent 4px
  );
  margin: 0 0.5rem;
  opacity: 0.4;
}

#svg-main .terminal-line-value {
  color: var(--terminal-color-default);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  text-align: right;
}

/* Terminal Line Break */
#svg-main .terminal-line-break {
  height: 0.5rem;
  width: 100%;
  display: block;
}

/* Terminal Body */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
  margin-right: 0.75rem;
}

#svg-main .terminal-header-title {
  color: var(--terminal-color-default);
  font-size: 0.875rem;
  font-weight: 500;
  user-select: none;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal Command */
#svg-main .terminal-command {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-family: var(--font-family);
  color: var(--terminal-color-default);
}

#svg-main .terminal-prompt {
  color: var(--terminal-color-highlight);
  font-weight: 700;
  user-select: none;
}

#svg-main .terminal-command-text {
  color: var(--terminal-color-default);
  font-family: var(--font-family);
}

/* Terminal Line With Dots */
#svg-main .terminal-line-with-dots {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-family: var(--font-family);
  width: 100%;
  overflow: hidden;
}

#svg-main .terminal-line-title {
  color: var(--terminal-color-muted);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

#svg-main .terminal-line-dots {
  flex: 1;
  min-width: 0.5rem;
  height: 1px;
  background: repeating-linear-gradient(
    to right,
    var(--terminal-color-muted) 0,
    var(--terminal-color-muted) 2px,
    transparent 2px,
    transparent 4px
  );
  margin: 0 0.5rem;
  opacity: 0.4;
}

#svg-main .terminal-line-value {
  color: var(--terminal-color-default);
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  text-align: right;
}

/* Terminal Line Break */
#svg-main .terminal-line-break {
  height: 0.5rem;
  width: 100%;
  display: block;
}

/* Terminal Body */
#svg-main .terminal-body {
  font-family: var(--font-family);
  color: var(--terminal-color-default);
  padding: 0.5rem 0;
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  font-family: 'Courier New', Courier, 'Lucida Console', Monaco, monospace;
  width: 100%;
  background-color: var(--terminal-color-background);
  color: var(--terminal-color-default);
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: var(--terminal-color-surface);
  color: var(--terminal-color-default);
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}

/* Terminal Style CSS */

/* Container */
#svg-main .terminal-container {
  --font-family: ui-monospace, monospace;
  font-family: ui-monospace, monospace;
  width: 100%;
}

/* Section styles for plugins */
#svg-main section {
  width: 100%;
  padding: 0 8px;
  display: flex;
  flex-direction: column;
}

/* Terminal CSS Classes - Using CSS theme variables */
#svg-main .text-terminal-muted {
  color: var(--terminal-color-muted) !important;
}

#svg-main .text-terminal-muted-light {
  color: var(--terminal-color-muted-light) !important;
}

#svg-main .text-terminal-highlight {
  color: var(--terminal-color-highlight) !important;
}

#svg-main .text-terminal-raw {
  color: var(--terminal-color-raw) !important;
}

#svg-main .text-terminal-success {
  color: var(--terminal-color-success) !important;
}

#svg-main .text-terminal-warning {
  color: #ffaa00 !important;
}

#svg-main .bg-terminal-highlight {
  background-color: var(--terminal-color-highlight) !important;
}

#svg-main .bg-terminal-surface {
  background-color: var(--terminal-color-surface) !important;
}

#svg-main .bg-terminal-muted-light {
  background-color: var(--terminal-color-muted-light) !important;
}

#svg-main .border-terminal-muted {
  border-color: var(--terminal-color-muted) !important;
}

/* Terminal Header */
#svg-main .terminal-header {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background: #1e1e1e;
}

#svg-main .terminal-header-dots {
  display: flex;
  gap: 0.5rem;
}

#svg-main .terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

#svg-main .terminal-dot-red {
  background: #ff5f56;
}

#svg-main .terminal-dot-yellow {
  background: #ffbd2e;
}

#svg-main .terminal-dot-green {
  background: #27c93f;
}

#svg-main .bg-black\\/25 {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Terminal utilities */
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

#svg-main .text-bold {
  font-weight: 700;
}

#svg-main .no-underline {
  text-decoration: none;
}

#svg-main .align-center {
  align-items: center;
}

#svg-main .genre-tag {
  display: inline-block;
}
`

/**
 * Get CSS for terminal style
 * Browser-compatible: uses embedded CSS string
 */
function getCSS(): string {
  return TERMINAL_STYLE_CSS
}

/**
 * Get theme variables for terminal style
 * Returns Record<string, string> for compatibility with StyleDefinition
 */
export function getTerminalThemeVariables(theme: TerminalTheme | string): Record<string, string> {
  const validTheme = (theme in terminalThemes ? theme : 'default') as TerminalTheme
  const selectedTheme = terminalThemes[validTheme]

  // Always return a valid theme - default theme is guaranteed to exist
  // Using non-null assertion because 'default' theme is always defined in terminalThemes
  return (selectedTheme ?? terminalThemes['default']) as Record<string, string>
}

/**
 * Terminal style definition
 */
export const terminalStyle = {
  name: 'terminal',
  displayName: 'Terminal',
  fontFamily: 'ui-monospace, monospace',
  containerClass: 'terminal-container',
  getCSS: getCSS,
  getThemeVariables: getTerminalThemeVariables,
  themes: terminalThemes,
}

export default terminalStyle

