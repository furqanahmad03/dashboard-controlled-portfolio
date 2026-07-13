"use client";

import React from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";
import social from "@/constants/Social";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <footer className="relative bg-white dark:bg-gradient-to-br dark:from-[rgb(27,27,27)] dark:via-[rgb(20,20,20)] dark:to-[rgb(15,15,15)]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-transparent to-transparent dark:from-black/20"></div>

      <div className="relative z-10">
        {/* Main footer content */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="mb-6">
                <Link href="/" className="inline-flex items-center">
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 dark:from-white dark:via-purple-200 dark:to-blue-300 rounded-full flex items-center justify-center p-[2px]"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-[rgb(27,27,27)] flex items-center justify-center">
                      <span className="font-bold text-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent">
                        FA
                      </span>
                    </div>
                  </motion.div>
                  <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent">
                    Furqan Ahmad
                  </span>
                </Link>
              </div>

              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Turning vision into reality with code and design. A passionate
                full-stack developer dedicated to creating innovative web
                applications.
              </p>

              {/* Social Links */}
              <motion.div className="flex space-x-4" variants={itemVariants}>
                <motion.div variants={socialVariants}>
                  <Link
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 dark:group-hover:bg-white/30 group-hover:scale-110">
                      <FaGithub className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-white transition-colors duration-300" />
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={socialVariants}>
                  <Link
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 dark:group-hover:bg-white/30 group-hover:scale-110">
                      <FaLinkedin className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-white transition-colors duration-300" />
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={socialVariants}>
                  <Link
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 dark:group-hover:bg-white/30 group-hover:scale-110">
                      <FaFacebook className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-white transition-colors duration-300" />
                    </div>
                  </Link>
                </motion.div>
                {/* <motion.div variants={socialVariants}>
                  <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 dark:group-hover:bg-white/30 group-hover:scale-110">
                      <FaPinterest className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-white transition-colors duration-300" />
                    </div>
                  </Link>
                </motion.div>
                <motion.div variants={socialVariants}>
                  <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 dark:group-hover:bg-white/30 group-hover:scale-110">
                      <FaDribbble className="w-5 h-5 text-gray-700 dark:text-white group-hover:text-purple-600 dark:group-hover:text-white transition-colors duration-300" />
                    </div>
                  </Link>
                </motion.div> */}
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/experience"
                    className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300"
                  >
                    Experience
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300"
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="/certifications"
                    className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300"
                  >
                    Certifications
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Get In Touch
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-white" />
                  <Link
                    href={social.email}
                    className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300"
                  >
                    hfurqan.se@gmail.com
                  </Link>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-white" />
                  <span className="text-gray-600 dark:text-white/80">
                    Pakistan
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Link href="/contact" className="flex gap-3">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-white" />
                    <span className="text-gray-600 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors duration-300">
                      Available for hire
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          className="border-t border-gray-200 dark:border-white/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {currentYear} Furqan Ahmad. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
