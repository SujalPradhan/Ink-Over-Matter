"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import ArtistCard from "@/components/artist-card"
import ServiceCard from "@/components/service-card"
import GalleryGrid from "@/components/gallery-grid"
import { motion, useMotionValue } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import Navbar from "@/components/navbar"
import ParallaxText from "@/components/parallax-text"

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)
  const heroRef = useRef(null)
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)
  const artistsRef = useRef(null)
  const galleryRef = useRef(null)
  const bookingRef = useRef(null)
  
  // Safe opacity and scale values that will be consistent between server and client
  const opacity = useMotionValue(1)
  const scale = useMotionValue(1)

  useEffect(() => {
    // This only runs on client
    setIsClient(true)
    
    // Set initial window height
    setWindowHeight(window.innerHeight)
    
    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Update motion values based on scroll position
      if (windowHeight > 0) {
        opacity.set(Math.max(0, 1 - (currentScrollY / windowHeight) * 2))
        scale.set(Math.max(0.9, 1 - (currentScrollY / windowHeight) * 0.5))
      }
    }

    // Set initial scroll position
    setScrollY(window.scrollY)
    
    // Initial calculation
    if (windowHeight > 0) {
      opacity.set(Math.max(0, 1 - (window.scrollY / windowHeight) * 2))
      scale.set(Math.max(0.9, 1 - (window.scrollY / windowHeight) * 0.5))
    }

    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [windowHeight, opacity, scale])

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />

        {isClient && (
          <motion.div
            className="absolute inset-0 z-[-1] bg-[url('/images/tattoo-bg.jpg')] bg-cover bg-center"
            style={{
              backgroundPosition: "center 30%",
              y: scrollY * 0.3,
              scale: 1 + scrollY * 0.0002,
              filter: `blur(${scrollY * 0.01}px) brightness(${1 - scrollY * 0.0005})`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 1.5 }}
          />
        )}

        <div className="container px-4 z-10 text-center">
          <motion.div
            className="max-w-[300px] mx-auto mb-8"
            style={{ opacity, scale }}
            initial={{ y: 50, opacity: 0 }}
            animate={isClient ? { y: 0, opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Image
              src="/images/logo.jpg"
              alt="Ink Over Matter Logo"
              width={300}
              height={300}
              className="w-full h-auto"
              priority
            />
          </motion.div>
          <h1 className="sr-only">Ink Over Matter - Skin Art & Illustrations</h1>
          <motion.p
            className="text-xl md:text-2xl mt-6 mb-8 text-gray-300 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={isClient ? { y: 0, opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Premium custom tattoos and illustrations by award-winning artists
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ y: 30, opacity: 0 }}
            animate={isClient ? { y: 0, opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              <Link href="#booking">Book Appointment</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <Link href="/gallery">View Our Work</Link>
            </Button>
          </motion.div>
        </div>

        {isClient && (
          <motion.div
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
            >
              <ChevronRight className="h-8 w-8 rotate-90 text-white/70" />
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Divider with Parallax Text */}
      {/* <div className="bg-gradient-to-r from-zinc-900 via-black to-zinc-900 py-6 overflow-hidden">
        <ParallaxText baseVelocity={-3}>SKIN ART • CUSTOM DESIGNS • TATTOOS • ILLUSTRATIONS • </ParallaxText>
      </div> */}

      {/* About Section */}
      <section ref={aboutRef} id="about" className="py-20 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(25,25,25,0.8),transparent_70%)]"></div>
        <div className="container px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            About The Studio
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <p className="text-lg text-gray-300 mb-6">
              Ink Over Matter is a premium tattoo studio founded by Anurag Pradhan from Darjeeling, who also serves as the studio’s main artist. Known for precision, creativity, and professional standards, the studio offers custom tattoos tailored through direct consultation. Every piece is crafted with care, hygiene, and attention to detail.
              </p>
              <p className="text-lg text-gray-300 mb-6">
                We pride ourselves on maintaining the highest standards of hygiene and safety, using only premium
                equipment and inks to deliver exceptional results that stand the test of time.
              </p>
              <motion.div
                className="flex flex-col sm:flex-row gap-6 mt-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                <motion.div className="flex items-center gap-3" variants={fadeInUp}>
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <span>Kodihalli, Bengaluru, Karnataka 560008</span>
                </motion.div>
                {/* <motion.div className="flex items-center gap-3" variants={fadeInUp}>
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <span>(555) 123-4567</span>
                </motion.div> */}
                <motion.div className="flex items-center gap-3" variants={fadeInUp}>
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <span>Tue-Sat: 11AM-8PM</span>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div
              className="relative h-[400px] rounded-lg overflow-hidden"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 mix-blend-overlay z-10"></div>
              <Image src="/images/studio.jpg" alt="Ink Over Matter Studio" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} id="services" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Our Services
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            We offer a wide range of tattoo styles and services to bring your vision to life
          </motion.p>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <ServiceCard
                title="Custom Tattoos"
                description="Personalized designs created specifically for you, tailored to your vision and preferences."
                icon="Pen"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ServiceCard
                title="Cover-Ups"
                description="Transform existing tattoos into new designs, hiding the old while creating something beautiful."
                icon="RefreshCw"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ServiceCard
                title="Black & Grey"
                description="Stunning monochromatic pieces with depth and detail, from subtle shading to dramatic contrasts."
                icon="Droplet"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ServiceCard
                title="Color Work"
                description="Vibrant, long-lasting color tattoos that pop, using premium inks for the most vivid results."
                icon="Palette"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ServiceCard
                title="Traditional"
                description="Bold lines, bright colors, and classic imagery in the time-honored American traditional style."
                icon="Anchor"
              />
            </motion.div>
            <motion.div variants={fadeInUp}>
              <ServiceCard
                title="Custom Art"
                description="Commission our artists to create unique illustrations and designs for non-tattoo purposes."
                icon="Image"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Artists Section */}
      <section ref={artistsRef} id="artists" className="py-20 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(25,25,25,0.8),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Meet Our Artist
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Anurag Pradhan is professional who brings years of experience and passion to every piece
          </motion.p>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <ArtistCard
                name="Anurag Pradhan"
                // specialty="Neo-Traditional"
                image="/images/artist1.jpg"
                experience="12 years"
                instagram="@anuragpradhan"
              />
            </motion.div>
            {/* <motion.div variants={fadeInUp}>
              <ArtistCard
                name="Youn Pradhan"
                specialty="Neo-Traditional"
                image="/images/artist2.jpg"
                experience="8 years"
                instagram="@younpradhan29851"
              />
            </motion.div> */}
            {/* <motion.div variants={fadeInUp}>
              <ArtistCard
                name="Jamie Wilson"
                specialty="Japanese"
                image="/images/artist3.jpg"
                experience="15 years"
                instagram="@jamie_irezumi"
              />
            </motion.div> */}
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} id="gallery" className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Our Work
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Browse our portfolio of custom tattoos and illustrations
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <GalleryGrid />
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="backdrop-blur-sm bg-white/5 border-white/20 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Booking Section */}
      <section ref={bookingRef} id="booking" className="py-20 bg-zinc-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(25,25,25,0.8),transparent_70%)]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="container px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Book Your Appointment
          </motion.h2>
          <motion.p
            className="text-lg text-gray-400 text-center max-w-2xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            Contact us directly to schedule your consultation
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Contact us for appointments</h3>
              
              <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
                <a 
                  href="tel:+919731119546" 
                  className="flex items-center justify-center gap-3 text-lg hover:text-white/80 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>+91-9731119546</span>
                </a>
                
                <a 
                  href="https://wa.me/917676887842" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 text-lg hover:text-white/80 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg>
                  <span>+91-7676887842</span>
                  <span className="text-sm text-gray-400"></span>
                </a>
              </div>
              
              <p className="text-gray-400 mt-6">
                Our team is available Tuesday to Saturday, 11AM-8PM to assist you with scheduling and answering any questions.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-black border-t border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>
        <div className="container px-4 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-8 md:mb-0">
              <Image
                src="/images/logo.jpg"
                alt="Ink Over Matter Logo"
                width={150}
                height={150}
                className="w-[150px] h-auto"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#services" className="text-gray-400 hover:text-white transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="#artists" className="text-gray-400 hover:text-white transition-colors">
                      Artists
                    </Link>
                  </li>
                  <li>
                    <Link href="#gallery" className="text-gray-400 hover:text-white transition-colors">
                      Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="#booking" className="text-gray-400 hover:text-white transition-colors">
                      Booking
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">Vruddhi Complex, 25, 6th Cross Rd</li>
                  <li className="text-gray-400">HAL 3rd Stage, Kodihalli</li>
                  <li className="text-gray-400">Bengaluru, Karnataka 560008</li>
                  <li className="text-gray-400">(555) 123-4567</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Hours</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">Tuesday: 11AM-8PM</li>
                  <li className="text-gray-400">Wednesday: 11AM-8PM</li>
                  <li className="text-gray-400">Thursday: 11AM-8PM</li>
                  <li className="text-gray-400">Friday: 11AM-8PM</li>
                  <li className="text-gray-400">Saturday: 11AM-8PM</li>
                  <li className="text-gray-400">Sunday-Monday: Closed</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="https://www.facebook.com/InkOverMatter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05h2.03V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                      Facebook
                    </Link>
                  </li>
                  <li>
                    <Link href="https://www.instagram.com/inkovermatter" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-instagram" viewBox="0 0 16 16">
                        <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                      </svg>
                      Instagram
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="mt-12 pt-8 border-t border-zinc-800 text-center text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="mb-2">© {new Date().getFullYear()} Ink Over Matter. All rights reserved.</p>
            <p className="text-sm">
              Website created and maintained by{" "}
              <a 
                href="https://www.linkedin.com/in/sujal-raj-pradhan-a85043242/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sujal Raj Pradhan
              </a>
            </p>
          </motion.div>
        </div>
      </footer>
    </main>
  )
}
