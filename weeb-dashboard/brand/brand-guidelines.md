# WeebProfile Brand Guidelines

This document defines the visual design system for WeebProfile, based on the modern, vibrant aesthetic that balances playful energy with professional polish.

---

## Brand Identity

### Brand Name

**WeebProfile** - A platform for creating dynamic GitHub profile SVGs that showcase your interests across platforms.

### Brand Personality

- **Vibrant & Energetic**: Bold gradients and dynamic animations
- **Modern & Clean**: Minimalist layouts with thoughtful spacing
- **Playful & Approachable**: Friendly mascot and warm color palette
- **Professional & Reliable**: Consistent patterns and polished interactions

### Mascot

The WeebProfile mascot is a simple, friendly character that appears in hero sections and branding:

- **Colors**: Purple head (`#8b5cf6`) and Pink body (`#ec4899`)
- **Style**: Minimalist, rounded shapes with expressive features
- **Usage**: Hero sections, empty states, loading states, and brand lockups

---

## Color Palette

### Primary Colors

#### Primary (Purple)

- **Primary 500**: `#8b5cf6` / `hsl(258, 90%, 66%)` - Main brand color
- **Primary 600**: `#7c3aed` - Hover states
- **Primary 700**: `#6d28d9` - Active states
- **Primary 50**: `#faf5ff` - Light backgrounds
- **Primary 900**: `#4c1d95` - Dark accents

**Usage**: Primary buttons, brand elements, active states, links

#### Secondary (Pink)

- **Secondary 500**: `#ec4899` / `hsl(330, 81%, 60%)` - Accent color
- **Secondary 600**: `#db2777` - Hover states
- **Secondary 50**: `#fdf2f8` - Light backgrounds

**Usage**: Accent elements, gradients, mascot body, highlights

### Accent Colors

#### Cyan

- **Cyan 500**: `#06b6d4` / `hsl(188, 94%, 43%)` - Gradient accent
- **Usage**: Gradient combinations, tech/developer themes

#### Orange

- **Orange 500**: `#f97316` / `hsl(25, 95%, 53%)` - Warm accent
- **Usage**: Warm themes, highlights, call-to-action variations

### Neutral Colors

#### Backgrounds

- **Background (Light)**: `#ffffff` / `hsl(0, 0%, 100%)`
- **Background (Dark)**: `#0d1117` / `hsl(210, 24%, 6%)` - GitHub dark
- **Surface (Light)**: `#f6f8fa` / `hsl(210, 24%, 96%)`
- **Surface (Dark)**: `#161b22` / `hsl(210, 24%, 9%)`
- **Surface Alt (Light)**: `#ffffff` with subtle borders
- **Surface Alt (Dark)**: `#21262d` / `hsl(210, 24%, 12%)`

#### Text Colors

- **Foreground (Light)**: `#24292f` / `hsl(210, 7%, 15%)`
- **Foreground (Dark)**: `#c9d1d9` / `hsl(210, 17%, 82%)`
- **Muted (Light)**: `#656d76` / `hsl(215, 16%, 47%)`
- **Muted (Dark)**: `#8b949e` / `hsl(210, 10%, 60%)`

#### Borders

- **Border (Light)**: `#d0d7de` / `hsl(210, 14%, 83%)`
- **Border (Dark)**: `#30363d` / `hsl(210, 18%, 20%)`

### Semantic Colors

#### Success

- **Success**: `#10b981` / `hsl(142, 71%, 45%)`
- **Usage**: Success messages, positive indicators, completed states

#### Danger

- **Danger**: `#f85149` / `hsl(0, 72%, 51%)` (dark) / `#da3633` (light)
- **Usage**: Error messages, destructive actions, warnings

#### Warning

- **Warning**: `#f59e0b` / `hsl(38, 92%, 50%)`
- **Usage**: Warnings, caution states

### Gradient Patterns

#### Primary Gradient (Hero Text)

```css
background: linear-gradient(to right, #8b5cf6, #ec4899, #06b6d4);
background-clip: text;
-webkit-background-clip: text;
color: transparent;
```

