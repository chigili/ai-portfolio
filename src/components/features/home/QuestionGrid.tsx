'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CircleEllipsis } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';
import { QuestionButton } from '@/components/ui/shared/QuestionButton';
import { AnimatedChevron } from '@/components/ui/shared/AnimatedChevron';
import { MenuDrawer } from '@/components/ui/shared/MenuDrawer';
import { useQuestions } from '@/hooks/useQuestions';
import { useDrawer } from '@/hooks/useDrawer';
import { useAnimation } from '@/hooks/useAnimation';
import { useNavigation } from '@/hooks/useNavigation';

export const QuestionGrid = () => {
  const [input, setInput] = useState('');
  const { questionConfig, handleQuestionClick, handleDirectQuestionClick } = useQuestions();
  const { isOpen: showDrawer, open: openDrawer, close: closeDrawer } = useDrawer();
  const { heroAnimationVariants } = useAnimation();
  const { goToChat } = useNavigation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) goToChat(input.trim());
  };

  const visibleQuestions = questionConfig.slice(0, 4);
  const contactQuestion = questionConfig.find(q => q.key === 'Contact');
  const menuQuestion = questionConfig.find(q => q.isMenu);

  return (
    <motion.div
      variants={heroAnimationVariants.bottomElement}
      initial="hidden"
      animate="visible"
      className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
    >
      {/* Free-form question input */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
        <div className="mx-auto flex items-center rounded-full border border-neutral-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about my data engineering experience…"
            className="w-full border-none bg-transparent text-base text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Submit question"
            className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Quick-question grid */}
      <div className="mt-4 flex w-full max-w-4xl justify-center">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {visibleQuestions.map((config) => (
            <QuestionButton
              key={config.key}
              onClick={() => handleQuestionClick(config.key)}
              icon={config.icon}
              color={config.color}
              label={config.key}
              variant="home"
            />
          ))}
          
          {/* Contact + Menu buttons grouped together */}
          <div className="flex gap-2">
            {contactQuestion && (
              <QuestionButton
                onClick={() => handleQuestionClick('Contact')}
                icon={contactQuestion.icon}
                color={contactQuestion.color}
                label="Contact"
                variant="home"
                className="flex-1"
              />
            )}
            
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={openDrawer}
                    variant="outline"
                    className="border-border hover:bg-border/30 aspect-square w-16 cursor-pointer rounded-2xl border bg-white/30 py-8 shadow-none backdrop-blur-lg active:scale-95 md:p-10 md:w-20"
                  >
                    <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
                      <CircleEllipsis 
                        size={22} 
                        strokeWidth={2} 
                        color={menuQuestion?.color || '#6B7280'} 
                      />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <AnimatedChevron />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Menu Drawer */}
      <MenuDrawer
        isOpen={showDrawer}
        onClose={closeDrawer}
        onQuestionClick={handleDirectQuestionClick}
        variant="modal"
      />
    </motion.div>
  );
};