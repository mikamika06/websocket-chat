import { ConversationGraph } from './ConversationGraph';
import { TopicType } from '../types';

/**
 * Graph factory - creates appropriate graph based on topic
 */

export class GraphFactory {
  private static graphs: Map<TopicType, ConversationGraph> = new Map();

  static getGraph(topic: TopicType): ConversationGraph {
    
    if (!this.graphs.has(topic)) {
      this.graphs.set(topic, new ConversationGraph());
    }

    return this.graphs.get(topic)!;
  }

  static async executeGraph(
    topic: TopicType,
    username: string,
    message: string,
    messageId: string,
    onChunk?: (chunk: string, persona?: string) => void
  ): Promise<{ response: string; persona: string }> {
    const graph = this.getGraph(topic);
    return graph.run(topic, username, message, messageId, onChunk);
  }
}
