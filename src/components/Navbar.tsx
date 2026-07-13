"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";
import NavLinks from "@/constants/NavLinks";
import social from "@/constants/Social";
import { useTheme } from "@/components/providers/theme-provider";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMenuOpen(false);
        setIsClosing(false);
        document.body.style.overflow = 'auto';
      }, 300);
    } else {
      setIsMenuOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMenu = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
      document.body.style.overflow = 'auto';
    }, 300);
  };

  return (
    <nav className="py-4 lg:px-10 w-full z-50 transition-colors duration-300 animate-slide-in-from-top">
      <div className="max-w-allowed mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button - Left side */}
          <div className="md:hidden order-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              className="transition-colors duration-300 text-gray-900 hover:bg-gray-900/10 dark:text-white dark:hover:bg-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 order-1">
            {NavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative font-semibold transition-all duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent hover:from-gray-600 hover:via-purple-600 hover:to-blue-400 dark:hover:from-gray-300 dark:hover:via-purple-100 dark:hover:to-blue-200 group"
              >
                {link.title}
                {pathname === link.href && (
                  <span 
                    className="absolute -bottom-1 left-0 w-full h-0.5 transition-all duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300"
                  />
                )}
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 group-hover:w-full"
                />
              </Link>
            ))}
          </div>

          {/* Logo/Avatar - Centered on all screens */}
          <div className="flex-shrink-0 order-2 absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="flex items-center group">
              <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 hover:scale-105 bg-gradient-to-br from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 p-[2px]">
                <div className="w-full h-full rounded-full bg-white dark:bg-[rgb(27,27,27)] flex items-center justify-center">
                  <span className="font-bold text-lg transition-all duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent group-hover:from-gray-600 group-hover:via-purple-600 group-hover:to-blue-400 dark:group-hover:from-gray-300 dark:group-hover:via-purple-100 dark:group-hover:to-blue-200">
                    FA
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Social Icons and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-5 order-3">
            <Link href={social.github} target="_blank" rel="noopener noreferrer" className="group">
              <FaGithub className="w-5 h-5 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-[#C06EFF] dark:group-hover:text-[#C06EFF] hover:scale-110" />
            </Link>
            <Link href={social.linkedin} target="_blank" rel="noopener noreferrer" className="group">
              <FaLinkedin className="w-5 h-5 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 hover:scale-110" />
            </Link>
            <Link href={social.facebook} target="_blank" rel="noopener noreferrer" className="group">
              <FaFacebook className="w-5 h-5 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 hover:scale-110" />
            </Link>
            {/* <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
              <FaPinterest className="w-5 h-5 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 hover:scale-110" />
            </Link> */}
            {/* <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
              <FaFacebook className="w-5 h-5 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-500 hover:scale-110" />
            </Link> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="transition-all duration-300 text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 hover:scale-110"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu - Full Screen */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className={`h-full w-full bg-white dark:bg-[rgb(27,27,27)] ${
              isClosing ? 'animate-slide-out-to-top' : 'animate-slide-in-from-top'
            }`}>
              <div className="flex flex-col h-full">
                {/* Header with close button */}
                <div className="flex justify-start p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeMenu}
                    className="transition-colors duration-300 text-gray-900 hover:bg-gray-900/10 dark:text-white dark:hover:bg-white/10 mt-4 ml-2"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                  {NavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className="relative text-2xl font-medium transition-all duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300 bg-clip-text text-transparent hover:from-gray-600 hover:via-purple-600 hover:to-blue-400 dark:hover:from-gray-300 dark:hover:via-purple-100 dark:hover:to-blue-200"
                    >
                      {link.title}
                      {pathname === link.href && (
                        <span 
                          className="absolute -bottom-1 left-0 w-full h-0.5 transition-all duration-300 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-300"
                        />
                      )}
                    </Link>
                  ))}
                </div>

                {/* Mobile Social Icons and Theme Toggle */}
                <div className="flex items-center justify-center space-x-6 pb-8">
                  <Link href={social.github} target="_blank" rel="noopener noreferrer" className="group">
                    <FaGithub className="w-6 h-6 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 hover:scale-110" />
                  </Link>
                  <Link href={social.linkedin} target="_blank" rel="noopener noreferrer" className="group">
                    <FaLinkedin className="w-6 h-6 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 hover:scale-110" />
                  </Link>
                  <Link href={social.facebook} target="_blank" rel="noopener noreferrer" className="group">
                    <FaFacebook className="w-6 h-6 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 hover:scale-110" />
                  </Link>
                  {/* <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
                    <FaPinterest className="w-6 h-6 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 hover:scale-110" />
                  </Link> */}
                  {/* <Link href="#" target="_blank" rel="noopener noreferrer" className="group">
                    <FaDribbble className="w-6 h-6 transition-all duration-300 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 hover:scale-110" />
                  </Link> */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleTheme}
                    className="transition-all duration-300 text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-300 hover:scale-110"
                  >
                    {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
