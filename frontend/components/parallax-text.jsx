"use client"

import { useRef, useEffect } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion"
import { wrap } from "@motionone/utils"

export default function ParallaxText({ children, baseVelocity = 100 }) {
  const prefersReducedMotion = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useSpring(useMotionValue(0), {
    damping: 50,
    stiffness: 400,
  })
  const containerRef = useRef(null)
  const directionFactor = useRef(1)

  useEffect(() => {
    // Skip animation setup for users who prefer reduced motion
    if (prefersReducedMotion) return

    // Update velocity based on scroll
    const updateScrollVelocity = () => {
      const currentScrollY = scrollY.get()
      const previousScrollY = scrollY.getPrevious() || currentScrollY
      const scrollDelta = currentScrollY - previousScrollY

      scrollVelocity.set(Math.min(Math.max(scrollDelta, -5), 5))
    }

    const unsubscribeY = scrollY.on("change", updateScrollVelocity)

    // Use requestAnimationFrame for smoother animation
    let frameId
    let prevTime = 0

    const updatePosition = (time) => {
      if (!containerRef.current) return

      // Calculate delta time for consistent animation speed
      const deltaTime = prevTime ? (time - prevTime) / 1000 : 1 / 60
      prevTime = time

      let moveBy = directionFactor.current * baseVelocity * deltaTime

      // Add scroll influence, but limit its effect
      const scrollInfluence = scrollVelocity.get() * 2
      moveBy +=
        directionFactor.current *
        Math.min(Math.abs(scrollInfluence), 10) *
        Math.sign(scrollInfluence)

      baseX.set((baseX.get() || 0) + moveBy)

      frameId = requestAnimationFrame(updatePosition)
    }

    frameId = requestAnimationFrame(updatePosition)

    return () => {
      unsubscribeY()
      cancelAnimationFrame(frameId)
    }
  }, [baseVelocity, baseX, scrollVelocity, scrollY, prefersReducedMotion])

  // Transform baseX to a wrapped percentage
  const x = useTransform(baseX, (value) => {
    return prefersReducedMotion ? 0 : `${wrap(-20, -45, value)}%`
  })

  return (
    <div
      ref={containerRef}
      className="overflow-hidden whitespace-nowrap flex flex-nowrap m-0 py-4"
    >
      <motion.div
        className="text-2xl font-bold uppercase tracking-widest flex whitespace-nowrap flex-nowrap"
        style={{ x }}
      >
        {prefersReducedMotion ? (
          // Static content for reduced motion preference
          <span className="mx-4">{children}</span>
        ) : (
          // Repeated spans for continuous scrolling effect
          <>
            <span className="block mr-4">{children}</span>
            <span className="block mr-4">{children}</span>
            <span className="block mr-4">{children}</span>
            <span className="block mr-4">{children}</span>
          </>
        )}
      </motion.div>
    </div>
  )
}
