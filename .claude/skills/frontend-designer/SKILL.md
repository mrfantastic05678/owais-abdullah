---
name: frontend-architect
description: Create distinctive, production-grade frontend interfaces with high design quality and advanced animation choreography. Use this skill when the user asks to build web components, pages, or applications.
category: frontend
version: 1.1.0
---

This skill guides the creation of distinctive, production-grade frontend interfaces. It mandates **Animation-First Design**, **Separation of Concerns**, and the use of **Model Context Protocol (MCP)** tools to eliminate hallucinations.

## Phase 0: Knowledge Retrieval (MCP MANDATE)

**STOP.** Do not guess API syntax. Before planning, you MUST check if you have access to the following MCP tools. If available, use them:

1.  **Use `shadcn` MCP:**
    - **Action:** Browsing/Installing components.
    - **Why:** Never manually write a shadcn component (like `Button` or `Card`) from memory. Always fetch the latest registry version to ensure correct Tailwind utility classes and ARIA attributes.
2.  **Use `motion` MCP (motion.dev):**
    - **Action:** searching docs for `AnimatePresence`, `layout` props, or `useRef` constraints.
    - **Why:** To ensure you are using the modern "Motion" library syntax, not the outdated "Framer Motion" syntax.
3.  **Use `context7` MCP:**
    - **Action:** Fetching docs for _any_ other library (e.g., `GSAP`, `Three.js`, `Lenis`).
    - **Why:** If the user asks for a specific scrolling library or effect, fetch the documentation _first_ to ensure you don't use deprecated methods.

The user provides frontend requirements: a component, page, application, or interface to build.

## Phase 1: The Design & Motion Choreography (Planning)

**STOP.** Before writing a single line of code, you must act as a **Lead Motion Designer**. AI models suffer from "distributional convergence" (reverting to safe, boring averages). To fight this, you must explicitly plan the timeline.

1.  **Define the "Epicenter of Design":** What is the ONE core interaction that makes this unforgettable?
2.  **Select the Engine:**
    - **Scenario A: Landing Pages / Storytelling / Marketing**
      - **Tool:** GSAP + ScrollTrigger.
      - **Strategy:** "Scroll Storytelling." The user's scrollbar is the timeline. Elements should not just fade in; they should transform, pin, and evolve as the user scrolls.
    - **Scenario B: App UI / Dashboards / Functional Components**
      - **Tool:** Motion.dev (Framer Motion).
      - **Strategy:** "Micro-Interaction." The UI reacts to intent (hover, click, state change). It feels alive and responsive.
3.  **Draft the Choreography Script:**
    - _Example:_ "0-20% Scroll: Hero text explodes character-by-character. 20-50%: The product image pins and rotates 360 degrees while feature cards slide over it..."

## Phase 2: Aesthetic & Visual Direction

Commit to a BOLD aesthetic direction (No "Safe" Choices):

- **Tone:** Pick an extreme: Brutalist/Raw, Maximalist Chaos, Retro-Futuristic, Organic/Natural, Luxury/Refined, Editorial/Magazine.
- **Typography:** **BANNED:** Inter, Roboto, Arial, Open Sans. **REQUIRED:** Distinctive, characterful display fonts paired with clean legible body type.
- **Texture & Depth:** Avoid flat solid colors. Use noise, gradients, blurs, glassmorphism, or grain overlays to create atmosphere.
- **Layout:** Break the grid. Use asymmetry, overlap, diagonal flow, and generous negative space.

## Phase 2.5: Design Tokens & Variable-First Styling

To ensure the UI is maintainable and logically consistent, you MUST use a **Design Token** approach:

1.  **CSS Variables:** Define all core aesthetic properties (primary colors, surface blurs, noise opacity, border-radius) as CSS variables in your global stylesheet.
2.  **Tailwind Extension:** Map these variables into the `tailwind.config.js` theme object.
3.  **Semantic Naming:** Use semantic names like `--brand-epicenter`, `--surface-glass`, `--accent-vibrant` rather than literal names like `--blue-500`.
4.  **BANNED:** Hardcoded hex/rgb codes in component files. Every color must come from the theme or a variable.

