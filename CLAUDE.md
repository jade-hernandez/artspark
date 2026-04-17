# CLAUDE.md — ArtSpark

## Project overview

ArtSpark is a web application that presents a daily artwork discovery experience. Users can explore artworks from the Art Institute of Chicago's collection, discover random pieces, and build a personal favorites collection. All content is in English (sourced from the API).

---

## Tech stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS 4**
- **CVA (class-variance-authority)** — component variants
- **React Router v6** — navigation
- **Vaul** — bottom sheet for mobile drawer
- **Supabase** — authentication (email + Google OAuth) + favorites database
- **Deployment** — Vercel

---

## Folder structure

```
src/
├── api/
│   └── fetch-artworks.ts      # API call functions to Art Institute
├── components/
│   ├── ui/                    # Reusable component library
│   │   ├── Button.tsx               # Button component
│   │   ├── button-variants.ts       # CVA variants (separate file)
│   │   ├── Modal.tsx                # Generic modal shell (overlay + card + focus trap)
│   │   ├── Loader.tsx               # Loading spinner
│   │   ├── Portal.tsx               # React portal for modals/drawers
│   │   └── index.ts                 # Barrel export
│   ├── artwork/
│   │   ├── ArtworkCard.tsx          # Thumbnail card (favorites gallery)
│   │   ├── ArtworkDetail.tsx        # Full artwork display
│   │   └── FavoriteButton.tsx       # Heart button with animation
│   ├── gallery/
│   │   └── MasonryGrid.tsx          # Masonry grid for favorites
│   └── layout/
│       ├── Header.tsx
│       └── Drawer.tsx               # Side panel (My Collection) — single-use, not generic
├── hooks/
│   ├── useArtwork.ts           # Fetch artwork of the day + random
│   ├── useFavorites.ts         # CRUD favorites via Supabase
│   └── useAuth.ts              # Supabase auth logic
├── lib/
│   ├── supabase.ts             # Initialized Supabase client
│   └── artwork-of-the-day.ts   # Date-based artwork selection logic
├── pages/
│   └── DiscoverPage.tsx        # Main page: artwork + drawer
├── types/
│   └── artwork.ts              # TypeScript types
├── App.tsx                     # Global layout + routes
└── main.tsx
```

---

## Git workflow & conventions

### Conventional commits

All commit messages MUST follow the Conventional Commits specification:

```
<type>(<scope>): <short description>
```

**Types:**

- `feat` — new feature
- `fix` — bug fix
- `style` — styling/CSS changes (no logic change)
- `refactor` — code refactor (no feature change)
- `chore` — tooling, config, dependencies
- `docs` — documentation

**Scopes:** `api`, `auth`, `favorites`, `ui`, `artwork`, `drawer`, `layout`, `config`, `supabase`

**Examples:**

```
chore(config): init Vite + React + TypeScript project
feat(api): add artwork fetch functions with field selection
feat(auth): implement Supabase auth with email and Google OAuth
feat(artwork): create ArtworkDetail component with IIIF image
feat(favorites): add useFavorites hook with Supabase CRUD
feat(drawer): implement slide-in collection panel
style(ui): apply design system colors and typography
fix(api): handle artworks with missing image_id
refactor(hooks): extract artwork retry logic into helper
```

### Commit rules

- **Claude Code prepares commit messages but NEVER commits or pushes.** The developer reviews and commits manually.
- Commit at every meaningful milestone (new feature, component, hook, or config).
- Keep commits atomic: one concern per commit.
- Always run the app and verify it works before committing.

---

## API — Art Institute of Chicago

### Base URL

`https://api.artic.edu/api/v1`

### Authentication

No API key required.

### Endpoints

**1. Artwork by ID**

```
GET /artworks/{id}?fields=id,title,image_id,artist_display,artist_title,date_display,medium_display,dimensions,place_of_origin,artwork_type_title,style_title,department_title,description,short_description,is_public_domain,color
```

**2. Filtered search (public domain only)**

```
GET /artworks/search?query[term][is_public_domain]=true&limit=1&page={random}&fields=id,title,image_id,artist_display,artist_title,date_display,medium_display,dimensions,place_of_origin,artwork_type_title,style_title,department_title,description,short_description,is_public_domain,color
```

