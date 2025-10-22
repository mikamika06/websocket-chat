import { NextResponse } from 'next/server';
import { GraphFactory } from '@/lib/langgraph/graphs/GraphFactory';
import { streamingService } from '@/lib/langgraph/streaming/StreamingService';
import { TopicType } from '@/lib/langgraph/types';

type AssistantRequest = {
    username: string;
    text: string;
    topic: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as AssistantRequest;
        const { username, text, topic } = body;

        if (!text || !topic) {
            return NextResponse.json(
                { ok: false, error: 'Missing text or topic' },
                { status: 400 }
            );
        }

        const messageId = Math.random().toString(36).substring(7);

        const io = (globalThis as { io?: any }).io;
        if (io) {
            streamingService.setIO(io);
        }

        (async () => {
            let currentPersona = 'Assistant';

            try {
                streamingService.startTyping(messageId, currentPersona, topic);

                const { response, persona } = await GraphFactory.executeGraph(
                    topic as TopicType,
                    username,
                    text,
                    messageId,
                    (chunk: string, personaName?: string) => {
                        if (personaName) {
                            currentPersona = personaName;
                        }
                        streamingService.sendChunk(messageId, chunk, currentPersona);
                    }
                );

                streamingService.endTyping(messageId, persona, response);
            } catch (error) {
                const err = error as Error;
                console.error('[Assistant API] Error:', err);
                streamingService.sendError(messageId, err.message, currentPersona);
            }
        })();

        return NextResponse.json({ ok: true, messageId });
    } catch (err: unknown) {
        const error = err as Error;
        console.error('[Assistant API] Request error:', error);
        return NextResponse.json(
            { ok: false, error: error.message },
            { status: 500 }
        );
    }
}
