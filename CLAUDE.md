# Cognitive Canvas - Project Memory

## Project Overview
An intelligent Next.js 14+ application that visualizes the "thought structure" of LLM prompts using an infinite canvas. Combines Flora AI's clean glassmorphism aesthetics with InfraNodus-inspired Text Network Analysis, powered entirely by LLM inference.

## Quick Commands
```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check

# Installation
npm install          # Install all dependencies
```

## Tech Stack
- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + clsx + tailwind-merge
- **Canvas Engine:** @xyflow/react (React Flow with Custom Nodes)
- **State Management:** Zustand (Global Graph Store)
- **AI Provider:** @google/generative-ai (Gemini Pro/Flash)
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Architecture Principles

### Core Pattern: LLM-Driven Graph Engine
- **NO** traditional graph math libraries (NetworkX, Gephi, etc.)
- **YES** to prompt engineering Gemini to output structured graph JSON
- Graph analysis done via LLM "hallucination" of network structures

### Data Flow
1. User inputs prompt → Server Action
2. Gemini analyzes → Returns structured JSON (nodes, edges, gaps)
3. Zustand store updates → React Flow renders
4. User interacts with highlights → New nodes spawn

### State Management (Zustand)
```typescript
interface GraphStore {
  nodes: Node[]
  edges: Edge[]
  ghostNodes: GhostNode[]
  addNode: (node) => void
  expandNode: (id) => void
  materializeGhost: (id) => void
}
```

### File Structure
```
/app
  /api
    /analyze          # Server action for Gemini
  /components
    /canvas
      InfiniteCanvas.tsx
      SmartPromptNode.tsx
      GhostNode.tsx
    /ui               # Shadcn-style components
  /lib
    /store
      graphStore.ts   # Zustand state
    /ai
      analyzePromptLogic.ts  # Gemini integration
  /types
    graph.ts          # TypeScript interfaces
```

## Style Guide
- **Components:** Functional React Components (no class components)
- **Styling:** Tailwind CSS utility classes, glassmorphism for nodes
- **Naming:** camelCase for functions, PascalCase for components
- **Icons:** Lucide React only
- **Animation:** Framer Motion for node spawning/interactions

## Key Features

### 1. Smart Prompt Node
- Glassmorphism card design (white/gray with backdrop blur)
- Interactive text highlighting
- Hover shows explanation tooltips
- Click spawns child nodes

### 2. Ghost Nodes
- Dashed borders, semi-transparent
- Represent structural gaps in reasoning
- Click to "materialize" (solidify and add to context)
- Float near parent nodes

### 3. LLM Graph Analysis
Gemini outputs strict JSON schema:
- `main_intent`: Overall goal
- `complexity_score`: 0-100
- `discourse_type`: Focused/Dispersed/Biased
- `nodes`: Semantic segments (intent/constraint/gap)
- `edges`: Relationships between nodes
- `structural_gaps`: Missing logic/concepts

## Current Status
**Phase:** Initial Setup & Scaffolding
**Last Updated:** 2025-11-18
**Next Steps:** Create Next.js scaffold, install dependencies

## Environment Variables
```bash
GOOGLE_API_KEY=your_gemini_api_key_here
```

## Design Inspirations
- **Visual Reference:** Flora AI (florafauna.ai)
- **Aesthetic:** Infinite intelligent canvas, glass table metaphor
- **Typography:** Inter or Geist Sans
- **Color Palette:** Soft whites, grays, glassmorphism effects
