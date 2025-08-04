import { tool } from 'ai';
import { z } from 'zod';

export const getAbout = tool({
  description:
    'This tool returns the complete personal story and background of Sai Krishna Chaitanya Chigili, including his personality, work, and interests',
  parameters: z.object({}),
  execute: async () => {
    return {
      aboutContent: `# The Data Whisperer of Amazon Games

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

*Currently accepting new challenges, data puzzles, and recommendations for the best ramen spots in Seattle.*`
    };
  },
});