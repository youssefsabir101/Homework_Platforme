import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const studentsViewed = await prisma.viewedHomework.findMany({
      where: { homeworkId: parseInt(id) },
      include: { user: true }, // Change this to "user" based on your schema
    });

    if (studentsViewed.length === null) {
      return NextResponse.json({ error: "No students found" }, { status: 404 });
    }

    return NextResponse.json(studentsViewed.map(view => view.user));
  } catch (error) {
    console.error("Error fetching students viewed data:", error);
    return NextResponse.json({ error: "Failed to fetch students viewed data" }, { status: 500 });
  }
}
