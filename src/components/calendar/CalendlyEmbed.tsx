'use client'

import { useEffect } from 'react'

interface CalendlyEmbedProps {
  url: string
  height?: number
}

export function CalendlyEmbed({ url, height = 700 }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        'script[src="https://assets.calendly.com/assets/external/widget.js"]'
      )
      if (existingScript) {
        existingScript.remove()
      }
    }
  }, [])

  return (
    <div
      className="calendly-inline-widget rounded-lg border overflow-hidden"
      data-url={url}
      style={{ minWidth: '320px', height: `${height}px` }}
    />
  )
}
