import fs from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("Processing homework addition...");

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");
    const teacherId = formData.get("teacherId");
    const categoryId = formData.get("categoryId");
    const file = formData.get("file");

    console.log("Received homework data:", { title, description, dueDate, teacherId, categoryId });

    // Validate required fields
    if (!title || !description || !dueDate || !teacherId || !categoryId) {
      console.error("Missing required fields");
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Validate teacher ID
    const teacher = await prisma.user.findFirst({
      where: { id: parseInt(teacherId, 10), role: "teacher" },
    });
    if (!teacher) {
      console.error("Invalid teacher ID or role");
      return NextResponse.json({ message: "Invalid teacher ID or role" }, { status: 400 });
    }

    // Validate category ID
    const category = await prisma.category.findUnique({
      where: { id: parseInt(categoryId, 10) },
    });
    if (!category) {
      console.error("Invalid category ID");
      return NextResponse.json({ message: "Invalid category ID" }, { status: 400 });
    }

    // Handle file upload
    let fileUrl = null;
    if (file && typeof file.stream === "function") {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", fileName);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      const reader = file.stream().getReader();
      const data = [];
      let done;
      do {
        const { value, done: isDone } = await reader.read();
        done = isDone;
        if (value) {
          data.push(value);
        }
      } while (!done);

      fs.writeFileSync(filePath, Buffer.concat(data));
      fileUrl = `/uploads/${fileName}`;
    }

    // Add homework to database
    const homework = await prisma.homework.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        teacherId: parseInt(teacherId, 10),
        categoryId: parseInt(categoryId, 10),
        fileUrl,
        fileType: file ? file.type : null,
        fileName: file ? file.name : null,
      },
    });

    console.log("Homework successfully added:", homework);
    return NextResponse.json({ message: "Homework added successfully", homework });
  } catch (error) {
    console.error("Error processing homework addition:", error);
    return NextResponse.json({ message: "Failed to add homework", error: error.message }, { status: 500 });
  }
}
