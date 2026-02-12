"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import {
  ClipboardList,
  Clock,
  Trophy,
  BookOpen,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CheckCircle
} from "lucide-react"

interface Test {
  id: string
  title: string
  description: string | null
  category: string
  duration: number
  totalQuestions: number
  passingScore: number
  isActive: boolean
}

interface SessionData {
  id: string
  status: string
  score: number | null
  startedAt: string
  test: { title: string; category: string }
}

export default function Home() {
  const { data: session, status } = useSession()
  const [tests, setTests] = useState<Test[]>([])
  const [recentSessions, setRecentSessions] = useState<SessionData[]>([])
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch active tests
        const testsRes = await fetch("/api/tests?active=true")
        if (testsRes.ok) {
          const testsData = await testsRes.json()
          setTests(testsData)
        }

        // Fetch recent sessions if logged in
        if (session) {
          const sessionsRes = await fetch("/api/sessions?status=COMPLETED")
          if (sessionsRes.ok) {
            const sessionsData = await sessionsRes.json()
            setRecentSessions(sessionsData.slice(0, 3))
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                CAT App
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    Admin
                  </Link>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {session.user?.name || session.user?.email}
                    </span>
                    <button
                      onClick={() => signOut()}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 px-4">
            {session ? (
              <div className="space-y-3">
                <Link
                  href="/admin/dashboard"
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left text-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Computer Assisted Test
            <span className="text-blue-600"> Platform</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Prepare for your certification exams with our comprehensive CAT platform.
            Practice with realistic test simulations and track your progress.
          </p>

          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => signIn()}
                className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <button className="inline-flex items-center justify-center space-x-2 px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-lg font-medium">
                <span>Learn More</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Realistic Simulations
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experience test conditions with timed sessions, shuffled questions, and realistic interface.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Detailed Results
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get instant feedback with detailed score reports, performance analytics, and improvement suggestions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Question Bank
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access thousands of practice questions covering all exam topics with difficulty levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Tests */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
            Available Tests
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
            Choose a test to start practicing
          </p>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : tests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tests available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <Link
                  key={test.id}
                  href={session ? `/test/${test.id}` : `/auth/signin?callbackUrl=/test/${test.id}`}
                  className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                      {test.category}
                    </span>
                    {test.isActive && (
                      <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Available
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {test.title}
                  </h3>

                  {test.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {test.duration} min
                    </span>
                    <span className="flex items-center">
                      <ClipboardList className="w-4 h-4 mr-1" />
                      {test.totalQuestions} questions
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Passing score: <span className="font-medium text-gray-900 dark:text-white">{test.passingScore}%</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Results (if logged in) */}
      {session && recentSessions.length > 0 && (
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">
              Your Recent Results
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mb-12">
              Review your past test performance
            </p>

            <div className="space-y-4">
              {recentSessions.map((sessionData) => (
                <div
                  key={sessionData.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {sessionData.test.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sessionData.test.category} • {new Date(sessionData.startedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      sessionData.score !== null && sessionData.score >= 60
                        ? "text-green-500"
                        : "text-red-500"
                    }`}>
                      {sessionData.score !== null ? `${Math.round(sessionData.score)}%` : "-"}
                    </div>
                    <span className={`text-sm ${
                      sessionData.score !== null && sessionData.score >= 60
                        ? "text-green-600"
                        : "text-red-600"
                    }`}>
                      {sessionData.score !== null && sessionData.score >= 60 ? "Passed" : "Not Passed"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Results
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ClipboardList className="w-6 h-6" />
            <span className="text-lg font-bold text-white">CAT App</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} CAT App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
