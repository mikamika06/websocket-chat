import { GraphState } from '../state/GraphState';
import { initializeNode } from '../nodes/initializeNode';
import { processInputNode } from '../nodes/processInputNode';
import { llmNode } from '../nodes/llmNode';
import { finalizeNode } from '../nodes/finalizeNode';

export class ConversationGraph {
    async run(
        topic: string,
        username: string,
        userMessage: string,
        messageId: string,
        onChunk?: (chunk: string, persona?: string) => void
    ): Promise<{ response: string; persona: string }> {
        console.log(`[ConversationGraph] Starting graph for topic: ${topic}`);

        let state = new GraphState({
            topic,
            username,
            messageId,
            streaming: true,
            messages: [],
        });

        try {
            state = await initializeNode(state);

            state.addMessage('user', userMessage);

            state = await processInputNode(state);

            state = await llmNode(state, (chunk) => {
                if (onChunk) {
                    onChunk(chunk, state.persona);
                }
            });

            state = await finalizeNode(state);

            const assistantMessages = state.messages.filter((m) => m.role === 'assistant');
            const lastResponse = assistantMessages[assistantMessages.length - 1]?.content || '';

            console.log(`[ConversationGraph] Graph completed successfully`);

            return {
                response: lastResponse,
                persona: state.persona,
            };
        } catch (error) {
            console.error('[ConversationGraph] Graph execution failed:', error);
            throw error;
        }
    }
}
