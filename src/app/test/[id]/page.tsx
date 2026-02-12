"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Clock, ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Send } from "lucide-react"

interface Question {
  id: string
  text: string
  points: number
  answers: { id: string; text: string }[]
}

interface SessionData {
  sessionId: string
  test: { title: string; duration: number; totalQuestions: number }
  questions: Question[]
  startedAt: string
}

export default function TestPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Start test session
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/auth/signin?callbackUrl=/test/${testId}`)
    }
  }, [status, router, testId])

  const startTest = useCallback(async () => {
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testId })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to start test")
      }

      const data = await res.json()
      setSessionData(data)
      setTimeRemaining(data.test.duration * 60)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [testId])

  useEffect(() => {
    if (status === "authenticated" && !sessionData && !error) {
      startTest()
    }
  }, [status, sessionData, error, startTest])

  // Timer
  useEffect(() => {
    if (!sessionData) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [sessionData])

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/sessions/${sessionData!.sessionId}`, {
        method: "PUT"
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/results/${data.session.id}`)
      }
    } catch (error) {
      console.error("Failed to submit test:", error)
      // Try again or show error
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const answeredCount = Object.keys(answers).length
  const totalQuestions = sessionData?.questions.length || 0
  const progress = (answeredCount / totalQuestions) * 100

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading test...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Start Test
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!sessionData) return null

  const question = sessionData.questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {sessionData.test.title}
            </h1>
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                timeRemaining < 60
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {answeredCount} of {totalQuestions} questions answered
          </p>
        </div>
      </header>

      {/* Question Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {sessionData.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(index)}
              className={`w-10 h-10 rounded-lg font-medium text-sm transition-colors ${
                index === currentQuestion
                  ? "bg-blue-600 text-white"
                  : answers[q.id]
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:p-8">
          <div className="mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="mx-2">•</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {question.points} point{question.points > 1 ? "s" : ""}
            </span>
          </div>

          <h2 className="text-xl text-gray-900 dark:text-white mb-6">
            {question.text}
          </h2>

          <div className="space-y-3">
            {question.answers.map((answer) => (
              <button
                key={answer.id}
                onClick={() => handleAnswer(question.id, answer.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === answer.id
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[question.id] === answer.id
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300 dark:border-gray-500"
                    }`}
                  >
                    {answers[question.id] === answer.id && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <span>{answer.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Test</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(totalQuestions - 1, prev + 1)
                )
              }
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>Next</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
