"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import social from "@/constants/Social";
import Image from "next/image";

export function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 pb-10 animate-fade-in">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-4 items-center min-h-[80vh]">
          
          {/* Left Column - Profile Picture */}
          <motion.div 
            className="order-1 lg:order-1 flex justify-center lg:justify-center items-center"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="relative w-80 h-80 lg:w-[500px] lg:h-[500px]"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-teal-500/20 rounded-full blur-3xl"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                <Image
                  src={social.profilePic}
                  alt="Furqan Ahmad"
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div 
            className="order-2 lg:order-2 flex flex-col justify-center h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tighter py-2 mb-4 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              >
                Turning Vision Into Reality With Code And Design.
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-tight mb-10 max-w-2xl mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
              >
                As a skilled full-stack developer, I am dedicated to turning ideas into innovative web applications. Explore my latest projects and articles, showcasing my expertise in React.js and web development.
              </motion.p>
              
              <motion.div 
                className="flex gap-6 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 text-white dark:text-black hover:from-gray-800 hover:via-purple-700 hover:to-blue-500 dark:hover:from-gray-100 dark:hover:via-purple-100 dark:hover:to-blue-200 transition-all duration-300 group text-lg px-8 py-6 shadow-lg hover:shadow-xl"
                    asChild
                  >
                    <Link href="/Furqan-Ahmad-Resume.pdf" target="_blank" rel="noopener noreferrer">
                      Resume
                      <ArrowUpRight className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-6 border-[1px] border-gray-900 dark:border-white hover:border-purple-600 dark:hover:border-purple-300 transition-all duration-300"
                    asChild
                  >
                    <Link href="/contact">
                      Contact
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 