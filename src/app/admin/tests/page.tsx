"use client"

import { useEffect, useState } from "react"
import { Plus, Edit2, Trash2, Users, FileQuestion } from "lucide-react"
import Link from "next/link"

interface Test {
  id: string
  title: string
  description: string | null
  category: string
  duration: number
  totalQuestions: number
  passingScore: number
  isActive: boolean
  createdAt: string
  _count: { questions: number; sessions: number }
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTests() {
      try {
        const res = await fetch("/api/tests")
        const data = await res.json()
        if (Array.isArray(data)) setTests(data)
      } catch (error) {
        console.error("Failed to fetch tests:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTests()
  }, [])

  async function deleteTest(id: string) {
    if (!confirm("Are you sure you want to delete this test?")) return
    // Implementation would call DELETE /api/tests/${id}
    alert("Delete functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tests
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage CAT tests and exams
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Test
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <ClipboardList className="w-12 h-12 mb-4" />
          <p>No tests created yet</p>
          <button className="mt-4 text-blue-600 hover:text-blue-700">
            Create your first test
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {test.title}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded mt-2 inline-block">
                      {test.category}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      test.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {test.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {test.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {test.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {test.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <FileQuestion className="w-4 h-4" />
                    {test._count.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {test._count.sessions} attempts
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-500">
                    Pass: {test.passingScore}%
                  </span>
                  <div className="flex space-x-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTest(test.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Clock({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClipboardList({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  )
}