**3. Total artwork count (for daily artwork calculation)**

```
GET /artworks/search?query[term][is_public_domain]=true&limit=0
```

→ Use `pagination.total` from the response.

### IIIF image URLs

```
https://www.artic.edu/iiif/2/{image_id}/full/{size}/0/default.jpg
```

- `843,` → standard display
- `400,` → thumbnails for favorites gallery
- `1686,` → high resolution

### Important considerations

- Some artworks have `image_id: null` → retry with another artwork.
- Always filter `is_public_domain: true` to guarantee image access.
- Always use the `fields` parameter to optimize requests.
- Use `config.iiif_url` from the response — do not hardcode the IIIF URL.

### Artwork of the day — algorithm

Use a deterministic hash of today's date to compute a page number. All users see the same artwork on the same day.

```ts
function getArtworkOfTheDay(totalPages: number): number {
  const today = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % totalPages) + 1;
}
```

---

## Supabase

### Table `favorites`

```sql
CREATE TABLE favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  artwork_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  artist TEXT,
  image_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE UNIQUE INDEX idx_favorites_unique ON favorites(user_id, artwork_id);
```

### Row Level Security (RLS)

```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);
```

### Auth

- Email + password
- Google OAuth
- App works without login (free browsing)
- Login required only to save favorites

---

## Design system

### Visual direction

Contemporary art gallery: light background, generous whitespace, modern typography. The artwork is always the focal point — the UI steps back.

### Color palette

| Role                                 | Hex       |
| ------------------------------------ | --------- |
| Background                           | `#FAFAFA` |
| Secondary background (drawer, cards) | `#F0F0F0` |
| Primary text                         | `#1A1A1A` |
| Secondary text                       | `#6B6B6B` |
| Accent (heart, primary buttons)      | `#E85D4A` |
| Accent hover                         | `#D14A38` |
| Borders / dividers                   | `#E5E5E5` |

### Typography

**Single font: Inter** (Google Fonts, variable)

- Artwork title: 28px, semibold (600)
- Artist name: 18px, medium (500)
- Secondary info: 14px, regular (400), color `#6B6B6B`
- Description: 15px, regular (400)
- Buttons: 14px, medium (500)
- Logo "ArtSpark": 20px, bold (700)

### Layout — Main page

- Single immersive page: artwork centered, info below
- Image max-width: `max-w-2xl`
- Secondary info (date · medium · origin) on one line separated by `·`
- "Learn more" button toggles an accordion with description
- Generous padding and spacing throughout

### Layout — My Collection (responsive pattern)

The "My Collection" panel uses **two different patterns** depending on the viewport:

**Desktop (≥ 768px) — Side drawer**

- Slides in from the right (`translateX`)
- Width: `400px`
- Background: `#F0F0F0`
- Transition: `300ms ease-in-out`
- Click outside to close, Escape key to close
- Focus trap for accessibility

**Mobile (< 768px) — Bottom sheet (Vaul)**

- Uses the `vaul` library
- Swipe up to expand, swipe down to close
- Snap points: partially open (preview) and fully expanded
- Native-feel drag gestures with inertia
- Handles scroll behavior internally (scroll content when fully expanded)
- Background scroll locked when open

**Rationale**: Mobile users rely on thumb-reachable bottom interactions, while desktop users expect lateral panels. The bottom sheet also keeps the current artwork partially visible when peeking at favorites, which a full-screen drawer would hide.

### Grid for favorites (inside drawer/sheet)

- 2 columns of thumbnail cards
- Card: thumbnail (IIIF `400,`), truncated title, artist
- Click card → close drawer/sheet + display artwork

### Layout — Mobile

- Full-width image with padding
- Drawer takes full screen
- Larger touch-friendly buttons
- Simplified header (icons only)

### Components

**Reusable UI library (`components/ui/`)**

Only generic, multi-use components belong here. Project-specific components stay in their own folders (`artwork/`, `gallery/`, `layout/`).

`Button` — CVA variants adapted to ArtSpark:

