"use client"

import { useEffect, useState } from "react"

export function SkipLink() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleFocus = () => setIsVisible(true)
    const handleBlur = () => setIsVisible(false)

    const link = document.getElementById("skip-link")
    link?.addEventListener("focus", handleFocus)
    link?.addEventListener("blur", handleBlur)

    return () => {
      link?.removeEventListener("focus", handleFocus)
      link?.removeEventListener("blur", handleBlur)
    }
  }, [])

  return (
    <a
      id="skip-link"
      href="#main-content"
      className={`fixed top-4 left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-lg transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      Skip to main content
    </a>
  )
}
