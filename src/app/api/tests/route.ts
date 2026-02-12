import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient()

// GET all tests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get("active") === "true"

    const where = activeOnly ? { isActive: true } : {}

    const tests = await prisma.test.findMany({
      where,
      include: {
        createdBy: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: { questions: true, sessions: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(tests)
  } catch (error) {
    console.error("Error fetching tests:", error)
    return NextResponse.json(
      { error: "Failed to fetch tests" },
      { status: 500 }
    )
  }
}

// POST create new test
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
    const { title, description, category, duration, totalQuestions, passingScore, shuffleQuestions, shuffleAnswers } = body

    const test = await prisma.test.create({
      data: {
        title,
        description,
        category,
        duration: duration || 100,
        totalQuestions: totalQuestions || 100,
        passingScore: passingScore || 60,
        shuffleQuestions: shuffleQuestions ?? true,
        shuffleAnswers: shuffleAnswers ?? true,
        createdById: session.user.id
      }
    })

    return NextResponse.json(test, { status: 201 })
  } catch (error) {
    console.error("Error creating test:", error)
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 }
    )
  }
}