## Phase 3: Implementation Rules (The Code)

Implement working code (React, Vue, HTML/CSS) with these specific technical constraints:

- **Shadcn Integration:** If using shadcn components, ensure they are properly wrapped with your motion logic (e.g., wrapping a generic `Card` in a `motion.div`).
- **Performance:** Use `will-change` on animating properties. Avoid layout thrashing.
- **Code Structure:** Keep animation logic (Hooks) separate from markup where possible for readability.

### If using GSAP (Storytelling):

- **ScrollTrigger:** Use `scrub: true` for animations that need to feel tied to the physics of scrolling.
- **Text:** Simulate `SplitText` logic. Animate words or characters individually (staggered) rather than whole blocks.
- **Performance:** Use `will-change` on animating properties. Avoid layout thrashing (animate transforms/opacity, not top/left/width).
- **Pinning:** Use `pin: true` to hold elements in place while others scroll past to create "layered" narratives.

### If using Motion.dev (App UI):

- **Layout:** Use the `layout` prop for magical, smooth resizing when content changes.
- **Presence:** ALWAYS use `<AnimatePresence>` for items leaving the DOM (don't just have them vanish instantly).
- **Simulation:** If building a "Self-Playing Demo" (e.g., a fake cursor using the app), use `useRef` to get the real bounding box of elements so the "cursor" moves to the correct coordinates dynamically.
- **Interaction:** Add `whileHover` and `whileTap` scales to interactive elements (buttons, cards) to give tactile feedback.

## General Frontend Guidelines

- **Production-Grade:** Code must be functional, responsive, and accessible.
- **Tailwind:** Use Tailwind CSS for styling, but extend the config for custom fonts and specific easing curves.
- **Differentiation:** What makes this UNFORGETTABLE? If it looks like a standard Bootstrap/Material UI template, you have failed.

**IMPORTANT:** Match implementation complexity to the aesthetic vision. Don't hold back. Show what can truly be created when thinking outside the box. You are not just a coder; you are a builder using the best tools. Use the MCPs to verify your knowledge, then execute with bold creativity.

---

## Next.js SSR-Safe Patterns

When building for Next.js App Router (server-side rendering), follow these critical patterns to avoid infinite loops and hydration errors:

### The SSR-Safe Component Pattern

**Use this pattern for ANY component that:**
- Uses `localStorage` / `sessionStorage`
- Uses browser APIs (`window`, `document`, `navigator`)
- Uses state management with persistence (Zustand, Redux, etc.)
- Needs to access browser-only data

```typescript
"use client"

import { useState, useEffect } from "react"

export function SSRSafeComponent() {
  const [mounted, setMounted] = useState(false)
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    setMounted(true)

    // ONLY access browser APIs here
    const stored = localStorage.getItem('key')
    if (stored) setValue(JSON.parse(stored))
  }, [])

  // BEFORE mount: render static placeholder (SSR-safe)
  if (!mounted) {
    return <div className="w-10 h-10 bg-muted" />
  }

  // AFTER mount: render full component with browser data
  return <div>{value}</div>
}
```

### Common SSR Errors to Avoid

| Error | Cause | Solution |
|-------|--------|----------|
| "Maximum update depth exceeded" | Zustand persist accessing localStorage during SSR | Use local state + useEffect instead |
| "Rendered more hooks than during the previous render" | Conditional hook calling: `mounted ? useHook() : null` | Never call hooks conditionally |
| "Text content does not match server-rendered HTML" | Browser API accessed during render | Use useEffect for browser-only code |

### Key Rules

1. **NEVER** call hooks conditionally based on `mounted` state
2. **NEVER** use Zustand persist middleware for SSR components
3. **ALWAYS** use `useEffect` for browser APIs
4. **ALWAYS** render static placeholders before client-side mount

---

## TypeScript Best Practices for Production Builds

**CRITICAL**: TypeScript strict mode catches bugs at compile time. Follow these practices to ensure successful production builds on Vercel, Netlify, or any platform.

### Rule 1: Eliminate All Implicit `any` Types

**Problem**: TypeScript's strict mode forbids implicit `any`. Build will FAIL.

```typescript
// ❌ WRONG - Implicit any in parameters
function processTask(task) {  // Error: Parameter 'task' implicitly has 'any' type
  return task.id;
}

const filterItems = items.filter(item => item.active);  // Error: 'item' implicitly 'any'

// ✅ CORRECT - Explicit types
function processTask(task: Task) {
  return task.id;
}

const filterItems = items.filter((item: Item) => item.active);
// OR use type inference from array
const filterItems = items.filter(item => item.active);  // OK if 'items' is typed
```

### Rule 2: Remove All Unused Imports and Variables

**Problem**: TypeScript strict mode (`noUnusedLocals: true`, `noUnusedParameters: true`) will FAIL builds.

```typescript
// ❌ WRONG - Unused imports
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";  // Never used

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    fetchTasks();
  }, []);  // useEffect imported but never used
  return <div>{tasks.map(t => <div key={t.id}>{t.title}</div>)}</div>;
}

// ✅ CORRECT - Remove unused imports
import { useState, useEffect } from "react";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    fetchTasks();
  }, []);
  return <div>{tasks.map(t => <div key={t.id}>{t.title}</div>)}</div>;
}
```

### Rule 3: Fix Type Mismatches in Enum Usage

**Problem**: Using string literals where enums are expected causes build failures.

```typescript
// ❌ WRONG - String literal instead of enum value
const getStatusStyle = (status: string) => {
  if (status === "archived") return "gray";  // Type error
};

// ✅ CORRECT - Use enum type
const getStatusStyle = (status: TaskStatus) => {
  const styles: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: "blue",
    [TaskStatus.DOING]: "yellow",
    [TaskStatus.DONE]: "green",
    [TaskStatus.ARCHIVED]: "gray",  // Must include all enum values
  };
  return styles[status];
};
```

### Rule 4: Handle Dynamic Component Rendering Correctly

**Problem**: JSX doesn't allow dynamic component tags like `<ComponentName />`.

```typescript
// ❌ WRONG - JSX treats ComponentName as literal HTML tag
const statusIcon = CheckCircle;
return <div><statusIcon className="w-4 h-4" /></div>;  // Error

// ✅ CORRECT - Use React.createElement or uppercase variable
const statusIcon = CheckCircle;
return <div>{React.createElement(statusIcon, { className: "w-4 h-4" })}</div>;

// OR use uppercase (React convention for components)
const StatusIcon = CheckCircle;
return <div><StatusIcon className="w-4 h-4" /></div>;
```

### Rule 5: Destructure Hooks Correctly

**Problem**: Accessing nested properties that don't exist on hook returns.

```typescript
// ❌ WRONG - Incorrect property access
const { timer, timeEntries } = useTimeTracking();
const elapsed = timer.timer.elapsedSeconds;  // Error: Property 'timer' doesn't exist
const totalTime = timeEntries.totalMinutes;  // Error: Property 'totalMinutes' doesn't exist

// ✅ CORRECT - Destructure correctly
const { timer, timeEntries, totalTime } = useTimeTracking();
const elapsed = timer.elapsedSeconds;  // timer IS the TimerState
```

### Rule 6: Use Type-Only Imports Correctly

**Problem**: Importing types as values when they should be type-only.

```typescript
// ❌ WRONG - Using type-only import as value
import type { UserRole } from "@/types";

if (user.role === UserRole.ADMIN) {  // Error: 'UserRole' cannot be used as a value
  // ...
}

// ✅ CORRECT - Regular import for values used at runtime
import { UserRole } from "@/types";

if (user.role === UserRole.ADMIN) {
  // ...
}
```

### Rule 7: Fix Function Signature Mismatches

**Problem**: Calling functions with wrong number of arguments.

```typescript
// ❌ WRONG - Too many arguments
const timeAgo = formatDistanceToNow(new Date(), { addSuffix: true });
// Error: Expected 1-2 arguments, but got 2 (or similar)

// ✅ CORRECT - Check function signature
const timeAgo = formatDistanceToNow(new Date());  // Often just needs the date
```

### Pre-Build Checklist (Run Before Every Commit)

```bash
# 1. Run TypeScript compiler in strict mode
cd frontend
npx tsc --noEmit --strict

# 2. Run the linter
npm run lint

# 3. Fix ALL errors before committing
# TypeScript errors = build failures in production
```

### Common Build-Failing Errors and Fixes

| Error Message | Cause | Fix |
|---------------|-------|-----|
| `Parameter 'x' implicitly has 'any'` | Missing type annotation | Add explicit type: `(x: Type)` |
| `has no export 'X'` | Wrong import path or non-existent export | Check import path and verify export exists |
| `Property 'X' does not exist` | Type mismatch or wrong property access | Check type definition and fix property name |
| `is declared but its value is never read` | Unused variable/import | Remove unused code |
| `cannot be used as a value` | Type-only import used as value | Change to regular import |
| `JSX element 'component'` | Dynamic component rendering issue | Use `React.createElement()` or uppercase variable |

### Best Practices Summary

1. **Always** run `npx tsc --noEmit` before committing
2. **Never** use `any` type - use `unknown` or proper generics instead
3. **Remove** all unused imports and variables
4. **Type all** function parameters explicitly
5. **Use** `Record<Type, T>` for type-safe object mappings
6. **Import** enums as values, not types
7. **Test** builds locally: `npm run build` must succeed
8. **Enable** strict mode in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**Remember**: If it compiles locally with strict mode, it will build successfully on Vercel/Netlify. TypeScript errors are your friend - they catch bugs before users do.

---

## 2025 Stack/Directory UI Patterns

**Implementation:** Curated tool stack page with filtering and individual tool reviews

### Component Architecture for Directories

**StackCard Component Pattern:**
```typescript
export function StackCard({ tool, featured = false }: Props) {
  return (
    <Link
      href={`/stack/${tool.slug.current}`}
      className={`group block p-6 rounded-xl border transition-all duration-200 ${
        featured
          ? 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
          : 'border-neutral-800 bg-neutral-900/30 hover:bg-neutral-800/50'
      }`}
    >
      <div className="flex items-start gap-4">
        <Image
          src={tool.logo.asset.url}
          width={48}
          height={48}
          className="rounded-lg transition-transform duration-200 group-hover:scale-110"
        />
        <div className="flex-1 min-w-0">
          <h3 className="group-hover:text-blue-400 transition-colors">
            {tool.name}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-2">
            {tool.tagline}
          </p>
        </div>
        <div className="shrink-0">
          <span className={`text-lg font-bold ${
            tool.myRating >= 4 ? 'text-green-400' : 
            tool.myRating >= 3 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {tool.myRating}
          </span>
        </div>
      </div>
    </Link>
  )
}
```

**Key Design Patterns:**
- **Hover States:** Scale transforms + color transitions for tactile feedback
- **Rating Colors:** Conditional coloring based on rating value (green/yellow/red)
- **Visual Hierarchy:** Tool name > tagline > metadata with sizing and color
- **Link Wrapping:** Entire card clickable, not just individual elements
- **Line Clamping:** Prevent text overflow with Tailwind `line-clamp-2`

### Client-Side Filtering Component

**StackFilter Pattern:**
```typescript
'use client'

