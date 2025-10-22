import { GraphState } from '../state/GraphState';
import OpenAI from 'openai';

export async function llmNode(
  state: GraphState,
  onChunk?: (chunk: string) => void
): Promise<GraphState> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not set');
  }

  const openai = new OpenAI({ apiKey });

  console.log(`[LangGraph] Calling OpenAI with model gpt-4o-mini`);

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: state.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
      temperature: 0.9,
      max_tokens: 500,
    });

    let fullResponse = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        
        if (onChunk) {
          onChunk(content);
        }
        
        await new Promise((resolve) => setTimeout(resolve, 30));
      }
    }

    state.addMessage('assistant', fullResponse);

    console.log(`[LangGraph] Response generated: ${fullResponse.length} chars`);

    return state;
  } catch (error) {
    console.error('[LangGraph] OpenAI error:', error);
    throw error;
  }
}
