# Expo AI Conversational Agent

A cross-platform mobile app featuring **text and voice conversations** powered by [Vercel AI SDK](https://sdk.vercel.ai/), built with React Native and Expo SDK 54.x.

## Features

- **Text & Voice Conversations** - Seamless text and voice-based interactions with AI
- **React Native Reusable UI** - Modern, reusable components built with NativeWind/Tailwind CSS
- **Vercel AI SDK Integration** - Streaming responses and real-time AI interactions
- **Cross-Platform** - Works on iOS, Android, and Web
- **Suggested Actions** - Context-aware action suggestions
- **Image Attachments** - Send images in conversations
- **Markdown Support** - Rich text formatting in messages
- **NestJS Backend** - Robust server with AI agent endpoints

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- Expo CLI

### Installation

1. **Install dependencies**

```bash
cd app
pnpm install
```

2. **Start the Expo app**

```bash
pnpx expo start
```

3. **Run the server** (in a separate terminal)

```bash
cd server
pnpm install
pnpm run start:dev
```

## Project Structure

- `/app` - Expo React Native application
- `/server` - NestJS backend with AI agent services

For more details, see:
- [Expo App README](./app/README.md)
- [Server README](./server/README.md)

