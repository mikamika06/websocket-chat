/**
 * Streaming service for Socket.IO integration
 */

interface SocketIO {
  emit(event: string, data: any): void;
}

export class StreamingService {
  private io: SocketIO | null = null;

  setIO(io: SocketIO) {
    this.io = io;
  }

  startTyping(messageId: string, username: string, topic: string) {
    if (this.io) {
      this.io.emit('assistant-typing-start', {
        messageId,
        username,
        topic,
      });
      console.log(`[Streaming] Started typing: ${username}`);
    }
  }

  sendChunk(messageId: string, chunk: string, username: string) {
    if (this.io) {
      this.io.emit('assistant-typing-chunk', {
        messageId,
        chunk,
        username,
      });
    }
  }

  endTyping(messageId: string, username: string, fullText: string) {
    if (this.io) {
      this.io.emit('assistant-typing-end', {
        messageId,
        username,
        fullText,
        timestamp: Date.now(),
      });
      console.log(`[Streaming] Ended typing: ${username}`);
    }
  }

  sendError(messageId: string, error: string, username?: string) {
    if (this.io) {
      this.io.emit('assistant-error', {
        messageId,
        error,
        username,
      });
      console.error(`[Streaming] Error: ${error}`);
    }
  }
}

export const streamingService = new StreamingService();
