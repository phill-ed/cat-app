import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface ResultData {
  session: {
    id: string
    test: { title: string; category: string; passingScore: number }
    score: number | null
    timeSpent: number | null
    completedAt: string | null
  }
  result: {
    score: number
    passed: boolean
    correctAnswers: number
    totalQuestions: number
    totalPoints: number
    earnedPoints: number
    timeSpent: string
    passingScore: number
  }
  userAnswers: {
    questionId: string
    selectedAnswerId: string
    isCorrect: boolean | null
    question: { text: string; points: number }
  }[]
}

export function generateResultsPDF(data: ResultData): jsPDF {
  const doc = new jsPDF()
  const { session, result, userAnswers } = data

  // Header
  doc.setFontSize(20)
  doc.setTextColor(37, 99, 235) // Blue-600
  doc.text("CAT Test Results", 20, 20)

  doc.setFontSize(12)
  doc.setTextColor(100)
  doc.text(`Generated: ${new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, 20, 30)

  // Test Info
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text("Test Information", 20, 45)

  doc.setFontSize(10)
  doc.setTextColor(60)
  doc.text(`Test: ${session.test.title}`, 20, 55)
  doc.text(`Category: ${session.test.category}`, 20, 62)
  doc.text(`Passing Score: ${session.test.passingScore}%`, 20, 69)
  doc.text(`Date: ${session.completedAt ? new Date(session.completedAt).toLocaleDateString() : "N/A"}`, 20, 76)

  // Score Box
  const scoreY = 95
  doc.setFillColor(result.passed ? 34 : 239, result.passed ? 197 : 68, result.passed ? 94 : 68)
  doc.roundedRect(20, scoreY, 80, 40, 3, 3, "F")

  doc.setFontSize(12)
  doc.setTextColor(255)
  doc.text(result.passed ? "PASSED" : "NOT PASSED", 35, scoreY + 18)

  doc.setFontSize(24)
  doc.text(`${Math.round(result.score)}%`, 60, scoreY + 32)

  // Stats
  doc.setTextColor(0)
  doc.setFontSize(10)
  doc.text(`Correct Answers: ${result.correctAnswers} / ${result.totalQuestions}`, 110, scoreY + 10)
  doc.text(`Total Points: ${result.earnedPoints} / ${result.totalPoints}`, 110, scoreY + 20)
  doc.text(`Time Spent: ${result.timeSpent}`, 110, scoreY + 30)
  doc.text(`Score: ${Math.round(result.score)}%`, 110, scoreY + 40)

  // Answer Details
  let yPos = 150

  doc.setFontSize(14)
  doc.text("Answer Details", 20, yPos)
  yPos += 10

  const tableData = userAnswers.map((answer, index) => [
    (index + 1).toString(),
    answer.question.text.substring(0, 50) + (answer.question.text.length > 50 ? "..." : ""),
    answer.isCorrect ? "✓" : "✗",
    answer.question.points.toString()
  ])

  autoTable(doc, {
    startY: yPos,
    head: [["#", "Question", "Status", "Points"]],
    body: tableData,
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    styles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 100 },
      2: { cellWidth: 25, halign: "center" },
      3: { cellWidth: 25, halign: "center" }
    }
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Page ${i} of ${pageCount} | CAT App Results | Session ID: ${session.id}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    )
  }

  return doc
}
