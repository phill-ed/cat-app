import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: "unknown",
    }
  }

  // Check database connection
  try {
    await prisma.$queryRaw`SELECT 1`
    health.checks.database = "healthy"
  } catch (error) {
    health.checks.database = "unhealthy"
    health.status = "degraded"
  }

  const statusCode = health.status === "healthy" ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Health-Check": "true"
    }
  })
}
