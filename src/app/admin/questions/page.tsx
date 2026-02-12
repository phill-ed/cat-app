"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react"

interface Question {
  id: string
  text: string
  category: string
  difficulty: string
  points: number
  createdAt: string
  test?: { title: string }
  _count?: { answers: number }
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  MEDIUM: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  HARD: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [categoryFilter])

  async function fetchQuestions() {
    try {
      const params = new URLSearchParams()
      if (categoryFilter) params.set("category", categoryFilter)
      const res = await fetch(`/api/questions?${params}`)
      const data = await res.json()
      if (data.questions) setQuestions(data.questions)
    } catch (error) {
      console.error("Failed to fetch questions:", error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" })
      if (res.ok) {
        setQuestions(questions.filter((q) => q.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete question:", error)
    }
  }

  const filteredQuestions = questions.filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.category.toLowerCase().includes(search.toLowerCase())
  )

  const categories = [...new Set(questions.map((q) => q.category))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Questions
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your question bank
          </p>
        </div>
        <button
          onClick={() => {
            setEditingQuestion(null)
            setShowModal(true)
          }}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">Loading...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <FileQuestion className="w-12 h-12 mb-4" />
          <p>No questions found</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Add your first question
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredQuestions.map((question) => (
                  <tr
                    key={question.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {question.text}
                      </p>
                      {question.test && (
                        <p className="text-xs text-gray-500 mt-1">
                          Test: {question.test.title}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                        {question.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          difficultyColors[question.difficulty] ||
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {question.points}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingQuestion(question)
                          setShowModal(true)
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Question Modal would go here */}
      {showModal && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => {
            setShowModal(false)
            setEditingQuestion(null)
          }}
          onSave={() => {
            setShowModal(false)
            setEditingQuestion(null)
            fetchQuestions()
          }}
        />
      )}
    </div>
  )
}

// Simple placeholder for modal
function QuestionModal({
  question,
  onClose,
  onSave,
}: {
  question: Question | null
  onClose: () => void
  onSave: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {question ? "Edit Question" : "Add New Question"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Question form would go here. This is a placeholder for the full form with:
            <br />
            - Question text input
            <br />
            - Category & difficulty selection
            <br />
            - Multiple answer options (A, B, C, D, E)
            <br />
            - Correct answer selection
            <br />
            - Explanation field
          </p>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Question
          </button>
        </div>
      </div>
    </div>
  )
}
