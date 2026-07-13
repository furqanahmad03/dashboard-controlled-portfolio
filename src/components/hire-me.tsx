"use client";

import React from "react";
import Link from "next/link";

export function HireMe() {
  return (
    <div className="absolute z-50 top-1 right-6 md:fixed md:bottom-3 md:left-3 md:top-auto md:right-auto transition-all duration-500">
      <Link href="/contact" className="block">
        <div className="relative w-20 h-20 md:w-36 md:h-36">
          {/* Rotating text ring with SVG */}
          <div className="absolute inset-0 animate-spin-slow">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1f2937" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="gradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="50%" stopColor="#e9d5ff" />
                  <stop offset="100%" stopColor="#bfdbfe" />
                </linearGradient>
                <path
                  id="circlePath"
                  d="M50,50 m-33,0 a33,33 0 1,1 66,0 a33,33 0 1,1 -66,0"
                />
              </defs>
              <text className="text-xs font-medium dark:fill-[url(#gradientDark)] fill-[url(#gradient)]">
                <textPath href="#circlePath" startOffset="0%">
                  Full Stack Developer · AI-Engineer ·
                </textPath>
              </text>
            </svg>
          </div>

          {/* Central "Hire Me" button with gradient effect */}
          <div className="absolute inset-4 md:inset-8 bg-gradient-to-br from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group p-[2px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-[rgb(27,27,27)] flex items-center justify-center">
              <span className="font-bold text-[10px] md:text-sm group-hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:via-purple-600 group-hover:to-blue-400 dark:group-hover:from-gray-300 dark:group-hover:via-purple-100 dark:group-hover:to-blue-200">
                Hire Me
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 