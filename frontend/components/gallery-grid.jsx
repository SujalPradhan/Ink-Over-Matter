"use client"

import Image from "next/image"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

const galleryItems = [
  { id: 1, src: "/images/tattoo1.jpg", alt: "Black and grey realistic portrait tattoo", category: "Black & Grey" },
  { id: 2, src: "/images/tattoo2.jpg", alt: "Colorful neo-traditional tattoo", category: "Color" },
  { id: 3, src: "/images/tattoo3.jpg", alt: "Japanese style sleeve tattoo", category: "Japanese" },
  { id: 4, src: "/images/tattoo4.jpg", alt: "Minimalist line work tattoo", category: "Minimalist" },
  { id: 5, src: "/images/tattoo5.jpg", alt: "Traditional American style tattoo", category: "Traditional" },
  { id: 6, src: "/images/tattoo6.jpg", alt: "Abstract geometric tattoo design", category: "Geometric" },
]

export default function GalleryGrid() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoaded, setIsLoaded] = useState({})

  const handleOpenImage = (id) => {
    setSelectedImage(id)
  }

  const handleCloseImage = () => {
    setSelectedImage(null)
  }

  const handleImageLoaded = (id) => {
    setIsLoaded((prev) => ({ ...prev, [id]: true }))
  }

  const selectedItem = galleryItems.find((item) => item.id === selectedImage)

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-lg group",
              "aspect-square md:aspect-[4/5]",
              index === 3 && "md:col-span-2 md:row-span-2 md:aspect-square",
            )}
            onClick={() => handleOpenImage(item.id)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.2)",
            }}
          >
            <Image
              src={item.src || "/placeholder.svg"}
              alt={item.alt}
              fill
              className={cn(
                "object-cover transition-transform duration-700 group-hover:scale-110",
                !isLoaded[item.id] && "blur-sm",
              )}
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
                <span className="text-xs font-medium px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
                  {item.category}
                </span>
                <p className="text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.alt}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
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
                      src={selectedItem.src || "/placeholder.svg"}
                      alt={selectedItem.alt}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 mix-blend-overlay"></div>
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-300">{selectedItem.alt}</p>
                    <p className="text-sm text-gray-500 mt-1">Category: {selectedItem.category}</p>
                  </div>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
