# Virima Documentation Theme System

## Overview

The Virima documentation site implements a comprehensive dark/light theme system with smooth transitions, localStorage persistence, and system preference detection.

---

## ✨ Features

✅ **Three Theme Modes**: Light, Dark, and System (auto)  
✅ **Smooth Transitions**: 0.3s ease transitions on all color changes  
✅ **Persistent Preferences**: Saves user choice to localStorage  
✅ **System Detection**: Respects OS-level `prefers-color-scheme`  
✅ **Universal Coverage**: All components adapt automatically  
✅ **WCAG AA Compliant**: Proper contrast ratios in both themes  
✅ **Professional Palettes**: Thoughtfully designed, not simple inversions  

---

## 🎨 Theme Architecture

### CSS Variables System

All colors use CSS custom properties (variables) for complete theme adaptation:

```css
/* Light Theme (Default) */
:root {
  --background: #FFFFFF;
  --foreground: oklch(0.08 0 0);
  --card: #FFFFFF;
  --border: rgba(0, 0, 0, 0.1);
  /* ... more variables */
}

/* Dark Theme */
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --border: oklch(0.269 0 0);
  /* ... more variables */
}
```

### Color Variables Reference

| Variable | Light Theme | Dark Theme | Usage |
|----------|------------|------------|-------|
| `--background` | #FFFFFF | oklch(0.145 0 0) | Main page background |
| `--foreground` | oklch(0.08 0 0) | oklch(0.985 0 0) | Primary text color |
| `--card` | #FFFFFF | oklch(0.145 0 0) | Card backgrounds |
| `--muted` | #ececf0 | oklch(0.269 0 0) | Muted backgrounds |
| `--border` | rgba(0, 0, 0, 0.1) | oklch(0.269 0 0) | Border colors |
| `--sidebar` | #FFFFFF | oklch(0.205 0 0) | Sidebar background |

---

## 🔧 Implementation

### Theme Provider

The `ThemeProvider` wraps the entire application:

```tsx
// App.tsx
import { ThemeProvider } from './lib/theme/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Theme Toggle Component

Located in header between "Support" and "Login":

```tsx
import { ThemeToggle } from './components/ThemeToggle';

<ThemeToggle />
```

**Features**:
- Moon icon for dark mode
- Sun icon for light mode
- Dropdown with Light/Dark/System options
- Checkmark indicates active selection
- Smooth icon rotation transitions

---

## 🎯 Usage

### For Developers

#### Using Theme in Components

```tsx
import { useTheme } from '../lib/theme/theme-provider';

function MyComponent() {
  const { theme, actualTheme, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme preference: {theme}</p>
      <p>Actual theme applied: {actualTheme}</p>
      
      <button onClick={() => setTheme('dark')}>
        Switch to Dark
      </button>
    </div>
  );
}
```

#### CSS Classes with Dark Mode

Use Tailwind's `dark:` prefix for dark mode styles:

```tsx
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  Content that adapts to theme
</div>
```

#### Using CSS Variables

```tsx
<div style={{ backgroundColor: 'var(--background)' }}>
  Uses theme variable directly
</div>
```

---

### For Users

**Accessing Theme Toggle**:
1. Look for the sun/moon icon in the header
2. Located between "Support" and "Login" buttons
3. Click to open theme selection menu

**Theme Options**:
- **Light**: Bright, clean white background
- **Dark**: Professional dark background with reduced eye strain
- **System**: Automatically matches your device settings

**Preference Persistence**:
- Your choice is saved automatically
- Persists across browser sessions
- Syncs across tabs (same browser)

---

## 🌓 Theme Transitions

### Smooth Animations

All theme changes include smooth 0.3s transitions:

```css
*,
*::before,
*::after {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: ease;
  transition-duration: 0.3s;
}
```

**Affected Properties**:
- Background colors
- Border colors
- Text colors
- SVG fill/stroke
- Shadow colors

---

## 📋 Component Coverage

### Fully Themed Components

✅ **Header**: Background, borders, text, buttons  
✅ **Sidebar**: Background, navigation items, borders  
✅ **Content Area**: Backgrounds, text, code blocks  
✅ **Tables**: Headers, rows, borders (Virima green maintained)  
✅ **Cards**: Backgrounds, borders, shadows  
✅ **Inputs**: Backgrounds, borders, focus states  
✅ **Buttons**: All variants adapt to theme  
✅ **Modals/Dialogs**: Backgrounds, overlays  
✅ **Search**: Dialog, results, inputs  
✅ **Chat**: Panel, messages, input  
✅ **Code Blocks**: Syntax highlighting adapts  
✅ **Images**: Borders adjust for theme  

---

## 🎨 Design Principles

### Light Theme
- **Background**: Pure white (#FFFFFF)
- **Primary Text**: Near black with slight warmth
- **Borders**: Subtle gray with transparency
- **Shadows**: Light with low opacity
- **Accent**: Virima green (#2E7D32)

### Dark Theme
- **Background**: Deep charcoal (oklch 0.145)
- **Primary Text**: Off-white (oklch 0.985)
- **Borders**: Medium gray (oklch 0.269)
- **Shadows**: Darker with higher opacity
- **Accent**: Maintained Virima green (slightly brighter)

### Contrast Ratios

All text meets WCAG AA standards:
- **Large Text**: 3:1 minimum
- **Normal Text**: 4.5:1 minimum
- **UI Components**: 3:1 minimum

---

## 💾 LocalStorage Schema

Theme preference is stored as:

```javascript
// Key
'virima-docs-theme'

