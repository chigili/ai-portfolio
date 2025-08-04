import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';
import { SYSTEM_PROMPT } from './prompt';
import { getContact } from '@/services/portfolio/tools/getContact';
import { getProjects } from '@/services/portfolio/tools/getProjects';
import { getResume } from '@/services/portfolio/tools/getResume';
import { getSkills } from '@/services/portfolio/tools/getSkills';
import { getGamingExperience } from '@/services/portfolio/tools/getGamingExperience';
import { getDataViz } from '@/services/portfolio/tools/getDataViz';
import { getAbout } from '@/services/portfolio/tools/getAbout';

export const maxDuration = 30;
// Disable static generation and caching for chat API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ❌ Pas besoin de l'export ici, Next.js n'aime pas ça
function errorHandler(error: unknown) {
  if (error == null) {
    return 'Unknown error';
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    messages.unshift(SYSTEM_PROMPT);

    const tools = {
      getProjects,
      getResume,
      getContact,
      getSkills,
      getGamingExperience,
      getDataViz,
      getAbout,
    };

    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      messages,
      tools,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (err) {
    console.error('Global error:', err);
    const errorMessage = errorHandler(err);
    return new Response(errorMessage, { status: 500 });
  }
}
