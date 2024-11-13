// app/api/assignments/add/route.js
import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma"; // Ensure this import path is correct
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    console.log("Processing homework addition...");

    // Parse the form data instead of JSON
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");
    const teacherId = formData.get("teacherId"); // Ensure this is included in the form data
    const categoryId = formData.get("categoryId");
    const file = formData.get("file");

    console.log("Received homework data:", { title, description, dueDate, teacherId, categoryId, file });

    // Check if all required fields are present
    if (!title || !description || !dueDate || !teacherId || !categoryId) {
      console.error("Missing required fields");
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Handle file upload if it exists
    let fileUrl = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`; // Create a unique file name
      const filePath = path.join(process.cwd(), 'public/uploads', fileName); // Path to save the file

      // Ensure the directory exists
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

      fs.writeFileSync(filePath, Buffer.concat(data)); // Write the file
      fileUrl = `/uploads/${fileName}`; // URL to access the file
    }

    // Create the new homework in the database
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

    // Return a success response
    return NextResponse.json({ message: 'Homework added successfully', homework });
  } catch (error) {
    console.error("Error processing homework addition:", error);
    // Return an error response
    return NextResponse.json({ message: 'Failed to add homework', error: error.message }, { status: 500 });
  }
}
