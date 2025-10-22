import { GraphState } from '../state/GraphState';
import { PERSONAS } from '../agents/personas';

export async function initializeNode(state: GraphState): Promise<GraphState> {
  const persona = PERSONAS[state.topic] || PERSONAS.General;
  
  state.persona = persona.name;
  
  state.addMessage('system', persona.systemPrompt);
  
  console.log(`[LangGraph] Initialized with persona: ${persona.name}`);
  
  return state;
}
