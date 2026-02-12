"use client"

import { useEffect, useRef } from "react"

interface PageAnnouncerProps {
  title: string
}

export function PageAnnouncer({ title }: PageAnnouncerProps) {
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute("aria-live", "polite")
      announcerRef.current.setAttribute("aria-atomic", "true")
    }
  }, [])

  return (
    <div
      ref={announcerRef}
      className="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {title}
    </div>
  )
}
