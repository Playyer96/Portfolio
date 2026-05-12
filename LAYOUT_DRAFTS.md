# Project Detail Layouts — Shell Integration

## Current Shell Structure
```
┌──────────────────────────────────────────────────────────┐
│ Left Sidebar (Nav)  │  Main Content      │ Right Panel   │
│ - Home              │  (Routes here)     │ (Inspector)   │
│ - Projects          │                    │               │
│ - About             │                    │               │
│ - Experience        │                    │               │
│ - Contact           │                    │               │
├─────────────────────┴────────────────────┴───────────────┤
│ Bottom Profiler / Assets Bar                              │
└───────────────────────────────────────────────────────────┘
```

---

## OPTION 1: Inspector Detail View ⭐
**Best for editor aesthetic + context awareness**

### Normal Grid View
```
┌──────────────┬────────────────────────────┬─────────────┐
│ Left Nav     │ Main: Projects Grid        │ Inspector   │
│ - Projects   │ ┌─────┬─────┬─────────┐   │ (Empty)     │
│   (active)   │ │ P1  │ P2  │ P3      │   │             │
│ - About      │ ├─────┼─────┼─────────┤   │             │
│ - ...        │ │ P4  │ P5  │ P6      │   │             │
│              │ ├─────┼─────┼─────────┤   │             │
│              │ │ P7  │ P8  │         │   │             │
│              │ └─────┴─────┴─────────┘   │             │
│              │                            │             │
└──────────────┴────────────────────────────┴─────────────┘
```

### After Clicking P3
```
┌──────────────┬────────────────────────────┬─────────────┐
│ Left Nav     │ Main: Projects Grid        │ Inspector   │
│ - Projects   │ ┌─────┬─────┬─────────┐   │ P3          │
│   (active)   │ │ P1  │ P2  │ P3(sel) │   │ ─────────── │
│ - About      │ ├─────┼─────┼─────────┤   │             │
│ - ...        │ │ P4  │ P5  │ P6      │   │ [Image 1]   │
│              │ ├─────┼─────┼─────────┤   │ ‹ 1/4 ›     │
│              │ │ P7  │ P8  │         │   │             │
│              │ └─────┴─────┴─────────┘   │ Tech:       │
│              │                            │ • React     │
│              │                            │ • Node      │
│              │                            │ • Vite      │
│              │ Prev/Next project nav ←→  │             │
│              │                            │ Work:       │
│              │                            │ › Built...  │
│              │                            │ › Optimized │
│              │                            │             │
└──────────────┴────────────────────────────┴─────────────┘
```

**Pros:**
- Grid stays visible (browse while viewing details)
- Inspector shows full project metadata
- Image carousel in main area or inspector
- Matches editor aesthetic perfectly
- No disruptive overlay

**Cons:**
- Images small if in inspector
- Splitting attention across screen

---

## OPTION 2: Inline Card Expansion
**Best for minimal disruption**

### Normal Grid View
```
┌──────────────┬────────────────────────────┬─────────────┐
│ Left Nav     │ Main: Projects Grid        │ Inspector   │
│ - Projects   │ ┌─────┬─────┬─────────┐   │ (Empty)     │
│   (active)   │ │ P1  │ P2  │ P3      │   │             │
│ - About      │ ├─────┼─────┼─────────┤   │             │
│ - ...        │ │ P4  │ P5  │ P6      │   │             │
│              │ ├─────┼─────┼─────────┤   │             │
│              │ │ P7  │ P8  │         │   │             │
│              │ └─────┴─────┴─────────┘   │             │
│              │                            │             │
└──────────────┴────────────────────────────┴─────────────┘
```

