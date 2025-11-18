# Cognitive Canvas

An intelligent Next.js application that visualizes the "thought structure" of LLM prompts using an infinite canvas. Built with AI-powered graph analysis using Google Gemini.

## ✨ Features

- **LLM-Driven Graph Analysis**: Uses Google Gemini to analyze prompts and generate semantic network structures
- **Infinite Canvas**: Built with React Flow for smooth panning, zooming, and interaction
- **Interactive Nodes**: Glassmorphism design with hover tooltips and click-to-expand functionality
- **Ghost Nodes**: Visualize structural gaps and missing concepts in your prompts
- **Real-time Analysis**: Get instant feedback on prompt complexity, discourse type, and structural completeness

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17.0 or later
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```bash
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
cognitive-canvas/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── canvas/              # Canvas components
│   │   ├── InfiniteCanvas.tsx      # Main canvas with React Flow
│   │   ├── SmartPromptNode.tsx     # Interactive node component
│   │   ├── GhostNode.tsx           # Structural gap nodes
│   │   └── AnalysisPanel.tsx       # Analysis results panel
│   └── ui/                  # UI components
│       └── PromptInput.tsx         # Prompt input component
├── lib/
│   ├── store/
│   │   └── graphStore.ts    # Zustand state management
│   ├── ai/
│   │   └── analyzePromptLogic.ts   # Gemini integration
│   └── utils.ts             # Utility functions
├── types/
│   └── graph.ts             # TypeScript type definitions
└── public/                  # Static assets
```

## 🎨 Design Philosophy

### Visual Inspiration
Inspired by [Flora AI](https://florafauna.ai), featuring:
- Clean glassmorphism effects
- Infinite intelligent canvas metaphor
- Smooth animations with Framer Motion
- Professional typography (Inter/Geist Sans)

### Technical Innovation
Unlike traditional graph analysis tools (InfraNodus, NetworkX), Cognitive Canvas uses **LLM inference** instead of mathematical graph algorithms:
- Semantic node identification via prompt engineering
- Structural gap detection through AI reasoning
- Discourse analysis without traditional NLP pipelines

## 🧠 How It Works

1. **Input**: User enters an LLM prompt
2. **Analysis**: Google Gemini analyzes the prompt structure:
   - Identifies semantic nodes (intent, constraints, persona, knowledge)
   - Detects relationships between concepts
   - Finds structural gaps (missing logic/concepts)
   - Scores complexity and discourse type
3. **Visualization**: Graph rendered on infinite canvas:
   - Solid nodes for explicit concepts
   - Ghost nodes for implicit gaps
   - Interactive edges showing relationships
4. **Interaction**:
   - Click nodes to expand connections
   - Hover for explanations
   - Materialize ghost nodes to solidify concepts

## 📊 Analysis Metrics

- **Complexity Score**: 0-100 rating of prompt sophistication
- **Discourse Type**:
  - **Focused**: Clear single goal, tight coherence
  - **Dispersed**: Multiple unconnected goals
  - **Biased**: Over-emphasis on one aspect
- **Node Breakdown**: Count of intents, constraints, personas, knowledge nodes
- **Structural Gaps**: Missing concepts that would improve the prompt

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Canvas**: React Flow (@xyflow/react)
- **State**: Zustand
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📝 Scripts

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
npm run type-check  # Run TypeScript type checking
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import to Vercel
3. Add `GOOGLE_API_KEY` environment variable
4. Deploy

### Alternative Platforms

- **Netlify**: Install `@netlify/plugin-nextjs`
- **Railway/Render**: Ensure Node.js 18+ runtime

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_API_KEY` | Google Gemini API key | Yes |

## 🤝 Contributing

This is an experimental project exploring LLM-driven graph analysis. Contributions welcome!

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Project memory and architecture
- [DEVLOG.md](./DEVLOG.md) - Development decisions and learnings

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Visual design inspired by [Flora AI](https://florafauna.ai)
- Theoretical framework inspired by [InfraNodus](https://infranodus.com)
- Powered by [Google Gemini](https://ai.google.dev)
