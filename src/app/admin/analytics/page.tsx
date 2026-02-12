"use client"

import { useEffect, useState, useRef } from "react"
import {
  Users,
  FileQuestion,
  ClipboardList,
  TrendingUp,
  Trophy,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { Bar, Line, Doughnut } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface AnalyticsData {
  overview: {
    totalUsers: number
    totalTests: number
    totalQuestions: number
    totalSessions: number
    completedSessions: number
    averageScore: number
    passRate: number
  }
  charts: {
    sessionsByDay: { date: string; count: number; avgScore: number }[]
    testsByCategory: { category: string; count: number }[]
    questionsByCategory: { category: string; count: number }[]
    questionsByDifficulty: { difficulty: string; count: number }[]
  }
  topPerformers: {
    name: string | null
    email: string
    avgScore: number
    completedTests: number
  }[]
  recentSessions: {
    id: string
    user: { name: string | null; email: string }
    test: { title: string; category: string }
    status: string
    score: number | null
    startedAt: string
  }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState("30")

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/analytics?period=${period}`)
        const result = await res.json()
        if (result.overview) setData(result)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [period])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load analytics data
      </div>
    )
  }

  // Chart data
  const sessionsChartData = {
    labels: data.charts.sessionsByDay.slice(-14).map(d => {
      const date = new Date(d.date)
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })
    }),
    datasets: [
      {
        label: "Sessions",
        data: data.charts.sartsByDay.slice(-14).map(d => d.count),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4
      }
    ]
  }

  const categoryChartData = {
    labels: data.charts.testsByCategory.map(c => c.category),
    datasets: [
      {
        data: data.charts.testsByCategory.map(c => c.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)"
        ]
      }
    ]
  }

  const difficultyChartData = {
    labels: data.charts.questionsByDifficulty.map(d => d.difficulty),
    datasets: [
      {
        label: "Questions",
        data: data.charts.questionsByDifficulty.map(d => d.count),
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)"
        ]
      }
    ]
  }

  const statCards = [
    {
      title: "Total Users",
      value: data.overview.totalUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
      change: "+12%",
      positive: true
    },
    {
      title: "Total Tests",
      value: data.overview.totalTests,
      icon: ClipboardList,
      color: "bg-green-100 text-green-600",
      change: "+5%",
      positive: true
    },
    {
      title: "Total Questions",
      value: data.overview.totalQuestions,
      icon: FileQuestion,
      color: "bg-purple-100 text-purple-600",
      change: "+23%",
      positive: true
    },
    {
      title: "Avg Score",
      value: `${data.overview.averageScore}%`,
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      change: "-2%",
      positive: false
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Performance metrics and insights
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <span
                className={`flex items-center text-sm ${
                  card.positive ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.positive ? (
                  <ArrowUp className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDown className="w-4 h-4 mr-1" />
                )}
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {card.value}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sessions Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sessions Over Time
          </h2>
          <div className="h-64">
            <Line
              data={sessionsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: { beginAtZero: true }
                }
              }}
            />
          </div>
        </div>

        {/* Tests by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tests by Category
          </h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut
              data={categoryChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right"
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Question Difficulty */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Questions by Difficulty
          </h2>
          <div className="h-48">
            <Bar
              data={difficultyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                }
              }}
            />
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performers
          </h2>
          {data.topPerformers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No data available</p>
          ) : (
            <div className="space-y-3">
              {data.topPerformers.map((user, index) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {user.avgScore}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.completedTests} tests
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        {data.recentSessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Test
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.recentSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {session.user.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">{session.user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {session.test.title}
                      </p>
                      <p className="text-xs text-gray-500">{session.test.category}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          session.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : session.status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {session.score !== null ? `${Math.round(session.score)}%` : "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(session.startedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