// Values
'light'   // Light mode
'dark'    // Dark mode
'system'  // Follow OS preference
```

**Retrieval Logic**:
1. Check localStorage for saved preference
2. If 'system', detect OS preference via `prefers-color-scheme`
3. Default to 'system' if no saved preference
4. Apply resolved theme to `<html>` class

---

## 🔍 System Preference Detection

### Media Query Listener

```typescript
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

mediaQuery.addEventListener('change', (e) => {
  if (theme === 'system') {
    const resolved = e.matches ? 'dark' : 'light';
    // Apply theme
  }
});
```

**Behavior**:
- Only active when theme is set to 'system'
- Listens for OS-level theme changes
- Updates immediately when OS preference changes
- No page reload required

---

## 🛠️ Customization

### Adding New Theme Variables

1. **Define in globals.css**:

```css
:root {
  --my-custom-color: #hexvalue;
}

.dark {
  --my-custom-color: #darkvalue;
}
```

2. **Add to Tailwind theme**:

```css
@theme inline {
  --color-custom: var(--my-custom-color);
}
```

3. **Use in components**:

```tsx
<div className="bg-[var(--my-custom-color)]">
  Custom themed element
</div>
```

### Creating Custom Theme Variants

To add a third theme (e.g., "High Contrast"):

1. Create new CSS class:

```css
.high-contrast {
  --background: #000000;
  --foreground: #FFFFFF;
  /* ... other high contrast values */
}
```

2. Update theme type:

```typescript
type Theme = 'light' | 'dark' | 'system' | 'high-contrast';
```

3. Add to ThemeToggle dropdown

---

## 🐛 Troubleshooting

### Issue: Theme Not Persisting

**Solution**: Check localStorage access
```javascript
// Test in browser console
localStorage.setItem('test', 'value');
localStorage.getItem('test'); // Should return 'value'
```

### Issue: Transition Flash on Load

**Solution**: Add `no-transition` class temporarily
```typescript
// On initial load
document.documentElement.classList.add('no-transition');
// Apply theme
setTimeout(() => {
  document.documentElement.classList.remove('no-transition');
}, 50);
```

### Issue: Component Not Adapting

**Check**:
1. Using CSS variables? (`var(--variable)`)
2. Using `dark:` prefix for Tailwind classes?
3. Component wrapped in ThemeProvider?

**Fix**:
```tsx
// ❌ Wrong
<div className="bg-white text-black">

// ✅ Correct
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
```

### Issue: System Theme Not Detecting

**Solution**: Check browser support
```javascript
// Check if prefers-color-scheme is supported
if (window.matchMedia('(prefers-color-scheme: dark)').media !== 'not all') {
  console.log('System preference detection supported');
}
```

---

## 📊 Performance

### Optimization Techniques

**CSS Variables**: 
- Single source of truth
- No JavaScript color calculations
- GPU-accelerated transitions

**Memoization**:
- Theme context memoized with React Context
- Prevents unnecessary re-renders

**Lazy Loading**:
- Theme applied immediately on load
- No flash of unstyled content (FOUC)

**Bundle Size**:
- ThemeProvider: ~2KB minified
- ThemeToggle: ~1KB minified
- CSS variables: 0 runtime cost

---

## ✅ Testing Checklist

### Manual Testing

- [ ] Toggle between Light/Dark/System modes
- [ ] Verify localStorage persistence (refresh page)
- [ ] Check all components adapt correctly
- [ ] Test smooth transitions (no flashing)
- [ ] Verify contrast ratios (accessibility)
- [ ] Test with OS dark mode on/off
- [ ] Check mobile responsiveness
- [ ] Verify Virima green consistency

### Automated Testing

```typescript
describe('Theme System', () => {
  it('should persist theme to localStorage', () => {
    setTheme('dark');
    expect(localStorage.getItem('virima-docs-theme')).toBe('dark');
  });

  it('should apply correct class to html element', () => {
    setTheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
```

---

## 🎯 Best Practices

### DO ✅

- Use CSS variables for all colors
- Add `dark:` variants to custom components
- Test in both themes during development
- Use semantic color names (e.g., `--foreground` not `--text-black`)
- Maintain WCAG AA contrast ratios
- Provide smooth transitions (0.3s)

### DON'T ❌

- Hardcode color values (use variables)
- Forget `dark:` variants on new components
- Use pure black (#000000) or pure white (#FFFFFF) for text
- Create jarring instant theme changes
- Invert colors 1:1 between themes
- Ignore system preferences

---

## 📚 Related Documentation

- [Branded Table Guide](/docs/BRANDED-TABLE-GUIDE.md)
- [Component Library](/docs/COMPONENT-GUIDE.md)
- [CSS Variables Reference](/styles/globals.css)
- [Accessibility Standards](/docs/ACCESSIBILITY.md)

---

## 🔗 External Resources

- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [prefers-color-scheme MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)

---

**Last Updated**: December 2025  
**Theme System Version**: 1.0  
**Maintained By**: Virima Documentation Team
