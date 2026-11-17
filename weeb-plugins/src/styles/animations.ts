/**
 * Stylesheet for opt-in card animations (see templates/animations.tsx).
 *
 * Added to the card only when animations are on, and inert until the container
 * carries `weeb-anim`.
 *
 * Rules every animation here follows:
 * - `animation-fill-mode: backwards`, never `forwards`. The first keyframe holds
 *   during the delay; once the animation ends it stops applying, so the card at rest
 *   is the static card itself rather than a last keyframe that looks like it.
 * - Nothing changes layout: opacity, transform, clip-path and colour only. The height
 *   comes from calculateHeight() and must not move.
 * - All motion sits inside `prefers-reduced-motion: no-preference`. Outside it the
 *   helpers (cursor, counter overlay) are hidden and the card is static.
 *
 * Tailwind scans this file for class names, and every utility it finds ends up in the
 * shared CSS of every card, animated or not. Keep words that read as Tailwind utilities
 * out of it, comments included (a timing keyword here once added two rules to every
 * static card), and write timing functions as cubic-bezier().
 *
 * Timing: each leaf section (a <section> with no <section> inside; several plugins
 * wrap theirs in one) starts at `--weeb-at`, built from the plugin's first index
 * (`--weeb-base`, set on the plugin's wrapper), the section's position among its
 * siblings (`--weeb-k`, from :nth-of-type) and the gap between sections (`--weeb-step`,
 * on the container). animationTimeline() picks the gap so the last one ends in time.
 */

import { ANIMATION_TIMING, WAVE_ROWS } from "../templates/animations"

/** Sections per plugin that get their own slot; later ones share the last slot. */
const MAX_SECTIONS_PER_PLUGIN = 24

const t = ANIMATION_TIMING
const s = (seconds: number) => `${Math.round(seconds * 1000)}ms`

const LEAF = "#svg-main .weeb-anim section:not(:has(section))"

function sectionIndexRules(): string {
  const rules: string[] = []
  for (let k = 1; k < MAX_SECTIONS_PER_PLUGIN; k++) {
    rules.push(`#svg-main .weeb-anim section:nth-of-type(${k}){--weeb-k:${k - 1}}`)
  }
  // The last slot and everything after it: without the n+, sections past it matched no
  // rule and started first, at k=0.
  rules.push(
    `#svg-main .weeb-anim section:nth-of-type(n+${MAX_SECTIONS_PER_PLUGIN}){--weeb-k:${MAX_SECTIONS_PER_PLUGIN - 1}}`
  )
  return rules.join("\n")
}

/** Row of each cell in a wave column; the first row is the fallback, 0. */
function waveRowRules(): string {
  const rules: string[] = []
  for (let r = 2; r <= WAVE_ROWS; r++) {
    rules.push(`#svg-main .weeb-anim .weeb-wave > :nth-child(${r}){--weeb-r:${r - 1}}`)
  }
  return rules.join("\n")
}

/*
 * The count. AnimatedNumber puts the target on the number as an integer, `--weeb-to`
 * (the value times `--weeb-scale`, 10^decimals), and the overlay prints `--weeb-p` (0 to 1,
 * animated) of it: the integer part, and for numbers with decimals the remainder after
 * the dot. The keyframes only ever animate --weeb-p between literal numbers: Firefox
 * interpolates a keyframe that reads var() as a discrete step (0, then the end value at
 * half time), and WebKit does not redraw a counter set straight from an animated
 * property, only one computed through round()/mod() as below.
 */
const COUNT_N = "round(var(--weeb-to) * var(--weeb-p), 1)"
const COUNT_INTEGER = `round(down, ${COUNT_N} / var(--weeb-scale, 1), 1)`
const COUNT_FRACTION = `mod(${COUNT_N}, var(--weeb-scale, 1))`

