"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const { scrollYProgress } = useScroll();
  
  // Optimized spring settings for smoother performance
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
    mass: 0.8
  });

  // State to track if we're on a dashboard route
  const [isDashboardRoute, setIsDashboardRoute] = useState(false);

  // Throttle function for better performance
  const throttle = useCallback(<T extends (...args: unknown[]) => void>(
    func: T, 
    delay: number
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return function (...args: Parameters<T>) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func(...args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func(...args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }, []);

  useEffect(() => {
    // Check if we're on a dashboard route
    setIsDashboardRoute(window.location.pathname.startsWith('/dashboard'));
    
    // Enable smooth scrolling behavior with better performance
    document.documentElement.style.scrollBehavior = "smooth";
    
    // Add CSS optimizations for smooth scrolling
    const style = document.createElement('style');
    style.textContent = `
      * {
        scroll-behavior: smooth;
      }
      html {
        scroll-behavior: smooth;
        scroll-padding-top: 80px;
      }
      body {
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
    `;
    document.head.appendChild(style);
    
    // Optimized scroll handler with proper throttling
    const handleScroll = throttle(() => {
      // Use requestAnimationFrame for smooth updates
      requestAnimationFrame(() => {
        // Any custom scroll logic can go here
      });
    }, 16); // ~60fps

    // Use passive listeners for better performance
    window.addEventListener("scroll", handleScroll, { 
      passive: true,
      capture: false 
    });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.head.removeChild(style);
    };
  }, [throttle]);

  return (
    <>
      {/* Progress bar - hidden on dashboard routes */}
      {!isDashboardRoute && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 origin-left z-50"
          style={{ 
            scaleX,
            willChange: 'transform' // Optimize for GPU acceleration
          }}
        />
      )}
      
      {/* Main content */}
      <div className="relative">
        {children}
      </div>
    </>
  );
} 