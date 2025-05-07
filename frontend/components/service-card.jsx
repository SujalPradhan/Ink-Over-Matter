"use client"

import { Anchor, Droplet, Palette, Pen, RefreshCw, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function ServiceCard({ title, description, icon, price }) {
  const IconComponent = {
    Pen,
    RefreshCw,
    Droplet,
    Palette,
    Anchor,
    Image: ImageIcon,
  }

  const Icon = IconComponent[icon] || Pen

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 30px -15px rgba(255, 255, 255, 0.1)",
      }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-zinc-900/80 backdrop-blur-sm border-zinc-800 hover:border-white/20 transition-all duration-300 h-full relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 rounded-full bg-white/10"
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-5 w-5 text-white" />
            </motion.div>
            <h3 className="text-xl font-semibold">{title}</h3>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <p className="text-gray-400 mb-4">{description}</p>
          <p className="text-sm font-medium text-white/80">{price}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
