"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 py-3 transition-all duration-300",
          scrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-transparent",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.jpg"
              alt="Ink Over Matter Logo"
              width={50}
              height={50}
              className="w-[50px] h-auto"
            />
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              href="#about"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#artists"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
            >
              Artists
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#gallery"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
            >
              Gallery
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="#booking"
              className="text-sm font-medium text-white/80 hover:text-white transition-colors relative group"
            >
              Booking
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md md:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col h-full justify-center items-center gap-8 p-4">
              <motion.div variants={itemVariants}>
                <Link
                  href="#about"
                  className="text-2xl font-bold hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="#services"
                  className="text-2xl font-bold hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Services
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="#artists"
                  className="text-2xl font-bold hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Artists
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="#gallery"
                  className="text-2xl font-bold hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Gallery
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="#booking"
                  className="text-2xl font-bold hover:text-gray-300 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Booking
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
