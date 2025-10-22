import { GraphState } from '../state/GraphState';


export async function finalizeNode(state: GraphState): Promise<GraphState> {
  console.log(`[LangGraph] Finalizing conversation`);
  
  state.streaming = false;
  
  // add:
  // - Logging to database
  // - Analytics
  // - Post-processing
  
  return state;
}
