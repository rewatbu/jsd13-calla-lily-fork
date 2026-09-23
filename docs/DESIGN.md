# Calla Lily Design System

## Intent

Calla Lily uses a warm, editorial palette: a blush canvas, clean surfaces,
warm-brown ink, and one crimson action color. This follows the semantic-token
idea of the Claude-inspired DESIGN.md reference, but it does not adopt that
reference's typography, spacing, component shapes, or page layout.

## Non-negotiable scope

- Keep the current font stack, font size, weight, tracking, and line height.
- Keep the current layout, spacing, dimensions, responsive breakpoints, and
  component structure.
- Change colors and color-bearing shadows only through the semantic tokens in
  `src/index.css`.

## Color tokens

| Token | Value | Use |
| --- | --- | --- |
| `background` | `#FFE5DE` | Page canvas and soft brand panels |
| `surface` | `#FFFFFF` | Cards, inputs, navigation, and elevated surfaces |
| `primary` | `#9B151D` | Primary actions, prices, important links, and active states |
| `primary-hover` | `#7A1016` | Hover/pressed primary actions |
| `border` | `#E8BFB5` | Borders, dividers, and quiet secondary text on dark primary surfaces |
| `foreground` | `#3A2B25` | Headings and high-emphasis text |
| `muted-foreground` | `#9A6A5E` | Supporting text and metadata |
| `success` / `success-strong` / `success-soft` | `#15803D` / `#166534` / `#DCFCE7` | Standard text / high-emphasis text / background for positive states |
| `danger` / `danger-soft` | `#991B1B` / `#FEE2E2` | Error text / its background |

## Usage rules

Use Tailwind semantic utilities such as `bg-background`, `bg-surface`,
`text-foreground`, `text-muted-foreground`, `bg-primary`, and
`border-border`. Opacity modifiers remain valid, for example
`hover:bg-primary/10` and `text-primary/70`.

Do not add new hex colors to JSX. Add a named token to `src/index.css` first,
then use that token. Status colors are semantic and must not be replaced with
the crimson brand color.

## Shadows

`shadow-brand-sm`, `shadow-brand-md`, and `shadow-button-hover` contain the
existing crimson-tinted shadow colors. They may be used only where a shadow
already exists; do not add new elevation as part of a color-only change.