export function StackFilter({ categories, tools }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [tools, selectedCategory, searchQuery])

  return (
    <div>
      {/* Search input with icon */}
      <div className="relative">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 pl-12 rounded-lg border border-neutral-800 bg-neutral-900/50"
          placeholder="Search tools by name, description, or layer..."
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
      </div>

      {/* Category filter buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
          }`}
        >
          All Tools ({tools.length})
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
            }`}
          >
            {categoryLabel} ({tools.filter(t => t.category === category).length})
          </button>
        ))}
      </div>

      {/* Results grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <StackCard key={tool._id} tool={tool} />
        ))}
      </div>
    </div>
  )
}
```

**Key UX Patterns:**
- **Real-time Filtering:** Instant search without page reload
- **Visual Counters:** Show tool counts per category in buttons
- **Empty States:** Helpful message when no results found
- **Clear Filters:** Easy way to reset all filters
- **Responsive Grid:** Single column mobile, two columns desktop

### Accessibility & Responsiveness

**Mobile-First Design:**
```typescript
// Responsive grid with consistent breakpoints
<div className="grid md:grid-cols-2 gap-4">
  {/* Cards stack on mobile, grid on tablet+ */}
</div>

// Responsive navigation
<div className="flex flex-wrap gap-2">
  {/* Buttons wrap naturally on smaller screens */}
</div>
```

**Accessibility Features:**
- Semantic HTML (proper heading hierarchy)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators on interactive elements
- Alt text for all images
- Sufficient color contrast ratios

### Performance Optimization

**Image Optimization:**
```typescript
import Image from 'next/image'

<Image
  src={tool.logo.asset.url}
  alt={`${tool.name} logo`}
  width={48}
  height={48}
  className="rounded-lg"
  // Next.js automatically:
  // - Converts to WebP/AVIF
  // - Lazy loads below-fold images
  // - Serves responsive sizes
  // - Prevents layout shift with explicit dimensions
/>
```

**Client-Side Optimization:**
```typescript
// Use useMemo for expensive filtering
const filteredTools = useMemo(() => {
  return tools.filter(/* complex filtering logic */)
}, [tools, selectedCategory, searchQuery])

// Debounce search input if needed
import { useDebouncedValue } from '@/hooks/useDebounce'
const debouncedSearch = useDebouncedValue(searchQuery, 300)
```

### Animation & Micro-interactions

**Hover Effects:**
```typescript
// Card hover
className="group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200"

// Image scale
className="transition-transform duration-200 group-hover:scale-110"

// Text color change
className="group-hover:text-blue-400 transition-colors duration-200"
```

**Key Animation Principles:**
- Fast transitions (200ms) for responsive feel
- Subtle effects (scale 1.1, not 2.0)
- Smooth easing functions
- GPU-accelerated properties (transform, opacity)
- Consistent timing across similar interactions

### Design System Integration

**Theme Token Usage:**
```typescript
// Instead of hardcoded colors
className="bg-blue-500 text-white"

// Use semantic theme tokens
className="bg-primary text-primary-foreground"
// Or custom CSS variables
style={{ backgroundColor: 'var(--brand-primary)' }}
```

**Component Composition:**
```typescript
// Build complex UI from simple components
<StackCard>
  <ToolLogo />
  <ToolInfo />
  <ToolRating />
  <ProjectBadges />
</StackCard>

// Each component is independently reusable
```

### Key Learnings

**Visual Design:**
- Use color and typography to create visual hierarchy
- Implement subtle hover states for interactive feedback
- Maintain consistent spacing and alignment
- Use conditional styling for different states/ratings
- Ensure proper focus indicators for accessibility

**User Experience:**
- Provide instant feedback for user actions
- Show helpful empty states when no results
- Include counts and labels for clarity
- Make all interactive elements clearly clickable
- Support both mouse and keyboard navigation

**Performance:**
- Optimize images with Next.js Image component
- Use useMemo for expensive computations
- Implement proper loading states
- Lazy load below-fold content
- Minimize client-side JavaScript

**Accessibility:**
- Maintain proper heading hierarchy
- Include ARIA labels where needed
- Ensure keyboard navigation works
- Provide sufficient color contrast
- Include alt text for all images