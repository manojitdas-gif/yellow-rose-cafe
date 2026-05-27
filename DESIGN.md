---
name: Yellow Rose Cafe
colors:
  surface: '#fbfaee'
  surface-dim: '#dbdbcf'
  surface-bright: '#fbfaee'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f4e8'
  surface-container: '#efeee3'
  surface-container-high: '#e9e9dd'
  surface-container-highest: '#e4e3d7'
  on-surface: '#1b1c15'
  on-surface-variant: '#4f4634'
  inverse-surface: '#303129'
  inverse-on-surface: '#f2f1e5'
  outline: '#817662'
  outline-variant: '#d3c5ae'
  surface-tint: '#795900'
  primary: '#795900'
  on-primary: '#ffffff'
  primary-container: '#daa520'
  on-primary-container: '#553d00'
  inverse-primary: '#f6be3b'
  secondary: '#60603e'
  on-secondary: '#ffffff'
  secondary-container: '#e6e5b9'
  on-secondary-container: '#666643'
  tertiary: '#705a4c'
  on-tertiary: '#ffffff'
  tertiary-container: '#c4a897'
  on-tertiary-container: '#513d30'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdea0'
  primary-fixed-dim: '#f6be3b'
  on-primary-fixed: '#261900'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#e6e5b9'
  secondary-fixed-dim: '#cac99f'
  on-secondary-fixed: '#1d1d03'
  on-secondary-fixed-variant: '#484828'
  tertiary-fixed: '#fbddca'
  tertiary-fixed-dim: '#dec1af'
  on-tertiary-fixed: '#28180d'
  on-tertiary-fixed-variant: '#574335'
  background: '#fbfaee'
  on-background: '#1b1c15'
  surface-variant: '#e4e3d7'
typography:
  display-lg:
    fontFamily: domine
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: domine
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: domine
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: domine
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: workSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: workSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: workSans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: workSans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style
The design system for the Yellow Rose Cafe is built on the concept of "Refined Heritage." It bridges the gap between the nostalgic, high-energy atmosphere of a mid-century American diner and the modern, high-quality standards of Chicago’s contemporary culinary scene. The aesthetic is **Tactile and Corporate-Modern**, utilizing physical metaphors like paper textures and dark wood surfaces while maintaining the rigorous structure of a professional digital platform.

The UI should evoke a sense of warmth, reliability, and local authenticity. It avoids "kitschy" retro tropes in favor of a sophisticated, timeless execution that signals to the user that while the cafe honors the past, its service and quality are state-of-the-art.

## Colors
The palette is rooted in the warmth of a sunlit breakfast room and the rich materials of a classic diner counter.

*   **Primary (Goldenrod):** Used for calls to action, high-visibility banners, and brand accents. It provides the "sunny" disposition of the cafe.
*   **Secondary (Cream/Ivory):** The primary surface color. It reduces harsh glares compared to pure white, providing a "paper-like" feel for menus.
*   **Tertiary (Dark Walnut/Espresso):** Used for primary typography and structural elements (dividers, footers). It provides the grounding weight of dark wood furniture.
*   **Neutral (Off-White/Parchment):** Used for subtle layering and background variations to maintain a soft, approachable contrast.

## Typography
The typography strategy utilizes a "High-Contrast Pairing" to establish authority and legibility.

*   **Domine (Headings):** A sturdy, classic slab-serif that evokes vintage newsprint and hand-painted diner signage. It carries the "old school" weight of the brand.
*   **Work Sans (Body & UI):** A grounded, professional sans-serif chosen for its exceptional readability in dense menu layouts. 

For SEO and accessibility, all headings must follow a strict semantic hierarchy (H1-H4). Large display sizes should be reserved for hero sections and major menu categories.

## Layout & Spacing
This design system employs a **12-column fixed-center grid** for desktop and a **fluid 4-column grid** for mobile devices. 

*   **The Masonry Logic:** Photography of food and the cafe interior should be arranged in a masonry grid to mimic a physical bulletin board or a curated scrapbook.
*   **Content Reflow:** On mobile, masonry items stack into a single column, but maintain the staggered height characteristic to keep the visual rhythm energetic.
*   **Menu Grids:** Interactive menu cards should span 4 columns on desktop (3-up) and full width on mobile.

## Elevation & Depth
Depth is conveyed through **Tonal Layering and Soft Ambient Shadows**, simulating the way physical menus sit on a wooden table.

1.  **Level 0 (Base):** The Cream/Ivory background.
2.  **Level 1 (Cards/Menus):** Slight elevation using a very soft, diffused shadow (`0px 4px 20px rgba(61, 43, 31, 0.08)`) to lift items off the background.
3.  **Level 2 (Interaction/Hover):** Increased shadow depth to indicate interactivity.
4.  **Banners:** The "Cash Only" banners should use a flat, high-contrast primary color background with no shadow, appearing as if they are "taped" or "bolted" to the UI, ensuring maximum visibility.

## Shapes
The shape language is **Soft and Structural**. A 0.25rem (4px) base radius is applied to most UI elements to soften the "Old School" rigidity without becoming overly playful or childish.

*   **Buttons & Inputs:** Use the base `rounded` (4px).
*   **Menu Cards:** Use `rounded-lg` (8px) to distinguish them as primary interactive containers.
*   **Image Containers:** Images within the masonry grid should maintain sharp or very slightly rounded corners to feel like physical photographs.

## Components

### Interactive Menu Cards
Cards feature a `Domine` heading for the dish name, a price floating to the top-right, and a description in `Work Sans`. Upon interaction, cards can expand to show nutritional info or "Schema-ready" ingredient lists.

### High-Visibility Banners
The "Cash Only" banner uses the Primary Goldenrod color with `Label-Bold` typography. It should be pinned to the top of the viewport or placed prominently at the start of the menu flow.

### Buttons
*   **Primary:** Solid Tertiary (Dark Walnut) with Primary (Goldenrod) text. This provides a high-contrast, premium feel.
*   **Secondary:** Outlined Tertiary with a slight Ivory fill.

### Input Fields
Inputs use a "Schoolhouse" aesthetic: a simple bottom border or a very light Tertiary stroke, with `Work Sans` for placeholder text.

### Chips & Tags
Used for dietary markers (e.g., "GF", "Vegan"). These should be styled as "stamps"—using thin borders and all-caps `Work Sans` to look like a physical ink stamp on a menu.

### Lists
Menu lists should utilize a "dot leader" (e.g., Pancakes . . . . $12) to reinforce the classic diner aesthetic while maintaining horizontal scanning ease.