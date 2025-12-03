# Virima Branded Table & Image Styling Guide

## Overview

All tables in the Virima documentation automatically feature branded styling with responsive behavior. Images display with consistent thin borders for visual definition.

---

## ✅ Table Features

### Automatic Styling
- **Virima Green Headers**: Brand color (#2E7D32) with white text
- **Responsive Behavior**: Horizontal scroll for wide tables
- **Sticky Headers**: Headers remain visible while scrolling
- **Hover Effects**: Row highlighting on hover
- **Mobile Optimized**: Responsive font sizes and padding

### Table Requirements Met

| Requirement | Implementation | Status |
|------------|----------------|--------|
| Branded Headers | Virima green gradient (#2E7D32) | ✅ Complete |
| Responsive Tables | Horizontal scroll + sticky headers | ✅ Complete |
| Many Rows Support | Sticky header while scrolling | ✅ Complete |
| Many Columns | Horizontal scroll container | ✅ Complete |
| Consistent Styling | Global CSS classes applied | ✅ Complete |
| Dark Mode | Auto-adjusted colors | ✅ Complete |

---

## 📊 Using Tables in MDX

### Standard Markdown Tables (Automatic Styling)

All markdown tables automatically receive Virima branding:

```mdx
| ICON | DESCRIPTION |
|------|-------------|
| Inbox [n] | Displays the number of unread Inbox messages. When clicked, the window updates and displays all messages—both read and unread. |
| Chat | Opens a chat window through which communication can occur between users. The Chat server must be running for this option to be enabled. |
| Cart [n] | Displays the number of items in the cart. When clicked, the window updates and displays the list of items. Refer to Self-Service: Service Catalog for more information on adding items to the cart. |
```

**Result**: Virima green header with white text, responsive container, hover effects

---

### Advanced: React Component Tables

For complex tables with special features:

```tsx
import { BrandedTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/branded-table';

<BrandedTable stickyHeader stickyFirstColumn maxHeight="400px">
  <TableHeader>
    <TableRow>
      <TableHead>Feature</TableHead>
      <TableHead>Specification</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Header Color</TableCell>
      <TableCell>Virima Green (#2E7D32)</TableCell>
      <TableCell>✅ Active</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>Responsive</TableCell>
      <TableCell>Horizontal scroll</TableCell>
      <TableCell>✅ Active</TableCell>
    </TableRow>
  </TableBody>
</BrandedTable>
```

**Props**:
- `stickyHeader` (boolean): Keep header visible while scrolling (default: true)
- `stickyFirstColumn` (boolean): Pin first column for wide tables (default: false)
- `maxHeight` (string): Maximum height before scrolling (default: "600px")

---

### Simple Wrapper for MDX

For MDX content, use the `VirimaTable` wrapper:

```mdx
import { VirimaTable } from '../components/ui/branded-table';

<VirimaTable>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
      <th>Column 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
      <td>Data 3</td>
    </tr>
  </tbody>
</VirimaTable>
```

---

## 🖼️ Image Display Standards

### Automatic Image Styling

All images in documentation automatically receive:
- **Thin Border**: 1px solid #D0D0D0 (light neutral gray)
- **Rounded Corners**: 0.375rem border radius
- **Subtle Shadow**: Soft drop shadow for depth
- **Responsive**: max-width 100%, auto height
- **Dark Mode Support**: Border adjusts to #4B5563

### Using Images in MDX

```mdx
![Cost Center Parent](path/to/image.png)
```

**Result**: Image with 1px border, rounded corners, responsive sizing

### Image with Alt Text (for broken images)

```mdx
![Cost Center Parent - Icon and Description Table](path/to/image.png)
```

If the image fails to load, the alt text displays instead of a broken icon.

---

## 🎨 Styling Specifications

### Table Header Colors

```css
/* Light Mode */
background: linear-gradient(135deg, #2E7D32 0%, #388E3C 100%);
color: #FFFFFF;
font-weight: 600;

/* Dark Mode */
background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%);
color: #FFFFFF;
```

### Table Body

```css
/* Row Hover */
background-color: #F1F8E9; /* Light green tint */

/* Cell Styling */
padding: 0.75rem 1rem;
font-size: 0.875rem;
color: #1F2937;
```

### Image Borders

```css
/* Light Mode */
border: 1px solid #D0D0D0;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

/* Dark Mode */
border: 1px solid #4B5563;
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
```

---

## 📱 Responsive Behavior

### Tables

**Desktop** (>640px):
- Full padding and font sizes
- Horizontal scroll for wide tables
- Sticky headers enabled

**Mobile** (≤640px):
- Reduced font sizes (0.75rem headers, 0.8125rem cells)
- Reduced padding (0.625rem)
- Maintains horizontal scroll
- Sticky headers still active

### Images

**All Devices**:
- max-width: 100%
- height: auto
- Maintains aspect ratio
- Responsive container

---

## 🔧 Customization

### Override Table Styling

If you need custom colors for a specific table:

```tsx
<table className="custom-table">
  <!-- Your content -->
</table>

<style>
.custom-table thead {
  background: linear-gradient(135deg, #1976D2 0%, #2196F3 100%); /* Blue */
}
</style>
```

### Override Image Border

```mdx
<img src="..." alt="..." style="border: 2px solid #2E7D32;" />
```

---

## ✨ Best Practices

### Tables

1. **Keep Headers Concise**: Use short, clear column names
2. **Consistent Column Width**: Avoid extremely wide columns
3. **Use Hover States**: Leverage built-in hover highlighting
4. **Mobile-First**: Test tables on mobile devices
5. **Data Density**: Don't overcrowd cells with too much text

### Images

1. **Descriptive Alt Text**: Always provide meaningful alt text
2. **Optimized File Size**: Use compressed images for faster loading
3. **Consistent Aspect Ratios**: Maintain visual harmony
4. **Relevant Context**: Place images near related content
5. **Loading Optimization**: Images lazy-load automatically

---

## 🐛 Troubleshooting

### Table Not Styled

**Issue**: Table appears unstyled with no green header

**Solution**: Ensure table is inside MDX content or wrapped with `<VirimaTable>`

```mdx
<!-- ❌ Wrong - Outside MDX renderer -->
<table>...</table>

<!-- ✅ Correct - Inside MDX content or wrapped -->
<VirimaTable>
  <table>...</table>
</VirimaTable>
```

### Image Border Missing

**Issue**: Image has no border

**Solution**: Ensure image is inside `.prose`, `.mdx-content`, or `article` element

```tsx
<!-- ❌ Wrong - Outside content container -->
<img src="..." />

<!-- ✅ Correct - Inside content container -->
<article>
  <img src="..." />
</article>
```

### Horizontal Scroll Not Working

**Issue**: Wide table breaks layout instead of scrolling

**Solution**: Ensure table is wrapped in `.virima-table-container`

```mdx
<!-- Automatically wrapped in MDX -->
| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 |
|----------|----------|----------|----------|----------|
| Data     | Data     | Data     | Data     | Data     |
```

---

## 📚 Examples

### Complex Feature Table

| Feature | Desktop | Tablet | Mobile | Notes |
|---------|---------|--------|--------|-------|
| Sticky Headers | ✅ Yes | ✅ Yes | ✅ Yes | Always enabled |
| Horizontal Scroll | ✅ Yes | ✅ Yes | ✅ Yes | For wide tables |
| Sticky First Column | ⚙️ Optional | ⚙️ Optional | ❌ No | Only when enabled |
| Hover Effects | ✅ Yes | ✅ Yes | ⚠️ Tap | Touch shows briefly |
| Row Highlighting | ✅ Yes | ✅ Yes | ✅ Yes | Green tint #F1F8E9 |

### Icon Description Table (from screenshot)

| ICON | DESCRIPTION |
|------|-------------|
| Inbox [n] | Displays the number of unread Inbox messages. When clicked, the window updates and displays all messages—both read and unread. |
| Chat | Opens a chat window through which communication can occur between users. The Chat server must be running for this option to be enabled. |
| Cart [n] | Displays the number of items in the cart. When clicked, the window updates and displays the list of items. Refer to Self-Service: Service Catalog for more information on adding items to the cart. |
| Suggestions | Allows the user to submit suggestions or provide feedback. |

---

## 🎯 Summary

**Tables**: Automatically branded with Virima green headers (#2E7D32), white text, responsive horizontal scroll, sticky headers, and hover effects.

**Images**: Automatically display with 1px light gray border (#D0D0D0), rounded corners, subtle shadow, and responsive sizing.

**No Additional Work Required**: All styling is automatic for standard Markdown/MDX content.

**Advanced Features Available**: Use `BrandedTable` component for sticky columns and custom max heights.

---

## 📞 Support

For issues with table or image styling:

1. Check this guide first
2. Verify content is inside proper containers
3. Test in both light and dark modes
4. Review browser console for errors
5. Contact development team for persistent issues

---

**Last Updated**: December 2025  
**Virima Documentation Team**
