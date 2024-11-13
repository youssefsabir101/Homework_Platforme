// app/api/homework/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const homeworkList = await prisma.homework.findMany({
      include: { teacher: true }, // Optionally include teacher details
    });
    return NextResponse.json(homeworkList);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch homework data" }, { status: 500 });
  }
}
