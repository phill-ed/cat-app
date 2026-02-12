"use client"

import { useEffect } from "react"

export default function AccessibilityPage() {
  useEffect(() => {
    document.title = "Accessibility Statement | CAT App"
  }, [])

  return (
    <main id="main-content" className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Accessibility Statement
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              CAT App is committed to ensuring digital accessibility for people with disabilities.
              We continually improve the user experience for everyone and apply relevant accessibility standards.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Conformance Status
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and
              developers to improve accessibility for people with disabilities. It defines three
              levels of conformance: Level A, Level AA, and Level AAA.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              CAT App is designed to conform with WCAG 2.1 Level AA.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Accessibility Features
            </h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Keyboard navigation support</li>
              <li>Screen reader compatibility</li>
              <li>High contrast mode support</li>
              <li>Resizable text without breaking layout</li>
              <li>Clear focus indicators</li>
              <li>Semantic HTML structure</li>
              <li>Alternative text for images</li>
              <li>Form labels and error messages</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Keyboard Navigation
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our application supports standard keyboard navigation:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li><kbd>Tab</kbd> - Move focus to next element</li>
              <li><kbd>Shift + Tab</kbd> - Move focus to previous element</li>
              <li><kbd>Enter</kbd> - Activate buttons and links</li>
              <li><kbd>Space</kbd> - Toggle checkboxes and buttons</li>
              <li><kbd>Arrow keys</kbd> - Navigate within menus and lists</li>
              <li><kbd>Escape</kbd> - Close dialogs and menus</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Assistive Technologies
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              CAT App is tested with the following assistive technologies:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>NVDA on Windows</li>
              <li>VoiceOver on macOS</li>
              <li>TalkBack on Android</li>
              <li>VoiceOver on iOS</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We welcome your feedback on the accessibility of CAT App. Please let us know if you
              encounter accessibility barriers:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
              <li>Email: tendaedwin.et@gmail.com</li>
              <li>Phone: +62 XXX-XXXX-XXXX</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Date
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              This statement was last updated on February 12, 2026.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
