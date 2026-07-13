"use client";

import React from "react";
import { Code, Palette, Database, Smartphone, Globe, Zap, Webhook, Brain, Bot } from "lucide-react";
import { motion } from "framer-motion";

export function AboutSection() {
  const skills = [
    {
      icon: <Webhook className="w-8 h-8" />,
      title: "Web Scraping & Data Extraction",
      description: "Beautiful Soup, Scrapy, Selenium, and automated data collection from various sources.",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "LLM & Model Training",
      description: "Fine-tuning language models, transfer learning, and custom AI model development.",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "RAG & AI Systems",
      description: "Retrieval-Augmented Generation, vector databases, and intelligent AI-powered applications.",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Frontend Development",
      description: "React.js, Next.js, TypeScript, Tailwind CSS, and modern JavaScript frameworks.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Backend Development",
      description: "Node.js, Express.js, Python, Django, and RESTful API development.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "UI/UX Design",
      description: "User-centered design, Figma, responsive layouts, and accessibility.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Development",
      description: "React Native, mobile-first design, and cross-platform development.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Web Technologies",
      description: "HTML5, CSS3, JavaScript, Git, and modern web standards.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Performance & SEO",
      description: "Optimization, Core Web Vitals, search engine optimization.",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-[rgb(27,27,27)] dark:via-[rgb(20,20,20)] dark:to-[rgb(15,15,15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            What I Do
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            I specialize in creating innovative web applications that combine cutting-edge technology with exceptional user experiences. From concept to deployment, I bring ideas to life.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="group relative p-8 bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-gray/20 dark:border-white/10 hover:border-purple-300/50 dark:hover:border-purple-300/30 transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-200 ease-out`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-br ${skill.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-200 ease-out`}>
                  <div className="text-white">
                    {skill.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-200 ease-out">
                  {skill.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {skill.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div 
            className="inline-flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 rounded-2xl border border-purple-300/20 dark:border-purple-300/10"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🚀
            </motion.div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ready to build something amazing?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let&apos;s discuss your project and bring your vision to life.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 