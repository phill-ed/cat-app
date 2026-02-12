import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// POST - Start a new test session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { testId } = body

    // Get test details with questions
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            points: true,
            answers: {
              select: { id: true, text: true }
            }
          }
        }
      }
    })

    if (!test) {
      return NextResponse.json(
        { error: "Test not found" },
        { status: 404 }
      )
    }

    if (!test.isActive) {
      return NextResponse.json(
        { error: "This test is not active" },
        { status: 400 }
      )
    }

    // Shuffle questions if enabled
    let questions = test.questions
    if (test.shuffleQuestions) {
      questions = shuffleArray(questions)
    }

    // Shuffle answers if enabled
    if (test.shuffleAnswers) {
      questions = questions.map(q => ({
        ...q,
        answers: shuffleArray(q.answers)
      }))
    }

    // Create session
    const sessionRecord = await prisma.testSession.create({
      data: {
        userId: session.user.id,
        testId: test.id,
        status: "IN_PROGRESS",
        startedAt: new Date()
      }
    })

    // Return session with questions (without correct answers)
    const safeQuestions = questions.map(q => ({
      id: q.id,
      text: q.text,
      points: q.points,
      answers: q.answers.map(a => ({
        id: a.id,
        text: a.text
      }))
    }))

    return NextResponse.json({
      sessionId: sessionRecord.id,
      test: {
        title: test.title,
        duration: test.duration,
        totalQuestions: test.totalQuestions
      },
      questions: safeQuestions,
      startedAt: sessionRecord.startedAt
    }, { status: 201 })
  } catch (error) {
    console.error("Error starting session:", error)
    return NextResponse.json(
      { error: "Failed to start test session" },
      { status: 500 }
    )
  }
}

// GET - Get user's sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const where: any = { userId: session.user.id }
    if (status) where.status = status

    const sessions = await prisma.testSession.findMany({
      where,
      include: {
        test: {
          select: { id: true, title: true, category: true }
        }
      },
      orderBy: { startedAt: "desc" }
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Error fetching sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
