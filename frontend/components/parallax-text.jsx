"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion"
import { wrap } from "@motionone/utils"

export default function ParallaxText({ children, baseVelocity = 100 }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`)

  const directionFactor = useRef(1)
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)

    // Use a different approach to access the velocity factor value
    const currentVelocity = velocityFactor.get ? velocityFactor.get() : 0

    if (currentVelocity < 0) {
      directionFactor.current = -1
    } else if (currentVelocity > 0) {
      directionFactor.current = 1
    }

    moveBy += directionFactor.current * moveBy * (currentVelocity || 0)

    baseX.set(baseX.get ? baseX.get() + moveBy : moveBy)
  })

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 py-4">
      <motion.div
        className="text-2xl font-bold uppercase tracking-widest flex whitespace-nowrap flex-nowrap"
        style={{ x }}
      >
        <span className="block mr-4">{children}</span>
        <span className="block mr-4">{children}</span>
        <span className="block mr-4">{children}</span>
        <span className="block mr-4">{children}</span>
      </motion.div>
    </div>
  )
}
