'use client';

import FluidCursor from '@/components/FluidCursor';
import { Button } from '@/components/ui/button';
import { GithubButton } from '@/components/ui/github-button';
import WelcomeModal from '@/components/welcome-modal';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Layers,
  UserRoundSearch,
  Award,
  Mail,
} from 'lucide-react';
import { SiMedium } from 'react-icons/si';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/* ---------- quick-question data ---------- */
const questions = {
  About: 'Tell me about your background and who you are.',
  Experience: 'Show me your professional gaming industry experience and career journey.',
  Projects: 'Show me your data engineering projects and machine learning work at Amazon Games.',
  Skills: 'What are your technical skills and expertise in data engineering and AI?',
  Contact: 'How can I reach out to discuss data engineering opportunities?',
} as const;

const questionConfig = [
  { key: 'About', color: '#329696', icon: UserRoundSearch },
  { key: 'Experience', color: '#4F46E5', icon: Award },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Contact', color: '#C19433', icon: Mail },
] as const;

/* ---------- component ---------- */
export default function Home() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const goToChat = (query: string) =>
    router.push(`/chat?query=${encodeURIComponent(query)}`);

  /* hero animations (unchanged) */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };
  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  useEffect(() => {
    // Précharger les assets du chat en arrière-plan
    const img = new window.Image();
    img.src = '/landing-memojis.png';

    // Précharger les vidéos aussi
    const linkWebm = document.createElement('link');
    linkWebm.rel = 'preload'; // Note: prefetch au lieu de preload
    linkWebm.as = 'video';
    linkWebm.href = '/final_memojis.webm';
    document.head.appendChild(linkWebm);

    const linkMp4 = document.createElement('link');
    linkMp4.rel = 'prefetch';
    linkMp4.as = 'video';
    linkMp4.href = '/final_memojis_ios.mp4';
    document.head.appendChild(linkMp4);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20" style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)' }}>
      {/* big blurred footer word */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-neutral-500/20 to-neutral-500/5 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: '-2.5rem' }}
        >
          chigili
        </div>
      </div>

      {/* GitHub button and Blog button */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-2">
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
        
        <GithubButton
          //targetStars={68}
          animationDuration={1.5}
          label="Star"
          size={'sm'}
          repoUrl="https://github.com/YOUR_USERNAME/ai-portfolio"
        />
      </div>

      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={() => goToChat('Are you open to new data engineering opportunities?')}
          className="relative flex cursor-pointer items-center gap-2 rounded-full border bg-white/30 px-4 py-1.5 text-sm font-medium text-black shadow-md backdrop-blur-lg transition hover:bg-white/60 dark:border-white dark:text-white dark:hover:bg-neutral-800"
        >
          {/* Green pulse dot */}
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          Hiring Data Engineers?
        </button>
      </div>

      {/* header */}
      <motion.div
        className="z-1 mt-24 mb-8 flex flex-col items-center text-center md:mt-4 md:mb-12"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-secondary-foreground mt-1 text-3xl font-semibold md:text-4xl lg:text-5xl">
          Hi! I'm <span className="font-bold">Sai Krishna Chaitanya Chigili</span> 👋
        </h2>
        <div className="mt-4 max-w-2xl">
          <h1 className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300 sm:text-xl md:text-2xl text-center">
            Welcome to My Portfolio ⚡ Load-balanced between technical depth and human charm!
          </h1>
        </div>
      </motion.div>

      {/* centre avatar */}
      <div className="relative z-10 h-52 w-48 overflow-hidden rounded-full sm:h-72 sm:w-72">
        <Image
          src="/avatar_hi.jpg"
          alt="Sai Krishna Chaitanya Chigili Avatar"
          width={400}
          height={400}
          priority
          className="object-cover w-full h-full"
        />
      </div>

      {/* input + quick buttons */}
      <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
      >
        {/* free-form question */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) goToChat(input.trim());
          }}
          className="relative w-full max-w-lg"
        >
          <div className="mx-auto flex items-center rounded-full border border-neutral-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
            <input
              ref={inputRef}
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
              <ArrowRight  className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* quick-question grid */}
        <div className="mt-4 flex w-full max-w-4xl justify-center">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
          {questionConfig.map(({ key, color, icon: Icon }) => (
            <Button
              key={key}
              onClick={() => goToChat(questions[key])}
              variant="outline"
              className="border-border hover:bg-border/30 aspect-square w-full cursor-pointer rounded-2xl border bg-white/30 py-8 shadow-none backdrop-blur-lg active:scale-95 md:p-10"
            >
              <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
                <Icon size={22} strokeWidth={2} color={color} />
                <span className="text-xs font-medium sm:text-sm">{key}</span>
              </div>
            </Button>
          ))}
          </div>
        </div>
      </motion.div>
      <FluidCursor />
    </div>
  );
}
