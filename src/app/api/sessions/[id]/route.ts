import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

interface AnswerInput {
  questionId: string
  selectedAnswerId: string
}

// GET - Get session details (for continuing)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const sessionRecord = await prisma.testSession.findUnique({
      where: { id: params.id },
      include: {
        test: true,
        answers: {
          include: {
            question: {
              select: { id: true, text: true, points: true }
            }
          }
        }
      }
    })

    if (!sessionRecord) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    if (sessionRecord.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Calculate time spent
    const startedAt = new Date(sessionRecord.startedAt).getTime()
    const now = Date.now()
    const timeSpent = Math.floor((now - startedAt) / 1000)
    const remainingTime = (sessionRecord.test.duration * 60) - timeSpent

    return NextResponse.json({
      ...sessionRecord,
      timeSpent,
      remainingTime: remainingTime > 0 ? remainingTime : 0
    })
  } catch (error) {
    console.error("Error fetching session:", error)
    return NextResponse.json(
      { error: "Failed to fetch session" },
      { status: 500 }
    )
  }
}

// POST - Submit answer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const sessionRecord = await prisma.testSession.findUnique({
      where: { id: params.id }
    })

    if (!sessionRecord) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    if (sessionRecord.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    if (sessionRecord.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: "Session is not active" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { questionId, selectedAnswerId } = body as AnswerInput

    // Check if already answered
    const existingAnswer = await prisma.userAnswer.findFirst({
      where: {
        sessionId: params.id,
        questionId
      }
    })

    if (existingAnswer) {
      // Update existing answer
      await prisma.userAnswer.update({
        where: { id: existingAnswer.id },
        data: {
          selectedAnswerId,
          answeredAt: new Date()
        }
      })
    } else {
      // Create new answer
      await prisma.userAnswer.create({
        data: {
          sessionId: params.id,
          questionId,
          selectedAnswerId,
          answeredAt: new Date()
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting answer:", error)
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    )
  }
}

// PUT - Complete/Submit test
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const sessionRecord = await prisma.testSession.findUnique({
      where: { id: params.id },
      include: {
        test: {
          include: {
            questions: {
              include: { answers: true }
            }
          }
        },
        answers: true
      }
    })

    if (!sessionRecord) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      )
    }

    if (sessionRecord.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Calculate score
    let correctAnswers = 0
    let totalPoints = 0
    let earnedPoints = 0

    for (const question of sessionRecord.test.questions) {
      totalPoints += question.points
      
      const userAnswer = sessionRecord.answers.find(
        a => a.questionId === question.id
      )

      if (userAnswer) {
        const isCorrect = question.answers.find(
          a => a.id === userAnswer.selectedAnswerId && a.isCorrect
        )

        if (isCorrect) {
          correctAnswers++
          earnedPoints += question.points
        }
      }
    }

    const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0
    const passed = score >= sessionRecord.test.passingScore

    // Calculate time spent
    const startedAt = new Date(sessionRecord.startedAt).getTime()
    const completedAt = Date.now()
    const timeSpentSeconds = Math.floor((completedAt - startedAt) / 1000)

    // Update session
    const completedSession = await prisma.testSession.update({
      where: { id: params.id },
      data: {
        status: "COMPLETED",
        score,
        completedAt: new Date(completedAt),
        timeSpent: timeSpentSeconds
      },
      include: {
        test: {
          select: { title: true, category: true, passingScore: true }
        },
        answers: {
          include: {
            question: {
              select: { id: true, text: true, points: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      result: {
        score: Math.round(score * 100) / 100,
        passed,
        correctAnswers,
        totalQuestions: sessionRecord.test.questions.length,
        totalPoints,
        earnedPoints,
        timeSpent: formatTime(timeSpentSeconds),
        passingScore: sessionRecord.test.passingScore
      },
      session: completedSession
    })
  } catch (error) {
    console.error("Error completing session:", error)
    return NextResponse.json(
      { error: "Failed to complete test" },
      { status: 500 }
    )
  }
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  }
  return `${secs}s`
}