**Usage**: Hero headings, brand text, special highlights

#### Background Gradients

- **Hero Background**: `bg-gradient-to-br from-background via-background to-primary/5`
- **Card Gradients**: `bg-gradient-to-br from-gray-900 to-black` (dark cards)
- **Button Glow**: `shadow-[0_0_30px_rgba(139,92,246,0.5)]`

---

## Typography

### Font Family

**Primary Font**: Inter

- **Source**: Google Fonts
- **Weights**: 400 (Regular), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Usage**: All UI text, headings, body copy

**Monospace Font**: JetBrains Mono / Fira Code

- **Usage**: Code blocks, technical content, configuration examples

### Type Scale

#### Headings

- **H1 (Hero)**: `text-4xl md:text-5xl lg:text-5xl` / `font-black` / `tracking-tight` / `leading-tight`
  - Mobile: 2.25rem (36px)
  - Desktop: 3rem (48px)
  - Weight: 800 (Extrabold)
  - Usage: Hero titles, page headers

- **H2 (Section)**: `text-3xl md:text-4xl` / `font-bold`
  - Size: 1.875rem (30px) / 2.25rem (36px)
  - Weight: 700 (Bold)
  - Usage: Section titles, major headings

- **H3 (Subsection)**: `text-2xl` / `font-semibold`
  - Size: 1.5rem (24px)
  - Weight: 600 (Semibold)
  - Usage: Card titles, subsection headers

- **H4**: `text-xl` / `font-semibold`
  - Size: 1.25rem (20px)
  - Usage: Minor headings

#### Body Text

- **Large**: `text-lg` / 1.125rem (18px)
  - Usage: Lead paragraphs, important descriptions

- **Base**: `text-base` / 1rem (16px)
  - Usage: Standard body text, paragraphs

- **Small**: `text-sm` / 0.875rem (14px)
  - Usage: Secondary text, captions, helper text

- **Extra Small**: `text-xs` / 0.75rem (12px)
  - Usage: Labels, badges, fine print

### Typography Patterns

#### Hero Title Pattern

```tsx
<h1 className="text-4xl md:text-5xl lg:text-5xl font-black tracking-tight leading-tight">
  <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
    {title}
  </span>
</h1>
```

#### Section Title Pattern

```tsx
<h2 className="text-3xl md:text-4xl font-bold mb-4">
  {title}
</h2>
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
  {description}
</p>
```

#### Body Text Pattern

```tsx
<p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed">{content}</p>
```

---

## Spacing & Layout

### Spacing Scale

- **xs**: `0.25rem` (4px) - Tight spacing, icon padding
- **sm**: `0.5rem` (8px) - Small gaps, compact layouts
- **md**: `1rem` (16px) - Standard spacing
- **lg**: `1.5rem` (24px) - Comfortable spacing
- **xl**: `2rem` (32px) - Section spacing
- **2xl**: `3rem` (48px) - Large section spacing
- **3xl**: `4rem` (64px) - Hero spacing

### Container Patterns

- **Container**: `container mx-auto px-4`
- **Max Width**: `max-w-2xl`, `max-w-3xl`, `max-w-4xl`, `max-w-6xl`
- **Section Padding**: `py-16 md:py-24` (64px / 96px)

### Grid Patterns