- Variants: `primary` (coral bg `#E85D4A`), `outline` (gray border `#E5E5E5`), `ghost` (transparent, for close/menu actions)
- Sizes: `md`, `lg`, `icon-md`
- CVA config in a **separate file** (`button-variants.ts`)

`Modal` — generic shell component:

- Uses `Portal` for rendering outside DOM tree
- Dark overlay (`rgba(0,0,0,0.5)`), click outside to close
- Centered white card (`max-w-sm`)
- Focus trap (reuse `useFocusTrap` hook pattern)
- Close on Escape key
- Used by: auth modal (and potentially artwork detail from favorites)

`Loader` — simple loading spinner:

- Used during: artwork fetch, image loading, favorites loading

`Portal` — React `createPortal` wrapper:

- Renders children into `#portal-root`
- Used by: Modal, Drawer

**Project-specific components (NOT in `ui/`)**

`FavoriteButton` — uses Button internally but has specific logic (auth check, Supabase call, heart animation). Lives in `components/artwork/`.

`Drawer` — responsive component for My Collection. Uses a side drawer on desktop and a Vaul bottom sheet on mobile. Single-use in this app, so it lives in `components/layout/`, not in `ui/`.

`ArtworkCard` — thumbnail card for favorites gallery. Project-specific. Lives in `components/artwork/`.

`ArtworkDetail` — full artwork display. Lives in `components/artwork/`.

### Animations

| Element            | Animation          | Duration |
| ------------------ | ------------------ | -------- |
| Artwork transition | Fade out → fade in | 400ms    |
| Drawer open/close  | Slide from right   | 300ms    |
| Add to favorites   | Pulse scale        | 200ms    |
| Auth modal         | Fade in + scale up | 250ms    |
| Card hover         | Elevation + scale  | 150ms    |

All animations use `ease-in-out`.

---

## Formatting & linting

### Prettier config (`.prettierrc`)

```json
{
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "jsxSingleQuote": true,
  "printWidth": 100,
  "semi": true,
  "singleAttributePerLine": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### ESLint

Use the default Vite + React + TypeScript ESLint config. Add `eslint-config-prettier` to disable formatting rules that conflict with Prettier.

### Format on save

The project should include a `.vscode/settings.json` to ensure consistent formatting:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## Code conventions

### File naming conventions

- **Components (`.tsx`)**: PascalCase (`ArtworkCard.tsx`, `Button.tsx`)
- **Hooks (`.ts`)**: camelCase with `use` prefix (`useArtwork.ts`, `useFavorites.ts`)
- **All other `.ts` files (utilities, data, variants, API functions)**: kebab-case (`fetch-artworks.ts`, `artwork-of-the-day.ts`, `button-variants.ts`)

### Functions & exports

- Use **function declarations**, not const arrows: `function Button()` not `const Button = () =>`
- **Named exports at end of file**: `export { Button };` — never inline, never `export default` (except pages)

### Components naming & structure

- PascalCase filenames (`ArtworkCard.tsx`)
- Props typed with `type` and intersections, not `interface`:

  ```ts
  type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
  ```

- CVA variants in a **separate file** from the component (`button-variants.ts`)
- Configuration data (arrays, objects) **externalized** from components into dedicated files

### Hooks

- camelCase with `use` prefix (`useArtwork.ts`)
- One responsibility per hook
- Return an object with named values and functions

### Types

- Use `type` keyword (not `interface`)
- Dedicated files for data types (`types/artwork.ts`)
- Import types with `import type` when possible

### Styling

- Use `cn()` utility (clsx + twMerge) for combining Tailwind classes
- Each JSX attribute on its own line (`singleAttributePerLine: true`)
- JSX uses single quotes for string attributes (`aria-label='Close'`)

### Accessibility

- Semantic HTML and ARIA attributes are mandatory, not optional
- `aria-labelledby` on sections, `aria-label` on interactive elements
- Focus trap for modals and drawers
- `aria-modal`, `role="dialog"` on overlays

### State management

- Always handle all states: loading, error, empty, success
- Use `useReducer` for complex form/multi-field state
- Use `useState` for simple toggles and single values
