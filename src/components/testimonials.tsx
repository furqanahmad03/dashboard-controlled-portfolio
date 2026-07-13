"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface Testimonial {
  id: string;
  content: string;
  author: string;
  position: string;
  company: string;
  link?: string;
  rating?: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    content:
      "Furqan Ahmad has consistently demonstrated excellent skills by completing all assigned tasks on schedule while providing daily progress updates that facilitated effective project coordination. His punctuality, professional discipline, and proactive communication throughout the internship period reflected a strong work ethic and commitment to excellence. He showed genuine enthusiasm for learning, actively seeking to understand both the immediate tasks and broader concepts, which positions him well for future professional success.",
    author: "Muzammil Shakir",
    position: "CEO",
    company: "Musketeers Tech",
    link: "https://interns.web.musketeers.dev/interns/9",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function Testimonials() {
  return (
    <motion.div
      className="mb-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.h3
        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-4 md:mb-8 mb-0"
        variants={itemVariants}
      >
        <Quote className="w-8 h-8 text-purple-600" />
        Testimonials
      </motion.h3>

      <div className="grid grid-cols-1 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            variants={itemVariants}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="group hover:scale-[1.02] transition-all duration-300"
          >
            <Card className="bg-white dark:bg-white/5 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full border-gray-200 dark:border-gray-700">
              <CardContent className="p-0">
                {/* Quote Icon */}
                <motion.div
                  className="flex justify-center mb-4"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.1 }}
                >
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full group-hover:from-purple-200 group-hover:to-blue-200 dark:group-hover:from-purple-800/40 dark:group-hover:to-blue-800/40 transition-all duration-200">
                    <Quote className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </motion.div>

                {/* Rating */}
                {testimonial.rating && (
                  <motion.div
                    className="flex justify-center mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                  >
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-105 transition-all duration-300"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Testimonial Content */}
                <motion.blockquote
                  className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 text-center italic text-justify"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                >
                  &quot;{testimonial.content}&quot;
                </motion.blockquote>

                {/* Author Information */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">
                    {testimonial.author}
                  </h4>
                  <p className="text-purple-600 dark:text-purple-400 font-medium text-sm mb-1">
                    {testimonial.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {testimonial.company}
                  </p>

                  {/* View Link Button */}
                  {testimonial.link && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 mx-auto group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:border-purple-300 dark:group-hover:border-purple-600 transition-all duration-200 max-w-xs"
                      asChild
                    >
                      <Link
                        href={testimonial.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Appreciation
                      </Link>
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Testimonials CTA */}
      <motion.div
        className="text-center mt-8"
        variants={itemVariants}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Want to work with me?
        </p>
        <Button
          variant="outline"
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 hover:shadow-lg hover:scale-105 transition-all duration-300 hover:text-white"
          asChild
        >
          <Link href="/contact">Contact Me</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}
