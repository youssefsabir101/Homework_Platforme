import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma"; // Ensure this import path is correct
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { id } = params; // Get the homework ID from the URL parameters

  try {
    console.log("Processing submission...");

    // Get the cookies from the request header
    const cookies = request.headers.get('cookie') || '';
    const getCookieValue = (name) => {
      const match = cookies.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    };

    const studentId = getCookieValue('id'); // Assuming 'id' is the name of the cookie for user ID

    if (!studentId) {
      console.error("User ID not found in cookies");
      return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    // Parse the form data instead of JSON
    const formData = await request.formData();
    const title = formData.get("title"); // Get the title
    const content = formData.get("answer"); // Get the answer
    const file = formData.get("file"); // Get the uploaded file

    console.log("Received submission data:", { title, content, homeworkId: id, studentId, file });

    // Check if all required fields are present
    if (!content || !title || !studentId || !id) {
      console.error("Missing required fields");
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the student has already submitted for this homework
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        studentId: parseInt(studentId, 10),
        homeworkId: parseInt(id, 10),
      },
    });

    if (existingSubmission) {
      // If a previous submission exists, delete it
      await prisma.submission.delete({
        where: { id: existingSubmission.id },
      });
      console.log("Previous submission deleted:", existingSubmission);
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

    // Create the new submission in the database
    const newSubmission = await prisma.submission.create({
      data: {
        content: title, // Store the title in the content column
        answareText: content, // Store the answer separately
        fileUrl, // Store the file URL
        studentId: parseInt(studentId, 10),
        homeworkId: parseInt(id, 10),
      },
    });

    console.log("Submission successfully saved:", newSubmission);

    // Return a success response
    return NextResponse.json({ message: 'Submission successful', submission: newSubmission });
  } catch (error) {
    console.error("Error processing submission:", error);
    // Return an error response
    return NextResponse.json({ message: 'Failed to submit homework', error: error.message }, { status: 500 });
  }
}
