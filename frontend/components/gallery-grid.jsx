"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"

const galleryItems = [
	{ id: 1, src: "/images/tattoo1.jpg", alt: "Premium tattoo artwork" },
	{ id: 2, src: "/images/tattoo2.jpg", alt: "Custom tattoo design" },
	{ id: 3, src: "/images/tattoo3.jpg", alt: "Unique tattoo artwork" },
	{ id: 4, src: "/images/tattoo4.jpg", alt: "Minimalist tattoo design" },
	{ id: 5, src: "/images/tattoo5.jpg", alt: "Artistic tattoo piece" },
	{ id: 6, src: "/images/tattoo6.jpg", alt: "Creative tattoo design" },
]

export default function GalleryGrid() {
	const [selectedImage, setSelectedImage] = useState(null)
	const [isLoaded, setIsLoaded] = useState({})
	const gridRef = useRef(null)
	const isInView = useInView(gridRef, { once: true, margin: "-100px 0px" })

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
			<div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{galleryItems.map((item, index) => {
					const loaded = isLoaded[item.id]
					return (
						<motion.div
							key={item.id}
							className={cn(
								"relative cursor-pointer overflow-hidden rounded-lg group",
								"aspect-square md:aspect-[4/5]",
								index === 3 && "md:col-span-2 md:row-span-2 md:aspect-square",
							)}
							onClick={() => handleOpenImage(item.id)}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
							transition={{
								duration: 0.5,
								delay: Math.min(index * 0.1, 0.3), // Cap the delay at 0.3s for better UX
								ease: "easeOut",
							}}
							whileHover={{
								scale: 1.02, // Reduced scale for better performance
								boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.2)",
							}}
						>
							{!loaded && (
								<Skeleton
									className="absolute inset-0 w-full h-full bg-zinc-800/80 z-10"
								/>
							)}
							<Image
								src={item.src || "/placeholder.svg"}
								alt={item.alt}
								fill
								sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
								quality={85}
								priority={index < 2}
								loading={index < 2 ? "eager" : "lazy"}
								className={cn(
									"object-cover transition-transform duration-500 will-change-transform",
									"group-hover:scale-105", // Reduced scale effect for better performance
									!loaded && "invisible",
								)}
								onLoadingComplete={() => handleImageLoaded(item.id)}
							/>
							<div
								aria-hidden="true"
								className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							/>
							<div
								className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
								aria-hidden={!loaded}
							>
								<div>
									<p className="text-white mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										{item.alt}
									</p>
								</div>
							</div>
						</motion.div>
					)
				})}
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
											sizes="(max-width: 1024px) 90vw, 75vw"
											quality={90}
											priority
											className="object-contain"
										/>
										<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 mix-blend-overlay"></div>
									</div>
									<div className="mt-4">
										<p className="text-gray-300">{selectedItem.alt}</p>
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
