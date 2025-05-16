"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Navbar from "@/components/navbar"
import { fetchFullGallery } from "@/lib/services/api"

export default function GalleryPage() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [viewMode, setViewMode] = useState('tattoos')
  const [isLoaded, setIsLoaded] = useState({})
  const [isMounted, setIsMounted] = useState(false)

  // Fallback gallery items in case API fails
  const fallbackTattoos = [
    { id: 1, title: "Tattoo artwork 1", url: "/images/tattoo1.jpg" },
    { id: 2, title: "Tattoo artwork 2", url: "/images/tattoo2.jpg" },
    { id: 3, title: "Tattoo artwork 3", url: "/images/tattoo3.jpg" },
    { id: 4, title: "Tattoo artwork 4", url: "/images/tattoo4.jpg" },
    { id: 5, title: "Tattoo artwork 5", url: "/images/tattoo5.jpg" },
    { id: 6, title: "Tattoo artwork 6", url: "/images/tattoo6.jpg" },
    { id: 7, title: "Tattoo artwork 7", url: "/images/tattoo7.jpg" },
    { id: 8, title: "Tattoo artwork 8", url: "/images/tattoo8.jpg" },
    { id: 9, title: "Tattoo artwork 9", url: "/images/tattoo9.jpg" },
    { id: 10, title: "Tattoo artwork 10", url: "/images/tattoo10.jpg" },
    { id: 11, title: "Tattoo artwork 11", url: "/images/tattoo11.jpg" },
    { id: 12, title: "Tattoo artwork 12", url: "/images/tattoo12.jpg" },
    { id: 13, title: "Tattoo artwork 13", url: "/images/tattoo13.jpg" },
    { id: 14, title: "Tattoo artwork 14", url: "/images/tattoo14.jpg" },
  ]
  
  // Studio images
  const studioImages = [
    { id: 101, title: "Studio", url: "/images/studio.jpg" },
    { id: 102, title: "Studio front entrance", url: "/images/studio_entrance.jpg" },
    { id: 103, title: "Artist workstation", url: "/images/workstation.jpg" },
  ]

  // Component mounted effect - important for hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return;
    
    const loadGallery = async () => {
      if (viewMode === 'tattoos') {
        try {
          setLoading(true)
          const data = await fetchFullGallery()
          
          // If we got data from the API, use it
          if (data && data.length > 0) {
            setImages(data.map(item => ({
              ...item,
              // Ensure the URL uses the correct path
              url: item.url.startsWith('http') ? item.url : `/images/${item.url.split('/').pop()}`
            })))
          } else {
            // Use fallback data if API returned empty or failed
            setImages(fallbackTattoos)
          }
          
          setError(null)
        } catch (err) {
          console.error("Failed to load gallery:", err)
          setError("Failed to load gallery. Using sample images instead.")
          setImages(fallbackTattoos)
        } finally {
          setLoading(false)
        }
      } else {
        // For studio images, just load the static data
        setLoading(true)
        setImages(studioImages)
        setLoading(false)
      }
    }

    loadGallery()
  }, [viewMode, isMounted])

  const handleOpenImage = (id) => {
    setSelectedImage(id)
  }

  const handleCloseImage = () => {
    setSelectedImage(null)
  }

  const handleImageLoaded = (id) => {
    setIsLoaded(prev => ({ ...prev, [id]: true }))
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
    setIsLoaded({}) // Reset loaded state when changing view
  }

  const selectedItem = images.find(item => item.id === selectedImage)

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Header */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        <div className="absolute inset-0 z-[-1] bg-[url('/images/tattoo-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="container px-4 relative z-10">
          <Button
            asChild
            variant="outline"
            className="mb-8 backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"
          >
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back Home
            </Link>
          </Button>
          
          {isMounted && (
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {viewMode === 'tattoos' ? 'Tattoo Gallery' : 'Studio Tour'}
            </motion.h1>
          )}
          
          {isMounted && (
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {viewMode === 'tattoos' 
                ? 'Browse our collection of custom tattoos and illustrations created by our talented artists'
                : 'Take a virtual tour of our professional studio facilities'}
            </motion.p>
          )}
        </div>
      </section>
      
      {/* View Mode Toggle */}
      <section className="py-6 bg-zinc-900">
        <div className="container px-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleViewModeChange('tattoos')}
              variant={viewMode === 'tattoos' ? "default" : "outline"}
              className={viewMode === 'tattoos' 
                ? "bg-white text-black hover:bg-gray-200" 
                : "backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"}
              size="sm"
            >
              Tattoo Gallery
            </Button>
            <Button
              onClick={() => handleViewModeChange('studio')}
              variant={viewMode === 'studio' ? "default" : "outline"}
              className={viewMode === 'studio' 
                ? "bg-white text-black hover:bg-gray-200" 
                : "backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/20"}
              size="sm"
            >
              Studio Tour
            </Button>
          </div>
        </div>
      </section>
      
      {/* Gallery Grid */}
      <section className="py-16 bg-black">
        <div className="container px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-gray-400">Loading gallery...</div>
            </div>
          ) : error ? (
            <motion.div 
              className="text-amber-500 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No images available to display.
            </div>
          ) : isMounted ? (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {images.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg aspect-square"
                  onClick={() => handleOpenImage(item.id)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <Image
                    src={item.url || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    quality={85}
                    priority={index < 4} // Prioritize loading the first few images
                    className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
                      !isLoaded[item.id] ? 'blur-sm' : ''
                    }`}
                    onLoadingComplete={() => handleImageLoaded(item.id)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  ></motion.div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div>
                      <p className="text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            // Simple non-animated fallback for initial SSR render
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg aspect-square"
                >
                  <div className="w-full h-full bg-zinc-800"></div>
                </div>
              ))}
            </div>
          )}

          {/* Image Modal Dialog */}
          <AnimatePresence>
            {selectedImage !== null && isMounted && (
              <Dialog open={selectedImage !== null} onOpenChange={handleCloseImage}>
                <DialogContent className="max-w-3xl bg-zinc-900/90 backdrop-blur-md border-zinc-800">
                  {selectedItem && (
                    <motion.div
                      className="flex flex-col"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative h-[60vh] w-full overflow-hidden rounded-lg">
                        <Image
                          src={selectedItem.url || "/placeholder.svg"}
                          alt={selectedItem.title}
                          fill
                          sizes="(max-width: 1024px) 90vw, 75vw"
                          quality={90}
                          priority
                          className="object-contain"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 mix-blend-overlay"></div>
                      </div>
                      <div className="mt-4">
                        <p className="text-gray-300">{selectedItem.title}</p>
                      </div>
                    </motion.div>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </AnimatePresence>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-zinc-900">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready for Your Next Tattoo?</h2>
            <p className="text-gray-400 mb-8">
              Contact us to schedule a consultation with one of our artists and bring your vision to life
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              <Link href="/#booking">Book Appointment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - Simplified version */}
      <footer className="py-8 bg-black border-t border-zinc-800">
        <div className="container px-4">
          <div className="text-center text-gray-500">
            <p>© {new Date().getFullYear()} Ink Over Matter. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}