# Portfolio Redesign Plan

## Aesthetic Direction
**Modern Tech Minimalism** with refined dark theme:
- Clean, sophisticated, less "neon overload"
- Typography-driven design
- Refined spacing and whitespace
- Selective accent colors (not everything glowing)
- Smooth, purposeful animations
- Mobile-first responsive approach

## Priority Implementation Order

### Phase 1: High-Impact Visual Changes (Quick Wins)
1. **Tech Stack Redesign** - Reduce bulk, more compact display
   - Change from large 140-160px cards to inline tag/pill design
   - Use horizontal layout or more compact grid
   - Remove glow effects, keep minimal styling
   - Update TechStack.js and TechStack.scss

2. **CV Resume Changes**
   - Auto-preview PDF by default (no toggle button)
   - Remove "Hide Preview" button
   - Update Cv.js component

3. **Content Updates**
   - Change "five years plus" → "seven" everywhere
   - Audit all pages for consistency

### Phase 2: Spacing & Layout Fixes
4. **Spacing Audit**
   - Review and standardize spacing throughout
   - Fix excessive gaps in sections
   - Improve visual hierarchy

5. **Footer Redesign**
   - Modernize footer styling
   - Better organization of links/info
   - Improve mobile display

6. **Project Filtering Layout**
   - Fix button click reorganization
   - Ensure proper grid reflow
   - Smooth animations

### Phase 3: Mobile Responsiveness
7. **Mobile Overhaul**
   - Fix menu opening issues
   - Reduce oversized elements
   - Improve spacing on small screens
   - Test all breakpoints

### Phase 4: SEO & Final Polish
8. **SEO Improvements**
   - Update meta tags
   - Improve heading hierarchy
   - Add rich snippets
   - Optimize for Google ranking

## Files to Modify

**High Priority:**
- src/components/TechStack.js / TechStack.scss - Complete redesign
- src/pages/Cv.js - Auto-preview
- src/components/Footer.js / Footer.scss - Redesign
- src/pages/Projects.js - Filtering/layout
- All SCSS files - Spacing audit

**Medium Priority:**
- src/styles/scss/_variables.scss - Color/spacing tweaks
- src/components/Navbar.scss - Mobile menu
- src/pages/Home.js - Overall flow
- src/pages/AboutDisplay.js / Projects.js / Experience.js

**SEO:**
- src/components/SEO.js
- src/App.js
- All page meta tags

## Success Criteria
✓ Tech stack is compact and modern, not bulky
✓ Resume previews automatically without button
✓ Consistent spacing throughout
✓ Footer is attractive and functional
✓ Project filtering reorganizes layout smoothly
✓ Mobile layout is responsive and clean
✓ All "five years" changed to "seven"
✓ SEO improvements in place
✓ Visual design feels premium and intentional
