'use client';
import { useChat } from '@ai-sdk/react';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
// import { motionConfig } from '@/lib';

// Component imports
import ChatBottombar from './chat-bottombar';
import ChatLanding from './chat-landing';
import ChatMessageContent from './chat-message-content';
import { SimplifiedChatView } from './simple-chat-view';
import {
  ChatBubble,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble';
import WelcomeModal from '../../shared/welcome-modal';
import { Info } from 'lucide-react';
import { SiMedium } from 'react-icons/si';
import { GithubButton } from '../../ui/github-button';
import HelperBoost from './HelperBoost';

/**
 * Convert technical error messages to user-friendly messages
 * This provides a fallback if the backend error handler doesn't catch everything
 */
function getUserFriendlyErrorMessage(message: string): string {
  if (!message) return 'Something went wrong. Please try again.';
  
  const lowerMessage = message.toLowerCase();
  
  // If the message is already user-friendly (from our backend), use it as-is
  if (lowerMessage.includes('temporarily unavailable') || 
      lowerMessage.includes('contact form') ||
      lowerMessage.includes('try again later') ||
      lowerMessage.includes('please wait') ||
      lowerMessage.includes('ai twin takes a power nap') ||
      lowerMessage.includes('experiencing high demand')) {
    return message;
  }
  
  // Handle common technical error patterns that might slip through
  if (lowerMessage.includes('failed to fetch') || 
      lowerMessage.includes('network error') ||
      lowerMessage.includes('connection')) {
    return 'I\'m having trouble connecting. Please check your internet connection and try again.';
  }
  
  if (lowerMessage.includes('timeout')) {
    return 'The request is taking too long. Please try again.';
  }
  
  if (lowerMessage.includes('400') || lowerMessage.includes('bad request')) {
    return 'There was an issue with your message. Please try rephrasing your question.';
  }
  
  if (lowerMessage.includes('500') || lowerMessage.includes('server')) {
    return 'I\'m experiencing technical difficulties. Please try again in a few minutes.';
  }
  
  // For very long technical messages, truncate them
  if (message.length > 150) {
    return 'I encountered a technical issue. Please try again or contact me directly if the problem persists.';
  }
  
  return message;
}

// ClientOnly component for client-side rendering
interface ClientOnlyProps {
  children: React.ReactNode;
}

const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

/**
 * Props for the Avatar component
 * @interface AvatarProps
 */
interface AvatarProps {
  /** Whether a tool is currently active/executing */
  hasActiveTool: boolean;
  /** Reference to the video element for avatar animation */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Whether the AI is currently speaking/responding */
  isTalking: boolean;
}

// Dynamic import of Avatar component
const Avatar = dynamic<AvatarProps>(
  () =>
    Promise.resolve(({ hasActiveTool, videoRef, isTalking }: AvatarProps) => {
      // This function will only execute on the client
      const isIOS = () => {
        // Multiple detection methods
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const maxTouchPoints = window.navigator.maxTouchPoints || 0;

        // UserAgent-based check
        const isIOSByUA =
          /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;

        // Platform-based check
        const isIOSByPlatform = /iPad|iPhone|iPod/.test(platform);

        // iPad Pro check
        const isIPadOS =
          platform === 'MacIntel' && maxTouchPoints > 1 && !(window as any).MSStream;

        // Safari check
        const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);

        return isIOSByUA || isIOSByPlatform || isIPadOS || isSafari;
      };

      // Conditional rendering based on detection
      return (
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 ${hasActiveTool ? 'h-20 w-20' : 'h-28 w-28'}`}
        >
          <div
            className="relative cursor-pointer"
            onClick={() => (window.location.href = '/')}
          >
            {isIOS() ? (
              <img
                src="/avatar_hi.jpg"
                alt="Sai Avatar"
                className="h-full w-full object-cover rounded-full shadow-lg"
              />
            ) : (
              <video
                ref={videoRef}
                className="h-full w-full object-cover rounded-full shadow-lg border-2 border-white/20"
                muted
                playsInline
                loop
              >
                <source src="/avatar_hi_video.mov" type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      );
    }),
  { ssr: false }
);

// Use centralized motion config
// Removed local MOTION_CONFIG - now using imported motionConfig

/**
 * Main Chat component providing an interactive AI assistant interface.
 * Features include:
 * - Dynamic avatar with video/image fallback
 * - Real-time chat messaging
 * - Tool execution and rendering
 * - Responsive design with mobile support
 * - Auto-submit functionality for query parameters
 * 
 * @returns {JSX.Element} The complete chat interface
 */
const Chat = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query');
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
    append,
  } = useChat({
    onResponse: (response) => {
      if (response) {
        setLoadingSubmit(false);
        setIsTalking(true);
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error('Failed to play video:', error);
          });
        }
      }
    },
    onFinish: () => {
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        // Keep video playing/looping instead of pausing
        videoRef.current.play().catch((error) => {
          console.error('Failed to continue video playback:', error);
        });
      }
    },
    onError: (error) => {
      setLoadingSubmit(false);
      setIsTalking(false);
      if (videoRef.current) {
        // Keep video playing/looping even on errors
        videoRef.current.play().catch((playError) => {
          console.error('Failed to continue video playback after error:', playError);
        });
      }
      
      // Enhanced error logging
      console.error('Chat error details:', {
        message: error.message,
        cause: error.cause,
        type: typeof error,
        error: error,
        timestamp: new Date().toISOString(),
      });
      
      // Display user-friendly error message
      const userMessage = getUserFriendlyErrorMessage(error.message);
      toast.error(userMessage, {
        duration: 6000, // Show longer for error messages
        action: userMessage.includes('contact form') ? {
          label: 'Contact',
          onClick: () => window.location.href = '#contact'
        } : undefined,
      });
    },
    onToolCall: (tool) => {
      const toolName = tool.toolCall.toolName;
      console.log('Tool call:', toolName);
    },
  });

  const { currentAIMessage, latestUserMessage, hasActiveTool } = useMemo(() => {
    const latestAIMessageIndex = messages.findLastIndex(
      (m) => m.role === 'assistant'
    );
    const latestUserMessageIndex = messages.findLastIndex(
      (m) => m.role === 'user'
    );

    const result = {
      currentAIMessage:
        latestAIMessageIndex !== -1 ? messages[latestAIMessageIndex] : null,
      latestUserMessage:
        latestUserMessageIndex !== -1 ? messages[latestUserMessageIndex] : null,
      hasActiveTool: false,
    };

    if (result.currentAIMessage) {
      result.hasActiveTool =
        result.currentAIMessage.parts?.some(
          (part) =>
            part.type === 'tool-invocation' &&
            part.toolInvocation?.state === 'result'
        ) || false;
    }

    if (latestAIMessageIndex < latestUserMessageIndex) {
      result.currentAIMessage = null;
    }

    return result;
  }, [messages]);

  const isToolInProgress = messages.some(
    (m) =>
      m.role === 'assistant' &&
      m.parts?.some(
        (part) =>
          part.type === 'tool-invocation' &&
          part.toolInvocation?.state !== 'result'
      )
  );

  const submitQuery = (query: string) => {
    if (!query.trim() || isToolInProgress) return;
    setLoadingSubmit(true);
    append({
      role: 'user',
      content: query,
    });
  };

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      
      // Set up event listeners to ensure continuous looping
      const handleEnded = () => {
        video.play().catch((error) => {
          console.error('Failed to restart video loop:', error);
        });
      };
      
      const handleLoadedData = () => {
        video.play().catch((error) => {
          console.error('Failed to auto-play video after load:', error);
        });
      };
      
      video.addEventListener('ended', handleEnded);
      video.addEventListener('loadeddata', handleLoadedData);
      
      // Auto-play the video
      video.play().catch((error) => {
        console.error('Failed to auto-play video:', error);
      });
      
      // Cleanup event listeners
      return () => {
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('loadeddata', handleLoadedData);
      };
    }

    if (initialQuery && !autoSubmitted) {
      setAutoSubmitted(true);
      setInput('');
      submitQuery(initialQuery);
    }
    
    // Return empty cleanup if no video ref
    return () => {};
  }, [initialQuery, autoSubmitted]);

  useEffect(() => {
    if (videoRef.current) {
      // Keep video playing regardless of talking state
      videoRef.current.play().catch((error) => {
        console.error('Failed to play video:', error);
      });
    }
  }, [isTalking]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isToolInProgress) return;
    submitQuery(input);
    setInput('');
  };

  const handleStop = () => {
    stop();
    setLoadingSubmit(false);
    setIsTalking(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // Check if this is the initial empty state (no messages)
  const isEmptyState =
    !currentAIMessage && !latestUserMessage && !loadingSubmit;

  // Calculate header height based on hasActiveTool
  const headerHeight = hasActiveTool ? 100 : 180;

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute top-6 right-8 z-51 flex flex-col-reverse items-center justify-center gap-2 md:flex-row">
        {/* Blog Button */}
        <a
          href="https://medium.com/@kc.chigili"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer relative overflow-hidden will-change-transform backface-visibility-hidden transform-gpu transition-transform duration-200 ease-out hover:scale-105 group whitespace-nowrap focus-visible:outline-hidden inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background disabled:pointer-events-none disabled:opacity-60 bg-zinc-950 hover:bg-zinc-900 text-white border-gray-700 dark:bg-zinc-50 dark:border-gray-300 dark:text-zinc-950 dark:hover:bg-zinc-50 h-7 rounded-md px-2.5 gap-1.5 text-xs leading-none"
        >
          <SiMedium className="h-3.5 w-3.5" />
          <span>Blog</span>
        </a>
        
        <div className="">
          <GithubButton
            animationDuration={1.5}
            label="Star"
            size={'sm'}
            repoUrl="https://github.com/YOUR_USERNAME/ai-portfolio"
          />
        </div>
      </div>

      {/* Fixed Avatar Header with Gradient */}
      <div
        className="fixed top-0 right-0 left-0 z-50"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.95) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 100%)',
        }}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${hasActiveTool ? 'pt-6 pb-0' : 'py-6'}`}
        >
          <div className="flex justify-center">
            <ClientOnly>
              <Avatar
                hasActiveTool={hasActiveTool}
                videoRef={videoRef}
                isTalking={isTalking}
              />
            </ClientOnly>
          </div>

          <AnimatePresence>
            {latestUserMessage && !currentAIMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto flex max-w-3xl px-4"
              >
                <ChatBubble variant="sent">
                  <ChatBubbleMessage>
                    <ChatMessageContent
                      message={latestUserMessage}
                      isLast={true}
                      isLoading={false}
                      reload={() => Promise.resolve(null)}
                    />
                  </ChatBubbleMessage>
                </ChatBubble>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex h-full max-w-3xl flex-col">
        {/* Scrollable Chat Content */}
        <div
          className="flex-1 overflow-y-auto px-2"
          style={{ paddingTop: `${headerHeight}px` }}
        >
          <AnimatePresence mode="wait">
            {isEmptyState ? (
              <motion.div
                key="landing"
                className="flex min-h-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ChatLanding submitQuery={submitQuery} />
              </motion.div>
            ) : currentAIMessage ? (
              <div className="pb-4">
                <SimplifiedChatView
                  message={currentAIMessage}
                  isLoading={isLoading}
                  reload={reload}
                  addToolResult={addToolResult}
                />
              </div>
            ) : (
              loadingSubmit && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                  className="px-4 pt-18"
                >
                  <ChatBubble variant="received">
                    <ChatBubbleMessage isLoading />
                  </ChatBubble>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Bottom Bar */}
        <div className="sticky bottom-0 bg-white px-2 pt-3 md:px-0 md:pb-4">
          <div className="relative flex flex-col items-center gap-3">
            <HelperBoost submitQuery={submitQuery} />
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              isToolInProgress={isToolInProgress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
