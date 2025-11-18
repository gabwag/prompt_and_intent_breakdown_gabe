# Cognitive Canvas - Development Log

## 2025-11-18: Project Initialization

### Decision: Why React Flow?
**Rationale:** Evaluated multiple canvas libraries:
- **Rejected:** Konva (too low-level, would need to build panning/zooming)
- **Rejected:** Three.js (overkill for 2D graph visualization)
- **Selected:** React Flow (@xyflow/react)
  - Built-in infinite canvas with smooth panning/zooming
  - Custom node support (critical for our interactive highlights)
  - Edge rendering and connection logic handled
  - Great TypeScript support
  - Active maintenance and good documentation

### Decision: Why Gemini over GPT-4?
**Rationale:**
- Structured output capabilities with schema enforcement
- Fast inference (Gemini Flash for real-time analysis)
- Cost-effective for graph analysis tasks
- Native JSON mode support
- Good at following complex system prompts with strict schemas

### Decision: State Management - Zustand
**Why not Redux/Context?**
- **Zustand:** Minimal boilerplate, perfect for graph state
- No provider wrapper needed
- Built-in TypeScript support
- Easy to subscribe to specific slices
- React Flow works well with external state managers

### Dependency Justifications

#### Core Framework
- `next@14.x` - App Router for server actions, RSC
- `react@18.x` - Latest stable React
- `typescript` - Type safety critical for graph data structures

#### Canvas & Visualization
- `@xyflow/react` - Primary canvas engine
- `framer-motion` - Node spawn animations, smooth transitions

#### State & Data
- `zustand` - Global graph state management
- `immer` - Immutable state updates (integrates with Zustand)

#### AI Integration
- `@google/generative-ai` - Official Gemini SDK

#### Styling & UI
- `tailwindcss` - Utility-first CSS
- `tailwind-merge` - Merge Tailwind classes safely
- `clsx` - Conditional classnames
- `lucide-react` - Consistent icon system

#### Utilities
- `nanoid` - Generate unique node IDs
- `zod` - Runtime schema validation for Gemini responses

### Architecture Decision: Server Actions vs API Routes
**Choice:** Server Actions
**Reason:**
- Direct function calls from client components
- No need to manage fetch logic
- Automatic error handling
- Better TypeScript integration
- Keeps API key secure on server

### Color Scheme Decision
**Inspiration:** Flora AI's glassmorphism
**Palette:**
- Background: `bg-slate-50` (soft, not harsh white)
- Nodes: `bg-white/80` with `backdrop-blur-md`
- Borders: `border-slate-200/50` (subtle)
- Ghost Nodes: `border-dashed border-purple-300/60`
- Intent nodes: Blue tints (#3B82F6)
- Constraint nodes: Amber tints (#F59E0B)
- Gap nodes: Purple tints (#A855F7)

### Typography Decision
**Choice:** Geist Sans (Vercel's font)
**Fallback:** Inter
**Reason:** Clean, modern, excellent readability at small sizes (important for node labels)

## Pivots & Lessons Learned

### (None yet - initial setup phase)

## Deployment Strategy

### Target Platform: Vercel
**Why Vercel?**
- Native Next.js optimization
- Automatic edge deployment
- Environment variable management
- Zero-config deployment

### Deployment Checklist
- [ ] Add `GOOGLE_API_KEY` to Vercel environment variables
- [ ] Set Node.js version in `package.json` (engines field)
- [ ] Optimize for production build
- [ ] Test on Vercel preview deployment
- [ ] Monitor function execution times (Gemini calls)

### Alternative: Netlify
**Backup plan if Vercel issues:**
- Install `@netlify/plugin-nextjs`
- Configure `netlify.toml`
- Ensure server actions work with Netlify Functions

## Performance Considerations

### LLM Call Optimization
- **Strategy:** Debounce user input (wait 500ms after typing stops)
- **Caching:** Store analysis results in localStorage (keyed by prompt hash)
- **Streaming:** Consider streaming for long prompts (future enhancement)

### Canvas Performance
- **Virtual rendering:** React Flow handles viewport culling automatically
- **Node limit:** Cap at 100 nodes per canvas (UX consideration)
- **Edge bundling:** Group similar edges if count > 20

## Known Technical Debt

### (To be populated as development progresses)

## Future Enhancements (Post-MVP)

1. **Export Functionality**
   - Export graph as PNG/SVG
   - Export analysis as JSON/Markdown

2. **Collaborative Features**
   - Share canvas via URL
   - Real-time collaboration (WebSockets)

3. **Advanced Analysis**
   - Compare multiple prompts
   - Track prompt evolution over time
   - Suggest optimizations based on gaps

4. **Customization**
   - User-defined node types
   - Custom color schemes
   - Layout algorithm preferences

## References & Resources

- [React Flow Docs](https://reactflow.dev/learn)
- [InfraNodus Theory](https://infranodus.com/theory)
- [Flora AI Reference](https://florafauna.ai)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Glassmorphism Generator](https://glassmorphism.com/)

---

**Log Format:**
- **Decision:** Technical choice made
- **Pivot:** Changed approach and why
- **Dependency:** Why package X was added
- **Lesson:** What didn't work and the solution
