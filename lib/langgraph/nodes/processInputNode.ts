import { GraphState } from '../state/GraphState';


export async function processInputNode(state: GraphState): Promise<GraphState> {
  const userMessage = state.getLastUserMessage();
  
  if (!userMessage) {
    throw new Error('No user message found');
  }
  
  console.log(`[LangGraph] Processing input from ${state.username}: ${userMessage.substring(0, 50)}...`);
  
  // preprocessing, validation, moderation etc
  
  return state;
}
