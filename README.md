# WebSocket Chat with AI Personas

A real-time chat application built with Next.js, Socket.IO, and OpenAI, featuring AI assistants with unique personalities.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green)

## Features

- **Private Chats** - Direct messaging between users
- **AI Assistant** - Chat with AI featuring 6 unique personalities
- **Character Personas** - Choose between Einstein, Sherlock Holmes, Tony Stark, Shakespeare, Elon Musk, and more
- **Streaming Responses** - See AI typing responses letter by letter
- **Real-time Status** - Live online user list
- **LangGraph Architecture** - Modular AI conversation system

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/mikamika06/websocket-chat.git
cd websocket-chat

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Add your OpenAI API key to .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
PORT=3000
```

## Architecture

### Tech Stack

- **Next.js 15** - React framework with App Router
- **Socket.IO 4.8** - Real-time WebSocket communication
- **OpenAI GPT-4o-mini** - AI language model ($0.15/$0.60 per 1M tokens)
- **LangGraph** - Custom conversation graph architecture
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling

### Project Structure

```
├── app/
│   ├── page.tsx              # Main chat UI
│   └── api/assistant/        # AI API endpoint
├── components/
│   ├── ChatMessage.tsx       # Message component
│   ├── ChatInput.tsx         # Input field
│   └── PersonaSelector.tsx   # Character selector
├── hooks/
│   └── useSocket.ts          # WebSocket React hook
├── lib/langgraph/            # LangGraph AI system
│   ├── agents/personas.ts    # AI character definitions
│   ├── graphs/               # Conversation graphs
│   ├── nodes/                # Graph processing nodes
│   ├── state/                # Conversation state
│   └── streaming/            # Real-time streaming
└── server.js                 # Custom Node.js + Socket.IO server
```

### LangGraph Flow

The AI system uses a 4-node processing graph:

1. **Initialize** - Set character persona
2. **Process** - Handle user input
3. **LLM** - Call OpenAI with streaming
4. **Finalize** - Complete response

```typescript
// Example: Einstein persona
state → initializeNode → processInputNode → llmNode → finalizeNode → response
```

## Usage

### Basic Chat

1. **Enter your name** to join the chat
2. **Select a chat:**
    - **Assistant** - AI chat (choose persona)
    - **User** - Private chat with another user
3. **Start chatting** - Messages appear in real-time

### AI Assistant

1. Click on **Assistant** in the sidebar
2. Use the dropdown menu to select a persona
3. Ask questions and watch the AI respond with character-specific personality

### Private Messages

1. Click on any online user in the sidebar
2. Send private messages that only you and that user can see
3. Each user has a separate chat history

## Features in Detail

### Character Personas

Each AI persona has:
- **Unique personality** - Distinct speaking style and approach
- **Expert knowledge** - Specialized areas of expertise
- **Custom prompts** - Tailored system instructions
- **Consistent behavior** - Maintains character throughout conversation

### Real-time Features

- **Live user list** - See who's online instantly
- **Streaming responses** - Watch AI "type" responses
- **Instant messaging** - Messages appear immediately
- **Connection status** - Visual indicators for connection state

## Development

### Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Performance

- **Streaming responses** - ~30ms delay between characters
- **Real-time messaging** - <100ms latency
- **AI response time** - 1-3 seconds (depending on OpenAI)

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Socket.IO](https://socket.io/) - Real-time communication
- [OpenAI](https://openai.com/) - AI language models
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework



