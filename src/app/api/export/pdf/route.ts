import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateResultsPDF } from "@/lib/pdf"

const prisma = new PrismaClient()

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
        test: {
          include: {
            questions: {
              include: { answers: true }
            }
          }
        },
        answers: {
          include: {
            question: {
              select: { id: true, text: true, points: true }
            }
          }
        },
        user: {
          select: { name: true, email: true }
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

    // Calculate result
    let correctAnswers = 0
    let earnedPoints = 0
    let totalPoints = 0

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

    // Format time spent
    const timeSpent = sessionRecord.timeSpent 
      ? `${Math.floor(sessionRecord.timeSpent / 60)}m ${sessionRecord.timeSpent % 60}s`
      : "N/A"

    // Prepare data for PDF
    const resultData = {
      session: {
        id: sessionRecord.id,
        test: {
          title: sessionRecord.test.title,
          category: sessionRecord.test.category,
          passingScore: sessionRecord.test.passingScore
        },
        score,
        timeSpent: sessionRecord.timeSpent,
        completedAt: sessionRecord.completedAt?.toISOString() || null
      },
      result: {
        score,
        passed,
        correctAnswers,
        totalQuestions: sessionRecord.test.questions.length,
        totalPoints,
        earnedPoints,
        timeSpent,
        passingScore: sessionRecord.test.passingScore
      },
      userAnswers: sessionRecord.answers.map(a => ({
        questionId: a.questionId,
        selectedAnswerId: a.selectedAnswerId,
        isCorrect: sessionRecord.test.questions.find(q => q.id === a.questionId)?.answers.find(
          ans => ans.id === a.selectedAnswerId && ans.isCorrect
        ) ? true : false,
        question: {
          text: sessionRecord.test.questions.find(q => q.id === a.questionId)?.text || "",
          points: sessionRecord.test.questions.find(q => q.id === a.questionId)?.points || 0
        }
      }))
    }

    // Generate PDF
    const doc = generateResultsPDF(resultData)
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"))

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="CAT-Results-${sessionRecord.test.title.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf"`
      }
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    )
  }
}