- **2 Columns**: `grid grid-cols-1 md:grid-cols-2 gap-6`
- **3 Columns**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **6 Columns**: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4`

---

## Border Radius

### Radius Scale

- **sm**: `calc(var(--radius) - 4px)` ≈ 2px - Small elements
- **md**: `calc(var(--radius) - 2px)` ≈ 4px - Buttons, inputs
- **lg**: `var(--radius)` = `0.5rem` (8px) - Cards, containers
- **xl**: `1rem` (16px) - Large cards
- **2xl**: `1.5rem` (24px) - Hero cards, featured elements
- **full**: `9999px` - Pills, badges, avatars

### Usage Patterns

- **Cards**: `rounded-2xl` (16px) - Main content cards
- **Buttons**: `rounded-md` (8px) - Standard buttons
- **Badges**: `rounded-full` - Pills and badges
- **Inputs**: `rounded-md` (8px) - Form inputs

---

## Shadows & Elevation

### Shadow Scale

- **sm**: `shadow-sm` - Subtle elevation, borders
- **md**: `shadow-md` - Standard cards
- **lg**: `shadow-lg` - Elevated cards, buttons
- **xl**: `shadow-xl` - Prominent elements
- **2xl**: `shadow-2xl` - Hero elements, modals

### Special Effects

- **Glow Effect**: `shadow-[0_0_30px_rgba(139,92,246,0.5)]` - Purple glow on buttons
- **Hover Elevation**: `hover:shadow-2xl` - Interactive cards

### Elevation Usage

- **Level 0**: No shadow (background, text)
- **Level 1**: `shadow-sm` (subtle borders)
- **Level 2**: `shadow-lg` (cards, buttons)
- **Level 3**: `shadow-2xl` (modals, hero cards)

---

## Component Patterns

### Hero Layout Pattern

**Structure**:

- Full viewport height: `h-screen`
- Gradient background: `bg-gradient-to-br from-background via-background to-primary/5`
- Animated blur circles for depth
- Two-column layout: Content left, Visual right
- Centered content with container

**Example**:

```tsx
<section className="relative h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
  {/* Animated background elements */}
  <div className="absolute inset-0 -z-10 overflow-hidden">{/* Blur circles */}</div>

  <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
    <div className="grid lg:grid-cols-2 gap-8 w-full items-center">
      {/* Content */}
      {/* Visual */}
    </div>
  </div>
</section>
```

### Button Styles

#### Primary Button

```tsx
<Button size="lg" className="text-lg px-8 h-14 shadow-lg hover:shadow-xl transition-shadow">
  {text}
</Button>
```

**Variants**:

- **Default**: `bg-primary text-primary-foreground hover:bg-primary/90`
- **Secondary**: `bg-secondary text-secondary-foreground hover:bg-secondary/80`
- **Outline**: `border border-input bg-background hover:bg-accent`
- **Ghost**: `hover:bg-accent hover:text-accent-foreground`
- **Destructive**: `bg-destructive text-destructive-foreground`

**Sizes**:

- **sm**: `h-9 px-3`
- **default**: `h-10 px-4`
- **lg**: `h-11 px-8` or `h-14 px-8` (hero CTAs)

#### Button with Glow

```tsx
<Button size="lg" className="text-lg px-8 py-6 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
  {text}
</Button>
```

### Card Styles

#### Standard Card

```tsx
<Card className="rounded-2xl border border-border shadow-lg p-5">
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>
```

#### Interactive Card (Hover)

```tsx
<Card className="h-full cursor-pointer transition-all hover:shadow-2xl">
  <motion.div whileHover={{ scale: 1.05, y: -5 }}>{/* Content */}</motion.div>
</Card>
```

#### Dark Gradient Card

```tsx
<div className="rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 shadow-2xl">
  {/* Content */}
</div>
```

### Badge/Chip Styles

#### Standard Badge

```tsx
<Badge variant="default">{label}</Badge>
```

**Variants**:

- **default**: `bg-primary text-primary-foreground`
- **secondary**: `bg-secondary text-secondary-foreground`
- **outline**: `border text-foreground`
- **destructive**: `bg-destructive text-destructive-foreground`

#### Platform Badge (with icon)

```tsx
<div className="inline-block px-3 py-1 rounded-full bg-gray-800/50 text-xs font-semibold text-gray-300">
  <Icon className="w-3 h-3 inline mr-1" />
  {label}
</div>
```

### Section Patterns

#### Standard Section

```tsx
<section className="container mx-auto px-4 py-16 md:py-24">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="text-center mb-12"
  >
    <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
  </motion.div>

  {/* Content */}
