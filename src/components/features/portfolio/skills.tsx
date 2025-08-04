'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Database, Cpu, BarChart3, Users, Code } from 'lucide-react';

const Skills = () => {
  const skillsData = [
    {
      category: 'Programming & Development',
      icon: <Code className="h-5 w-5" />,
      skills: [
        'Python',
        'SQL',
        'TypeScript',
        'Git & GitHub'
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'Data Engineering & Infrastructure',
      icon: <Database className="h-5 w-5" />,
      skills: [
        'ETL/ELT Pipelines',
        'Apache Airflow',
        'AWS Cloud Services',
        'Data Warehousing',
        'Pipeline Orchestration'
      ],
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    },
    {
      category: 'Machine Learning & AI',
      icon: <Cpu className="h-5 w-5" />,
      skills: [
        'Scikit-learn & PyTorch',
        'Supervised Learning',
        'Deep Learning',
        'Neural Networks',
        'K-Means Clustering',
        'Prompt Engineering (Expert)',
        'AI Agents & ChatGPT/Claude Integration'
      ],
      color: 'bg-blue-50 text-blue-600 border border-blue-200',
    },
    {
      category: 'Data Analytics & Visualization',
      icon: <BarChart3 className="h-5 w-5" />,
      skills: [
        'Tableau',
        'Python Visualization (Matplotlib, Plotly, Seaborn)',
        'Interactive Dashboards',
        'A/B Testing & Experimentation',
        'Customer Behavior Analysis',
        'ARPU & Retention Metrics',
        'Engagement Metrics',
        'Statistical Analysis',
        'Executive Reporting'
      ],
      color: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
    },

    {
      category: 'Leadership & Business Tools',
      icon: <Users className="h-5 w-5" />,
      skills: [
        'Cross-functional Leadership (Expert)',
        'Team Management (up to 3 analysts)',
        'Stakeholder Management',
        'JIRA & Confluence (Advanced, 5 years)',
        'Agile Development',
        'Excel & PowerPoint'
      ],
      color: 'bg-orange-50 text-orange-600 border border-orange-200',
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none px-0 pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Skills & Expertise
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-8 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {skillsData.map((section, index) => (
              <motion.div
                key={index}
                className="space-y-3 px-0"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h3 className="text-accent-foreground text-lg font-semibold">
                    {section.category}
                  </h3>
                </div>

                <motion.div
                  className="flex flex-wrap gap-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {section.skills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      variants={badgeVariants}
                      whileHover={{
                        scale: 1.04,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Badge className={`border px-3 py-1.5 font-semibold`}>
                        {skill}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Skills;
