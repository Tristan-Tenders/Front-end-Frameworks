# Milestone 1 Notes — Props, State & useState

Reference notes tied to this project's actual code (`App.tsx`, `SearchBar.tsx`, `MovieList.tsx`, `MovieCard.tsx`).

---

## 1. Functional components

A React component is just a JS function that takes `props` and returns JSX.

```jsx
const SearchBar = ({ query, onChange }) => { ... }
```

`SearchBar`, `MovieCard`, `MovieList`, and `App` in this project are all functional components — no classes.

---

## 2. Props & one-way data flow

Props are read-only inputs passed **parent → child**. Data never flows back up directly.

```jsx
// App.tsx
<SearchBar query={query} onChange={setQuery} />
```

`App` owns `query` and hands it down. To let a child affect the parent's state, the parent passes a **callback prop** (`onChange={setQuery}`), and the child calls it:

```jsx
// SearchBar.tsx
<input value={query} onChange={(event) => onChange(event.target.value)} />
```

The child never touches `App`'s state directly — it just invokes a function `App` gave it. That's why it's "one-way."

---

## 3. Local state

State is data a component remembers across renders (unlike a plain variable, which resets every render).

```jsx
// MovieCard.tsx
const [isFavorite, setIsFavorite] = useState(false)
```

This is **local** state: every `MovieCard` instance has its own independent `isFavorite`, not shared with other cards or lifted up to `App`.

---

## 4. useState — syntax & behavior

```jsx
const [isFavorite, setIsFavorite] = useState(false)
```

- `useState(false)` sets the initial value.
- Returns `[currentValue, setterFunction]` — destructured as an array.
- Calling the setter schedules a **re-render**: `setIsFavorite((prev) => !prev)` (MovieCard.tsx:37).
- Prefer the updater-function form (`prev => !prev`) over `setIsFavorite(!isFavorite)` when the new value depends on the old one — it always reads the latest state instead of a possibly-stale closure value.

---

## 5. Controlled components

An input is "controlled" when React state — not the DOM — is the source of truth for its value.

```jsx
// SearchBar.tsx
<input value={query} onChange={(event) => onChange(event.target.value)} />
```

Flow: user types → `onChange` fires → `App.setQuery` runs → `App` re-renders → new `query` flows back down as `value`.

Why it matters here: `App` also derives `filteredMovies` from the same `query` state, so the input's value and the filtered list are always in sync from one source of truth.

---

## 6. Rendering lists with `.map()` and `key`

```jsx
// MovieList.tsx
{movies.map((movie) => (
  <MovieCard key={movie.id} movie={movie} />
))}
```

- `.map()` turns an array of data into an array of JSX elements.
- `key` is a special prop (not received inside the component) that lets React's reconciler match items across re-renders instead of tearing everything down and rebuilding it.
- Use a **stable, unique id** (`movie.id`), not the array index — an index breaks identity tracking when the search filter changes which movies are shown (items get inserted/removed/reordered).
- Same pattern for genre tags in `MovieCard.tsx` (`key={genre}`).

---

## 7. JSX and compilation

JSX isn't HTML — it compiles to function calls, e.g.:

```jsx
<div className="app-layout">...</div>
```

compiles to roughly:

```js
React.createElement("div", { className: "app-layout" }, ...)
```

(or `_jsx(...)` from `react/jsx-runtime` with the modern transform — same idea).

This explains:
- Why JSX needs a single root element per expression.
- Why it's `className`, not `class` (it's a JS object key, not an HTML attribute).
- Why `{expression}` works — it's just JS evaluated and passed in as a child/prop, e.g. `{movie.vote_average.toFixed(1)}` in `MovieCard.tsx`.

---

## 8. React DevTools

Browser extension, two panels:

- **Components tab**: shows the component tree (`App > MovieList > MovieCard`). Select an instance to inspect its live props/state — e.g. watch `isFavorite` flip when clicking a card's heart button. You can edit values directly to test UI without changing code.
- **Profiler tab**: records renders, shows how long each took and *why* it re-rendered (which prop/state changed).
- Handy toggle: "Highlight updates when components render" (gear icon) — flashes which components re-render per interaction. Typing in `SearchBar` should re-render `App`, `MovieList`, and the `MovieCard`s (since `filteredMovies` changes), but shouldn't unnecessarily remount unrelated parts.