</section>
```

---

## Animations

### Animation Principles

- **Smooth & Subtle**: Transitions should feel natural
- **Purposeful**: Animations guide attention and provide feedback
- **Performance**: Use `transform` and `opacity` for GPU acceleration

### Common Animations

#### Fade In (On Scroll)

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  {content}
</motion.div>
```

#### Stagger Children

```tsx
<motion.div
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }}
  initial="hidden"
  whileInView="visible"
>
  {children}
</motion.div>
```

#### Hover Scale

```tsx
<motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }}>
  {content}
</motion.div>
```

#### Background Blur Animation

```tsx
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    opacity: [0.1, 0.15, 0.1],
  }}
  transition={{
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute w-80 h-80 bg-purple-500 rounded-full blur-3xl"
/>
```

### Transition Timing

- **Fast**: `150ms` - Hover states, quick feedback
- **Base**: `200ms` - Standard transitions
- **Slow**: `300ms` - Page transitions, complex animations

---

## Dark Mode

### Dark Mode Strategy

- Support both light and dark themes
- Use CSS variables for theme switching
- Maintain contrast ratios (WCAG AA minimum)
- Preserve brand colors in both modes

### Dark Mode Adjustments

- **Backgrounds**: Darker surfaces (`#0d1117`, `#161b22`)
- **Text**: Lighter foreground (`#c9d1d9`)
- **Borders**: Subtle borders (`#30363d`)
- **Cards**: Elevated dark surfaces with borders
- **Gradients**: Adjusted opacity for dark backgrounds

---

## Accessibility

### Color Contrast

- **Text on Background**: Minimum 4.5:1 (WCAG AA)
- **Large Text**: Minimum 3:1 (WCAG AA)
- **Interactive Elements**: Clear focus states

### Focus States

```css
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

### Motion

- Respect `prefers-reduced-motion`
- Provide static alternatives for animations
- Use `viewport={{ once: true }}` to prevent re-animations

---

## Implementation Notes

### Tailwind CSS Classes

All design tokens are available as Tailwind utilities:

- Colors: `bg-primary`, `text-foreground`, `border-border`
- Spacing: `p-6`, `gap-4`, `mb-12`
- Typography: `text-4xl`, `font-bold`, `leading-tight`
- Effects: `shadow-lg`, `rounded-2xl`, `backdrop-blur-sm`

### CSS Variables

Design tokens are defined in `globals.css` as CSS variables:

- `--background`, `--foreground`, `--primary`, etc.
- `--radius` for border radius
- `--font-display` for typography

### Component Library

Use shadcn/ui components as base, styled according to these guidelines:

- `Button`, `Card`, `Badge`, `Input`, etc.
- Customize with brand colors and spacing
- Maintain component API compatibility

---

## Usage Examples

### Hero Section

```tsx
<section className="relative h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
  <div className="container mx-auto px-4">
    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
      <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text text-transparent">
        Create Your Profile
      </span>
    </h1>
    <Button size="lg" className="mt-8 shadow-lg">
      Get Started
    </Button>
  </div>
</section>
```

### Feature Card

```tsx
<Card className="rounded-2xl border shadow-lg hover:shadow-2xl transition-shadow">
  <CardHeader>
    <CardTitle>Feature Name</CardTitle>
    <CardDescription>Feature description</CardDescription>
  </CardHeader>
</Card>
```

### Platform Badge

```tsx
<Badge variant="secondary" className="rounded-full px-3 py-1">
  <Icon className="w-3 h-3 mr-1" />
  GitHub
</Badge>
```

---

## Brand Assets

### Logo

- **Primary**: WeebProfile wordmark with mascot
- **Icon**: "W" in gradient circle (purple to pink)
- **Usage**: Navigation, favicon, social sharing

### Mascot

- **Design**: Simple, friendly character
- **Colors**: Purple head, Pink body
- **Usage**: Hero sections, empty states, loading states

---

## Version History

- **v1.0** (2024): Initial brand guidelines based on neon-field example

---

## Questions or Updates?

For questions about these guidelines or to propose updates, please open an issue or contact the design team.














