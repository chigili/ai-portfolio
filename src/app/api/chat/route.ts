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

/**
 * Enhanced error handler for Claude API failures
 * Provides user-friendly messages for common error scenarios
 */
function errorHandler(error: unknown): string {
  if (error == null) {
    return 'An unexpected error occurred. Please try again.';
  }
  
  if (typeof error === 'string') {
    return parseErrorMessage(error);
  }
  
  if (error instanceof Error) {
    return parseErrorMessage(error.message);
  }
  
  // Handle structured error objects
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    
    // Handle Anthropic API specific errors
    if (errorObj.error?.type) {
      return handleAnthropicError(errorObj.error);
    }
    
    // Handle HTTP errors
    if (errorObj.status) {
      return handleHttpError(errorObj.status, errorObj.message || errorObj.statusText);
    }
    
    // Extract message from error object
    if (errorObj.message) {
      return parseErrorMessage(errorObj.message);
    }
  }
  
  console.error('Unhandled error structure:', error);
  return 'A technical error occurred. Please try again in a moment.';
}

/**
 * Parse error message for specific patterns and provide user-friendly responses
 */
function parseErrorMessage(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Credit/quota exhaustion patterns
  if (lowerMessage.includes('credit') || 
      lowerMessage.includes('quota') || 
      lowerMessage.includes('usage limit') ||
      lowerMessage.includes('insufficient funds') ||
      lowerMessage.includes('billing')) {
    return 'Claude is experiencing high demand (success!). While my AI twin takes a power nap, the original human version is still online and ready to chat! 🚀 Please use the contact form below.';
  }
  
  // Rate limiting
  if (lowerMessage.includes('rate limit') || 
      lowerMessage.includes('too many requests') ||
      lowerMessage.includes('429')) {
    return 'I\'m getting a lot of questions right now! Please wait a moment and try again.';
  }
  
  // Authentication issues
  if (lowerMessage.includes('unauthorized') || 
      lowerMessage.includes('authentication') ||
      lowerMessage.includes('invalid api key') ||
      lowerMessage.includes('401')) {
    return 'There\'s a configuration issue on my end. Please use the contact form to reach out directly.';
  }
  
  // Network/connectivity issues
  if (lowerMessage.includes('network') || 
      lowerMessage.includes('connection') ||
      lowerMessage.includes('timeout') ||
      lowerMessage.includes('fetch')) {
    return 'I\'m having trouble connecting right now. Please check your internet connection and try again.';
  }
  
  // Server errors
  if (lowerMessage.includes('500') || 
      lowerMessage.includes('server error') ||
      lowerMessage.includes('internal error')) {
    return 'I\'m experiencing some technical difficulties. Please try again in a few minutes.';
  }
  
  // Service unavailable
  if (lowerMessage.includes('503') || 
      lowerMessage.includes('service unavailable') ||
      lowerMessage.includes('temporarily unavailable')) {
    return 'I\'m temporarily down for maintenance. Please try again shortly.';
  }
  
  // Default fallback with original message (cleaned up)
  return `Something went wrong: ${message.length > 100 ? message.substring(0, 100) + '...' : message}`;
}

/**
 * Handle Anthropic-specific API errors
 */
function handleAnthropicError(error: any): string {
  switch (error.type) {
    case 'authentication_error':
      return 'There\'s an authentication issue. Please contact me directly using the contact form.';
    
    case 'permission_error':
      return 'I don\'t have permission to process this request. Please try again or contact me directly.';
    
    case 'not_found_error':
      return 'The AI service is temporarily unavailable. Please try again later.';
    
    case 'rate_limit_error':
      return 'I\'m receiving too many requests right now. Please wait a moment and try again.';
    
    case 'api_error':
      if (error.message && error.message.toLowerCase().includes('credit')) {
        return 'Claude is experiencing high demand (success!). While my AI twin takes a power nap, the original human version is still online and ready to chat! 🚀 Please use the contact form below.';
      }
      return 'I\'m experiencing technical difficulties. Please try again in a few minutes.';
    
    case 'overloaded_error':
      return 'I\'m a bit overloaded right now. Please try again in a moment.';
    
    default:
      return error.message || 'An unexpected error occurred with the AI service.';
  }
}

/**
 * Handle HTTP status code errors
 */
function handleHttpError(status: number, message?: string): string {
  switch (status) {
    case 400:
      return 'There was an issue with your request. Please try rephrasing your question.';
    case 401:
      return 'Authentication issue detected. Please contact me directly using the contact form.';
    case 403:
      return 'Access denied. Please contact me directly for assistance.';
    case 404:
      return 'Service not found. Please try again later.';
    case 429:
      return 'Too many requests. Please wait a moment before trying again.';
    case 500:
      return 'I\'m experiencing server issues. Please try again in a few minutes.';
    case 503:
      return 'I\'m temporarily unavailable for maintenance. Please try again shortly.';
    default:
      return message || `Service error (${status}). Please try again later.`;
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log('[CHAT-API] Incoming messages:', messages);

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error('[CHAT-API] Invalid messages format:', messages);
      return new Response(
        errorHandler('Invalid message format. Please refresh and try again.'), 
        { status: 400 }
      );
    }

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

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[CHAT-API] Missing ANTHROPIC_API_KEY environment variable');
      return new Response(
        errorHandler('Chat service is not properly configured. Please contact me directly using the contact form.'),
        { status: 503 }
      );
    }

    console.log('[CHAT-API] Initiating Claude API request...');
    
    const result = streamText({
      model: anthropic('claude-sonnet-4-20250514'),
      messages,
      tools,
    });

    return result.toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (err) {
    // Enhanced error logging
    console.error('[CHAT-API] Global error occurred:', {
      error: err,
      errorType: typeof err,
      errorName: err instanceof Error ? err.name : 'Unknown',
      errorMessage: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      timestamp: new Date().toISOString(),
    });
    
    const errorMessage = errorHandler(err);
    
    // Determine appropriate status code
    let statusCode = 500;
    if (err instanceof Error) {
      const message = err.message.toLowerCase();
      if (message.includes('unauthorized') || message.includes('authentication')) {
        statusCode = 401;
      } else if (message.includes('rate limit') || message.includes('too many requests')) {
        statusCode = 429;
      } else if (message.includes('quota') || message.includes('credit')) {
        statusCode = 503; // Service Unavailable due to quota
      }
    }
    
    return new Response(errorMessage, { 
      status: statusCode,
      headers: {
        'Content-Type': 'text/plain',
        'X-Error-Type': 'chat-api-error',
      }
    });
  }
}
