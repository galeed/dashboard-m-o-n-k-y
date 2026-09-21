"use client"

import { useCallback, useEffect, useState } from "react"
import { RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OrientationToggle() {
  const [orientation, setOrientation] = useState<OrientationType>("portrait-primary")
  useEffect(() => {
    const screenOrientation = window.screen.orientation
    setOrientation(screenOrientation?.type ?? (window.innerWidth > window.innerHeight ? "landscape-primary" : "portrait-primary"))
    const update = () => setOrientation(window.screen.orientation?.type ?? (window.innerWidth > window.innerHeight ? "landscape-primary" : "portrait-primary"))
    window.addEventListener("orientationchange", update)
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("orientationchange", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  const toggleOrientation = useCallback(async () => {
    const target = orientation.startsWith("portrait") ? "landscape-primary" : "portrait-primary"
    try {
      if (window.screen.orientation?.lock) await window.screen.orientation.lock(target)
    } catch {
      // Browsers only allow locking after install/fullscreen; manual rotation remains supported.
    }
  }, [orientation])

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8"
      aria-label={orientation.startsWith("portrait") ? "Girar a horizontal" : "Girar a vertical"}
      title={orientation.startsWith("portrait") ? "Girar a horizontal" : "Girar a vertical"}
      onClick={() => void toggleOrientation()}
    >
      <RotateCw className="size-4" aria-hidden="true" />
    </Button>
  )
}
