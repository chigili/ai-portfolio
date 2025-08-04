'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface AboutStoryProps {
  data?: {
    aboutContent?: string;
  };
}

export default function AboutStory({ data }: AboutStoryProps) {
  const content = data?.aboutContent || `# The Data Whisperer of Amazon Games

Meet **Sai Krishna Chaitanya Chigili** – a name so epic it could be the protagonist of a fantasy RPG, but instead of wielding legendary swords, he commands SQL queries and machine learning models with equal finesse.

Currently stationed at Amazon Games in the coffee-fueled kingdom of Seattle, WA, Sai occupies that mystical intersection where Data Engineering meets AI/ML – a place most mortals fear to tread, but where he thrives like a caffeinated wizard casting \`SELECT * FROM awesome_insights\`.

## The Game Master's Portfolio

Sai's resume reads like a greatest hits album of gaming:
- **Call of Duty Mobile** (because someone needs to track all those headshots)
- **Throne and Liberty** (liberating data from chaos)
- **Lost Ark** (finding treasure in terabytes)
- **New World** (pioneering new frontiers in data pipelines)
- **King of Meat** (presumably the most deliciously data-driven title ever)

And that's just the beginning – with more upcoming titles in his arsenal than a Steam sale wishlist.

## Full-Stack Data Sorcery

Like a true Renaissance technologist, Sai masters the complete data lifecycle:
- **Data Ingestion**: Vacuum-cleaning the internet, one API at a time
- **ETL**: Extract, Transform, and Launch (data into the stratosphere)
- **Analytics**: Turning numbers into narratives
- **Data Visualization**: Making spreadsheets sexier than they have any right to be
- **Stakeholder Presentations**: Translating "machine learning gibberish" into "executive-friendly English"

## When Not Debugging Life

When he's not wrestling with distributed systems or teaching neural networks new tricks, Sai channels his inner warrior through:

**🥋 Judo** – Because sometimes you need to throw problems to the ground before you can solve them

**📸 Photography** – Capturing moments with the same precision he applies to capturing data anomalies

**💻 Creative Programming** – Where art meets algorithms, and beautiful code becomes beautiful... code

## The Bottom Line

In a world where data is the new oil, Sai Krishna Chaitanya Chigili is your friendly neighborhood refinery operator – turning raw digital crude into premium insights that power some of the world's most addictive gaming experiences. Based in Seattle, fueled by passion, and armed with an arsenal of data tools, he's proof that you can be both a data scientist and have a life outside of Jupyter notebooks.

*Currently accepting new challenges, data puzzles, and recommendations for the best ramen spots in Seattle.*`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto py-8 px-6"
    >
      {/* Profile Image Section */}
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-lg"
        >
          <Image
            src="/profile-sai.png"
            alt="Sai Krishna Chaitanya Chigili"
            fill
            className="object-cover object-center"
            priority
          />
        </motion.div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-3xl md:text-4xl font-bold mb-6 text-black dark:text-white">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl md:text-3xl font-semibold mt-8 mb-4 text-black dark:text-white">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-base md:text-lg">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-2 mb-6 ml-4">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-purple-500 mt-1">•</span>
                <span>{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </strong>
            ),
            code: ({ children }) => (
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-700 dark:text-gray-300">
                {children}
              </code>
            ),
            em: ({ children }) => (
              <em className="italic text-gray-600 dark:text-gray-400">
                {children}
              </em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}