export const ANIMATIONS_CSS = `
@property --weeb-p {
  syntax: "<number>";
  inherits: false;
  initial-value: 0;
}

/* Static helpers: present only when animations are on, hidden at rest. */
#svg-main .weeb-anim .weeb-cmd-text {
  position: relative;
}
#svg-main .weeb-anim .weeb-cmd-cursor {
  position: absolute;
  top: 0.15em;
  bottom: 0.15em;
  left: 0;
  width: 0.6em;
  background: var(--terminal-color-highlight, currentColor);
  visibility: hidden;
}
/* inline-block gives the number a box as tall as its line, so the overlay's line starts
   where the number's does and its digits sit on the same baseline. On a plain inline the
   box is only as tall as the glyphs: the overlay sat half the leading lower and jumped up
   when the count ended (2px in the terminal style). A number does not wrap, so the
   number at rest lays out as it does with animations off. */
#svg-main .weeb-anim .weeb-num {
  position: relative;
  display: inline-block;
}
#svg-main .weeb-anim .weeb-num::after {
  content: counter(weeb-i) var(--weeb-unit, "");
  counter-reset: weeb-i ${COUNT_INTEGER} weeb-f ${COUNT_FRACTION};
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  -webkit-text-fill-color: currentColor;
  visibility: hidden;
}
#svg-main .weeb-anim .weeb-num-1::after {
  content: counter(weeb-i) "." counter(weeb-f) var(--weeb-unit, "");
}
#svg-main .weeb-anim .weeb-num-2::after {
  content: counter(weeb-i) "." counter(weeb-f, decimal-leading-zero) var(--weeb-unit, "");
}

@media (prefers-reduced-motion: no-preference) {
${sectionIndexRules()}

  ${LEAF} {
    --weeb-at: calc((var(--weeb-base, 0) + var(--weeb-k, 0)) * var(--weeb-step, 0s));
    --weeb-out: calc(var(--weeb-at) + ${s(t.contentDelay)});
  }
  #svg-main .weeb-anim.terminal-container section:not(:has(section)) {
    --weeb-out: calc(var(--weeb-at) + ${s(t.type)});
  }

  /* Default style: each section rises into place in turn. */
  #svg-main .weeb-anim.default-container section:not(:has(section)) {
    animation: weeb-rise ${s(t.enter)} cubic-bezier(0.2, 0.8, 0.2, 1) var(--weeb-at) backwards;
  }

  /* Terminal style: the prompt waits for its turn, the command is typed, then the rest
     of the section shows up. */
  #svg-main .weeb-anim .weeb-cmd {
    animation: weeb-wait 1ms var(--weeb-at, 0s) backwards;
  }
  #svg-main .weeb-anim .weeb-cmd-chars {
    animation: weeb-type ${s(t.type)} steps(var(--weeb-chars, 20), end) var(--weeb-at, 0s) backwards;
  }
  #svg-main .weeb-anim .weeb-cmd-cursor {
    animation: weeb-cursor ${s(t.type)} steps(var(--weeb-chars, 20), end) var(--weeb-at, 0s);
  }
  #svg-main .weeb-anim.terminal-container section:not(:has(section)) > :not(.weeb-cmd):not(:has(.weeb-cmd)) {
    animation: weeb-fade ${s(t.output)} cubic-bezier(0, 0, 0.2, 1) var(--weeb-out) backwards;
  }

  /* Bars fill from the left; numbers count up from 0. */
  #svg-main .weeb-anim .weeb-bar {
    animation: weeb-fill ${s(t.fill)} cubic-bezier(0.2, 0.8, 0.2, 1) var(--weeb-out, 0s) backwards;
  }
  #svg-main .weeb-anim .weeb-num {
    animation: weeb-num-hide ${s(t.fill)} linear var(--weeb-out, 0s) backwards;
  }
  #svg-main .weeb-anim .weeb-num::after {
    animation: weeb-count ${s(t.fill)} cubic-bezier(0.2, 0.8, 0.2, 1) var(--weeb-out, 0s) backwards;
  }

  /* Calendar cells fade in along a diagonal wave, from the top right cell to the
     bottom left one: each column carries its distance from that corner (--weeb-c), each
     cell adds its row (--weeb-r), and the grid sets the gap between diagonals
     (--weeb-wave). See cellWave() in templates/animations.tsx. Opacity only: with a
     scale the last frame drew every cell edge up to a pixel off the static card in
     Chromium and Firefox, a jump when the animation ended. */
${waveRowRules()}
  #svg-main .weeb-anim .weeb-wave > * {
    animation: weeb-fade ${s(t.cell)} cubic-bezier(0.2, 0.8, 0.2, 1)
      calc(var(--weeb-out, 0s) + (var(--weeb-c, 0) + var(--weeb-r, 0)) * var(--weeb-wave, 0s)) backwards;
  }
}

@keyframes weeb-rise {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
@keyframes weeb-wait {
  from {
    visibility: hidden;
  }
}
@keyframes weeb-fade {
  from {
    opacity: 0;
  }
}
@keyframes weeb-type {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@keyframes weeb-cursor {
  from {
    visibility: visible;
    left: 0;
  }
  to {
    visibility: visible;
    left: 100%;
  }
}
@keyframes weeb-fill {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}
@keyframes weeb-num-hide {
  from,
  to {
    -webkit-text-fill-color: transparent;
  }
}
@keyframes weeb-count {
  from {
    --weeb-p: 0;
    visibility: visible;
  }
  to {
    --weeb-p: 1;
    visibility: visible;
  }
}
`
