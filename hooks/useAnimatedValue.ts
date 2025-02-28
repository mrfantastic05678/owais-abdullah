"use client"

import { useEffect } from "react"
import { useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion"

export const useAnimatedValue = (finalValue: number): [MotionValue<number>, MotionValue<number>] => {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { duration: 2000 })
  const progressValue = useTransform(springValue, Math.round)

  useEffect(() => {
    motionValue.set(finalValue)
  }, [finalValue, motionValue])

  return [springValue, progressValue]
}

