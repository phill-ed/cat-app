import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// GET all questions (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const testId = searchParams.get("testId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    
    if (category) where.category = category
    if (difficulty) where.difficulty = difficulty
    if (testId) where.testId = testId

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        include: {
          answers: {
            select: { id: true, text: true, isCorrect: true }
          },
          test: {
            select: { id: true, title: true }
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.question.count({ where })
    ])

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    )
  }
}

// POST create new question
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { text, explanation, difficulty, category, points, testId, answers } = body

    // Create question with answers
    const question = await prisma.question.create({
      data: {
        text,
        explanation,
        difficulty,
        category,
        points: points || 1,
        testId,
        answers: {
          create: answers.map((answer: { text: string; isCorrect: boolean }) => ({
            text: answer.text,
            isCorrect: answer.isCorrect
          }))
        }
      },
      include: {
        answers: true
      }
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error("Error creating question:", error)
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    )
  }
}
