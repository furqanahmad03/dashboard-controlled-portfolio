"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink, Layers, Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import { technologies } from "@/constants/Technologies";
import Link from "next/link";
import { Experience } from "@/components/experience";
import { Education } from "@/components/education";
import social from "@/constants/Social";
import { ProjectsSection } from "@/components/projects-section";
import Image from "next/image";
import { Testimonials } from "@/components/testimonials";

interface CertificationData {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialURL: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AboutPage() {
  const [certifications, setCertifications] = useState<CertificationData[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/certifications?limit=3");
        const data = await response.json();

        if (data.success) {
          setCertifications(data.data);
        } else {
          console.error("Error fetching certifications:", data.error);
          setCertifications([]);
        }
      } catch (error) {
        console.error("Error fetching certifications:", error);
        setCertifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[rgb(15,15,15)] dark:via-[rgb(20,20,20)] dark:to-[rgb(27,27,27)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center font-bold mb-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Passion Fuels Purpose!
          </motion.h1>
        </motion.div>

        {/* Biography and Statistics Section */}
        <motion.div
          className="flex flex-col-reverse lg:flex-row gap-16 md:mb-20 px-2 lg:px-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          {/* Left Column - Biography */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent uppercase tracking-wider">
              Biography
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify">
              <p>
                I am Furqan Ahmad, a passionate Software Engineer and MERN &
                Next.js Developer, experienced in creating beautiful,
                functional, and user-centered digital experiences.
              </p>
              <p>
                I specialize in full-stack web development using the MERN stack,
                Next.js, and modern web technologies. My passion lies in
                building scalable applications, implementing AI/ML features, and
                delivering high-quality solutions that exceed expectations.
              </p>
              <p>
                Currently, I am highly motivated to explore the world of Machine
                Learning and Artificial Intelligence, driven by a curiosity to
                understand and build intelligent systems that solve real-world
                problems.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Profile Picture */}
          <motion.div
            className="flex justify-center items-start"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
          >
            <div className="relative">
              <div className="lg:w-96 lg:h-96 w-64 h-64 rounded-lg overflow-hidden shadow-2xl relative">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 p-1">
                  <div className="w-full h-full rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                    <Image
                      src={social.profilePic}
                      alt="Furqan Ahmad"
                      className="w-full h-full object-cover"
                      width={384}
                      height={384}
                      onError={(e) => {
                        // Fallback to gradient if image fails to load
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove(
                          "hidden"
                        );
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center hidden">
                      <span className="text-white text-4xl font-bold">FA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Experience Section */}
        <Experience />

        {/* Education Section */}
        <Education />

        {/* Tech Stack Section */}
        <motion.div
          className="text-center md:my-20 my-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Layers className="w-12 h-12 text-purple-600" />
            Tech Stack
          </motion.h3>

          <div className="space-y-12">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.category}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className="bg-white dark:bg-white/5 rounded-xl p-6 shadow-lg"
              >
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: index * 0.1 + 0.1 }}
                >
                  <div
                    className="p-2 sm:p-3 rounded-lg text-white"
                    style={{ backgroundColor: tech.color }}
                  >
                    {tech.icon}
                  </div>
                  <h4 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    {tech.category}
                  </h4>
                </motion.div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1 sm:gap-2">
                  {tech.items.map((item, itemIndex) => (
                    <motion.div
                      key={item.name}
                      className="group relative hover:scale-105 transition-all duration-300"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: "-20px" }}
                      transition={{
                        duration: 0.6,
                        ease: "easeOut",
                        delay: index * 0.2 + itemIndex * 0.05,
                      }}
                    >
                      <div className="bg-white dark:bg-white/10 rounded-lg p-1 sm:p-2 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center text-center space-y-1">
                          <motion.div
                            className="p-1 rounded-lg transition-colors duration-200"
                            style={{
                              backgroundColor: `${item.color}20`,
                              color: item.color,
                            }}
                            initial={{ rotate: -10, x: -15, y: 5 }}
                            whileInView={{ rotate: 0, x: 0, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              ease: "easeOut",
                              delay: index * 0.1 + itemIndex * 0.03 + 0.1,
                            }}
                          >
                            <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                              {item.icon}
                            </div>
                          </motion.div>
                          <motion.span
                            className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.4,
                              ease: "easeOut",
                              delay: index * 0.2 + itemIndex * 0.05 + 0.2,
                            }}
                          >
                            {item.name}
                          </motion.span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Testimonials Section */}
        <Testimonials />

        {/* Certifications Section */}
        <motion.div
          className="mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h3
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center justify-center gap-4"
            variants={itemVariants}
          >
            <Award className="w-8 h-8 text-purple-600" />
            Certifications
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading
              ? // Loading skeleton
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 dark:bg-gray-700 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3" />
                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4" />
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32" />
                  </div>
                ))
              : certifications.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    variants={itemVariants}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="bg-white dark:bg-white/5 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <motion.h4
                      className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 h-14 flex items-start"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.1 }}
                    >
                      {cert.title}
                    </motion.h4>
                    <motion.p
                      className="text-purple-600 dark:text-purple-400 font-medium mb-3"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                    >
                      {cert.issuer}
                    </motion.p>
                    <motion.p
                      className="text-gray-600 dark:text-gray-400 text-sm mb-4"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                    >
                      {new Date(cert.issueDate).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </motion.p>
                    {cert.credentialURL && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.2 + 0.4 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          asChild
                        >
                          <Link
                            href={cert.credentialURL}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Certificate
                          </Link>
                        </Button>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
          </div>
          <motion.div className="text-center" variants={itemVariants}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              asChild
            >
              <Link href="/certifications">
                See All Certifications
                <ExternalLink className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Featured Projects Section */}
        <ProjectsSection />

        {/* Contact Section */}
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h3
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-8"
            variants={itemVariants}
          >
            Let&apos;s Connect
          </motion.h3>
          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            I&apos;m always open to discussing new opportunities, interesting
            projects, or just having a chat about technology and innovation.
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                asChild
              >
                <Link href="/contact">
                  <Contact className="w-5 h-5 mr-2" />
                  Get In Touch
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="/Furqan-Ahmad-Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Download Resume
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
