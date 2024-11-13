/* // app/api/assignments/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Handle GET requests
export async function GET() {
  try {
    const assignments = await prisma.homework.findMany({
      include: {
        category: true, // Include category details
        teacher: true,  // Include teacher details
      },
    });
    
    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}



 */
// app/api/assignments/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Handle GET requests
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId");

  try {
    // Filter by teacher ID if it's provided
    const whereClause = teacherId ? { teacherId: parseInt(teacherId) } : {};

    const assignments = await prisma.homework.findMany({
      where: whereClause,
      include: {
        category: true,
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    

    return NextResponse.json(assignments);
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