### After Clicking P3
```
┌──────────────┬────────────────────────────┬─────────────┐
│ Left Nav     │ Main: Projects Grid        │ Inspector   │
│ - Projects   │ ┌─────┬─────┬─────────┐   │ (Empty)     │
│   (active)   │ │ P1  │ P2  │ P3(sel) │   │             │
│ - About      │ ├─────┼─────┼─────────┤   │             │
│ - ...        │ │ P4  │ P5  │ P6      │   │             │
│              │ ├─────┴─────┴─────────┤   │             │
│              │ │ P3 EXPANDED         │   │             │
│              │ │ [Image Carousel ⟵⟶] │   │             │
│              │ │ Tech: React, Node.. │   │             │
│              │ │ Work: › Built...    │   │             │
│              │ │       › Optimized.. │   │             │
│              │ └─────────────────────┤   │             │
│              │ │ P7  │ P8  │         │   │             │
│              │ └─────┴─────┴─────────┘   │             │
│              │                            │             │
└──────────────┴────────────────────────────┴─────────────┘
```

**Pros:**
- Card stays in context (no grid loss)
- Details + images in one expanded view
- Other cards reflow naturally
- Can animate smoothly
- Feels less disruptive

**Cons:**
- Images still somewhat small
- Vertical scrolling needed if lots of content
- Grid changes size (reflow might feel jarring)

---

## OPTION 3: Split Panel Layout
**Best for immersive image viewing**

### Normal Grid View
```
┌──────────────┬────────────────────────────┬─────────────┐
│ Left Nav     │ Main: Projects Grid        │ Inspector   │
│ - Projects   │ ┌─────┬─────┬─────────┐   │ (Empty)     │
│   (active)   │ │ P1  │ P2  │ P3      │   │             │
│ - About      │ ├─────┼─────┼─────────┤   │             │
│ - ...        │ │ P4  │ P5  │ P6      │   │             │
│              │ ├─────┼─────┼─────────┤   │             │
│              │ │ P7  │ P8  │         │   │             │
│              │ └─────┴─────┴─────────┘   │             │
│              │                            │             │
└──────────────┴────────────────────────────┴─────────────┘
```

### After Clicking P3
```
┌──────────────┬──────────────────┬──────────────────┐
│ Left Nav     │ Main: Large Image │ Inspector: P3    │
│ - Projects   │                  │ ─────────────── │
│   (active)   │    [Image 1]     │                 │
│ - About      │   ‹ 1/4 ›        │ Tech:           │
│ - ...        │                  │ • React         │
│              │ Grid (dimmed):   │ • Node          │
│              │ ┌────┬────┐      │ • Vite          │
│              │ │P1  │P2  │      │ • WebGL         │
│              │ ├────┼────┤      │ • Three.js      │
│              │ │P4  │P5  │      │                 │
│              │ ├────┼────┤      │ Responsibilities│
│              │ │P7  │P8  │      │ › Built complex │
│              │ └────┴────┘      │   architecture  │
│              │                  │ › Optimized     │
│              │ ← → Nav projects │   rendering     │
│              │                  │ › Implemented   │
│              │                  │   features      │
└──────────────┴──────────────────┴──────────────────┘
```

**Pros:**
- Images huge + immersive
- Full details visible in inspector
- Grid visible (but dimmed) for context
- Most professional layout
- Clear information hierarchy

**Cons:**
- More space used
- Inspector needs to be wider
- Grid gets small/dimmed

---

## Comparison Table

| Aspect | Option 1 | Option 2 | Option 3 |
|--------|----------|----------|----------|
| **Grid visibility** | ✓ Full | ✓ Reflows | ✓ Dimmed |
| **Image size** | Small | Medium | Large |
| **Details visibility** | Inspector | Expanded | Inspector |
| **Editor aesthetic match** | Excellent | Good | Excellent |
| **Disruption level** | Low | Medium | High |
| **Immersion** | Medium | Medium | High |
| **Multi-card browsing** | Easy | Medium | Harder |
| **Mobile friendly** | Yes | Yes | No |

---

## Recommendation

**Option 1** for your portfolio because:
- Matches existing inspector pattern perfectly
- Grid stays visible for fast project browsing
- Minimal disruption to editor aesthetic
- Users can compare projects side-by-side
- Clean separation: grid + metadata + images

**Fallback to Option 3** if you want more immersive image showcase.

Which appeals most?
