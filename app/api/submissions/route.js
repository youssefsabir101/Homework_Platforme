import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const homeworkId = searchParams.get("homeworkId");

  if (!studentId || !homeworkId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const submission = await prisma.submission.findFirst({
      where: {
        studentId: parseInt(studentId),
        homeworkId: parseInt(homeworkId),
      },
      include: {
        student: {
          select: {
            name: true,
          },
        },
        homework: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Include the student's name and homework title in the response
    const submissionWithDetails = {
      ...submission,
      studentName: submission.student.name,
      homeworkTitle: submission.homework.title,
      formattedFileName: `${submission.student.name}_answer_for_${submission.homework.title}${getFileExtension(submission.fileName)}`,
    };

    return NextResponse.json(submissionWithDetails);
  } catch (error) {
    console.error("Error fetching submission:", error);
    return NextResponse.json({ error: "Failed to fetch submission" }, { status: 500 });
  }
}

function getFileExtension(fileName) {
  return fileName ? fileName.substring(fileName.lastIndexOf('.')) : '';
}