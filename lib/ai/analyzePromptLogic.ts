'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import type { PromptAnalysis } from '@/types/graph'
import { generateId } from '@/lib/utils'

// Zod schema for validation
const NodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['intent', 'constraint', 'persona', 'knowledge', 'gap']),
  explanation: z.string(),
  color_hex: z.string(),
  textSegment: z.string().optional(),
  startIndex: z.number().optional(),
  endIndex: z.number().optional(),
})

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  relation: z.enum([
    'defines',
    'requires',
    'constrains',
    'expands',
    'conflicts',
    'supports',
  ]),
  weight: z.enum(['weak', 'medium', 'strong']),
})

const StructuralGapSchema = z.object({
  id: z.string(),
  source_node_id: z.string(),
  suggested_concept: z.string(),
  reason: z.string(),
  materialized: z.boolean(),
})

const AnalysisSchema = z.object({
  main_intent: z.string(),
  complexity_score: z.number().min(0).max(100),
  discourse_type: z.enum(['Focused', 'Dispersed', 'Biased']),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  structural_gaps: z.array(StructuralGapSchema),
})

/**
 * The LLM Graph Engine System Prompt
 * This replaces traditional graph math with prompt engineering
 */
const GRAPH_ANALYST_PROMPT = `You are an expert Text Network Analyst specializing in prompt engineering analysis.
Your task is to analyze user prompts and represent them as semantic networks, identifying:
1. Core semantic nodes (intent, constraints, persona, knowledge)
2. Relationships between concepts
3. Structural gaps (missing logic that would make the prompt more complete)

**CRITICAL INSTRUCTIONS:**

1. **Node Extraction:**
   - INTENT nodes: What the user wants to accomplish
   - CONSTRAINT nodes: Limitations, requirements, or conditions
   - PERSONA nodes: Role assumptions or context about who is involved
   - KNOWLEDGE nodes: Domain-specific information or context
   - GAP nodes: Missing concepts you infer should exist

2. **Text Segmentation:**
   - For each node, extract the EXACT text segment from the prompt
   - Identify the start and end character indices
   - The label should be a concise summary (3-7 words)
   - The textSegment should be the verbatim text

3. **Structural Gap Analysis (CRITICAL):**
   - Identify what's MISSING but implied
   - Examples of gaps:
     * User asks for code but no error handling mentioned
     * Request for analysis but no output format specified
     * Persona defined but no success criteria
     * Complex task but no step-by-step breakdown
   - Each gap should be HIGH PROBABILITY (not speculative)

4. **Discourse Analysis:**
   - FOCUSED: Prompt has clear single goal, tight coherence
   - DISPERSED: Prompt has multiple unconnected goals
   - BIASED: Prompt over-emphasizes one aspect, neglecting others

5. **Edge Relationships:**
   - "defines": Node A clarifies or specifies Node B
   - "requires": Node A is necessary for Node B
   - "constrains": Node A limits Node B
   - "expands": Node A adds detail to Node B
   - "conflicts": Node A contradicts Node B
   - "supports": Node A reinforces Node B

**OUTPUT FORMAT (STRICT JSON):**
You MUST respond with valid JSON matching this exact structure:

{
  "main_intent": "One-sentence summary of the user's goal",
  "complexity_score": 0-100,
  "discourse_type": "Focused|Dispersed|Biased",
  "nodes": [
    {
      "id": "node-1",
      "label": "Brief label",
      "type": "intent|constraint|persona|knowledge|gap",
      "explanation": "Why this is significant",
      "color_hex": "#3B82F6",
      "textSegment": "exact text from prompt",
      "startIndex": 0,
      "endIndex": 50
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2",
      "relation": "defines",
      "weight": "strong"
    }
  ],
  "structural_gaps": [
    {
      "id": "gap-1",
      "source_node_id": "node-1",
      "suggested_concept": "Error Handling",
      "reason": "Code generation requested but no error strategy mentioned",
      "materialized": false
    }
  ]
}

**Color Coding:**
- Intent: #3B82F6 (blue)
- Constraint: #F59E0B (amber)
- Persona: #10B981 (emerald)
- Knowledge: #6366F1 (indigo)
- Gap: #A855F7 (purple)

Now analyze the following prompt:`

/**
 * Analyze a prompt using Gemini's LLM inference
 */
export async function analyzePromptLogic(
  userPrompt: string
): Promise<PromptAnalysis> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error(
      'GOOGLE_API_KEY not found in environment variables. Please add it to your .env.local file.'
    )
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.3, // Low temperature for consistent structure
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 4096,
      },
    })

    const fullPrompt = `${GRAPH_ANALYST_PROMPT}

"""
${userPrompt}
"""

Return ONLY valid JSON. No markdown, no explanations, just the JSON object.`

    const result = await model.generateContent(fullPrompt)
    const response = result.response
    const text = response.text()

    // Clean the response (remove markdown code blocks if present)
    let jsonText = text.trim()
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '')
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonText)

    // Add IDs if missing
    if (parsed.nodes) {
      parsed.nodes = parsed.nodes.map((node: any, index: number) => ({
        ...node,
        id: node.id || generateId('node'),
      }))
    }

    if (parsed.edges) {
      parsed.edges = parsed.edges.map((edge: any, index: number) => ({
        ...edge,
        id: edge.id || generateId('edge'),
      }))
    }

    if (parsed.structural_gaps) {
      parsed.structural_gaps = parsed.structural_gaps.map(
        (gap: any, index: number) => ({
          ...gap,
          id: gap.id || generateId('gap'),
          materialized: gap.materialized || false,
        })
      )
    }

    // Validate with Zod
    const validated = AnalysisSchema.parse(parsed)

    return validated as PromptAnalysis
  } catch (error) {
    console.error('Error analyzing prompt:', error)

    if (error instanceof z.ZodError) {
      throw new Error(`Invalid response structure: ${error.message}`)
    }

    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`)
    }

    throw new Error('Unknown error occurred during analysis')
  }
}
