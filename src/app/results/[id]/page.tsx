"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Trophy,
  RefreshCw,
  Home,
  Share2,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Target
} from "lucide-react"

interface ResultData {
  session: {
    id: string
    test: { title: string; category: string; passingScore: number }
    score: number | null
    timeSpent: number | null
    completedAt: string | null
  }
  result: {
    score: number
    passed: boolean
    correctAnswers: number
    totalQuestions: number
    totalPoints: number
    earnedPoints: number
    timeSpent: string
    passingScore: number
  }
}

export default function ResultsPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const sessionId = params.id as string

  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`)
        if (!res.ok) throw new Error("Failed to fetch results")
        const data = await res.json()
        setResultData(data)
      } catch (error) {
        console.error("Failed to fetch results:", error)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchResults()
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Results Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't find the test results you're looking for.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const { session, result } = resultData
  const isPassed = result.passed

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Result Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div
            className={`py-8 px-6 text-center ${
              isPassed
                ? "bg-gradient-to-r from-green-500 to-emerald-600"
                : "bg-gradient-to-r from-red-500 to-orange-600"
            }`}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-4">
              {isPassed ? (
                <Trophy className="w-10 h-10 text-white" />
              ) : (
                <Target className="w-10 h-10 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isPassed ? "Congratulations!" : "Keep Practicing!"}
            </h1>
            <p className="text-white/80">
              {isPassed
                ? "You have successfully passed this test."
                : "You didn't pass this time, but practice makes perfect."}
            </p>
          </div>

          {/* Score */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-gray-200 dark:text-gray-700"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${result.score * 4.4} 440`}
                    strokeLinecap="round"
                    className={
                      isPassed
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 dark:text-white">
                      {Math.round(result.score)}%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Your Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-4 space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {result.correctAnswers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {result.totalQuestions - result.correctAnswers}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                  {result.passingScore}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Passing</div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Test</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.test.title}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Category</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {session.test.category}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Time Spent</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.timeSpent}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Points</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.earnedPoints} / {result.totalPoints}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Back to Home</span>
            </button>

            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/test/${session.test.title}`)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        {!isPassed && (
          <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Tips for Next Time
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Review the topics you got wrong</li>
              <li>• Practice with more sample questions</li>
              <li>• Manage your time better during the test</li>
              <li>• Read questions more carefully</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
