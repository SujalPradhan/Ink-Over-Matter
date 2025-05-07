"use client"

import Image from "next/image"
import { Instagram } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function ArtistCard({ name, specialty, image, experience, instagram }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -5,
        boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.1)",
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 overflow-hidden group">
        <div className="relative h-[350px] overflow-hidden">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          ></motion.div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-gray-300">{specialty}</p>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-400">{experience} experience</p>
            <Button variant="ghost" size="sm" asChild className="p-0 h-auto">
              <Link
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                <span className="ml-2">{instagram}</span>
              </Link>
            </Button>
          </div>
          <Button
            asChild
            className="w-full bg-gradient-to-r from-white to-gray-200 text-black hover:from-gray-200 hover:to-white transition-all duration-300"
          >
            <Link href="#booking">Book with {name.split(" ")[0]}</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
