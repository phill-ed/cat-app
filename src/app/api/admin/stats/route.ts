import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// GET admin dashboard statistics
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const [
      totalUsers,
      totalTests,
      totalQuestions,
      totalSessions,
      recentSessions,
      testsByCategory
    ] = await Promise.all([
      prisma.user.count(),
      prisma.test.count(),
      prisma.question.count(),
      prisma.testSession.count(),
      prisma.testSession.findMany({
        take: 10,
        orderBy: { startedAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          test: { select: { title: true, category: true } }
        }
      }),
      prisma.test.groupBy({
        by: ["category"],
        _count: { id: true }
      })
    ])

    // Calculate average score
    const completedSessions = await prisma.testSession.findMany({
      where: { status: "COMPLETED" },
      select: { score: true }
    })

    const avgScore = completedSessions.length > 0
      ? completedSessions.reduce((acc, s) => acc + (s.score || 0), 0) / completedSessions.length
      : 0

    return NextResponse.json({
      stats: {
        totalUsers,
        totalTests,
        totalQuestions,
        totalSessions,
        averageScore: Math.round(avgScore * 100) / 100
      },
      recentSessions,
      testsByCategory: testsByCategory.map(t => ({
        category: t.category,
        count: t._count.id
      }))
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    )
  }
}
