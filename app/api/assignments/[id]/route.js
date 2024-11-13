/* // app/api/assignments/[id]/route.js
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  try {
    console.log("Fetching homework with ID:", id);

    const homework = await prisma.homework.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true, // Include category details
        teacher: true,  // Include teacher details
        viewedBy: true, // Include students who viewed this homework
      },
    });

    if (!homework) {
      console.log("Homework not found for ID:", id);
      return NextResponse.json({ error: "Homework not found" }, { status: 404 });
    }

    console.log("Homework found:", homework);
    return NextResponse.json(homework);
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json({ error: "Failed to fetch homework data" }, { status: 500 });
  }
} 
  



    export async function PUT(request, { params }) {
      const { id } = params;
      const { title, description, dueDate, categoryId } = await request.json(); // Include categoryId in the destructured data
    
      try {
        const updatedHomework = await prisma.homework.update({
          where: { id: parseInt(id) },
          data: {
            title,
            description,
            dueDate: new Date(dueDate),
            categoryId: parseInt(categoryId), // Update the categoryId field
          },
        });
    
        return NextResponse.json(updatedHomework);
      } catch (error) {
        console.error("Failed to update homework:", error);
        return NextResponse.json({ error: "Failed to update homework" }, { status: 500 });
      }
    }
 */

    // app/api/assignments/[id]/route.js
    import prisma from "@/lib/prisma";
    import { NextResponse } from "next/server";
    import fs from "fs";
    import path from "path";
    
    export async function GET(request, { params }) {
      const { id } = params;
    
      try {
        console.log("Fetching homework with ID:", id);
    
        const homework = await prisma.homework.findUnique({
          where: { id: parseInt(id) },
          include: {
            category: true,  // Include category details
            teacher: true,   // Include teacher details
            submissions: {
              include: {
                student: {  // Include student details related to each submission
                  select: {
                    id: true,
                    name: true,
                    loginCode: true,
                  },
                },
              },
            },
          },
        });
    
        if (!homework) {
          console.log("Homework not found for ID:", id);
          return NextResponse.json({ error: "Homework not found" }, { status: 404 });
        }
    
        console.log("Homework found:", homework);
        return NextResponse.json(homework);
      } catch (error) {
        console.error("Error fetching homework:", error);
        return NextResponse.json({ error: "Failed to fetch homework data" }, { status: 500 });
      }
    }
    
    export async function PUT(request, { params }) {
      const { id } = params;
      const { title, description, dueDate, categoryId } = await request.json(); // Include categoryId in the destructured data
    
      try {
        const updatedHomework = await prisma.homework.update({
          where: { id: parseInt(id) },
          data: {
            title,
            description,
            dueDate: new Date(dueDate),
            categoryId: parseInt(categoryId), // Update the categoryId field
          },
        });
    
        return NextResponse.json(updatedHomework);
      } catch (error) {
        console.error("Failed to update homework:", error);
        return NextResponse.json({ error: "Failed to update homework" }, { status: 500 });
      }
    }

   /*  export async function DELETE(req, { params }) {
      const { id } = params;
    
      try {
        // Validate ID
        if (!id) {
          return new Response("ID is required", { status: 400 });
        }
    
        // Perform the delete operation using Prisma
        await prisma.homework.delete({
          where: { id: parseInt(id) }, // Ensure 'id' is of the correct type
        });
    
        return new Response("Homework deleted successfully", { status: 200 });
      } catch (error) {
        console.error("Error deleting homework:", error);
        return new Response("Failed to delete homework", { status: 500 });
      }
    } */


      export async function DELETE(req, { params }) {
        const { id } = params;
      
        try {
          // Validate ID
          if (!id) {
            return new Response("ID is required", { status: 400 });
          }
      
          // Fetch the homework entry to get the file details
          const homework = await prisma.homework.findUnique({
            where: { id: parseInt(id) },
          });
      
          if (!homework) {
            return new Response("Homework not found", { status: 404 });
          }
      
          // Delete related submissions first
          const submissions = await prisma.submission.findMany({
            where: { homeworkId: parseInt(id) },
          });
      
          // Delete files associated with each submission, if any
          for (const submission of submissions) {
            if (submission.fileUrl) {
              const filePath = path.join(process.cwd(), submission.fileUrl);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the submission file from the server
              }
              // Handle cloud storage deletion here if necessary
            }
          }
      
          // Delete submissions from the database
          await prisma.submission.deleteMany({
            where: { homeworkId: parseInt(id) },
          });
      
          // Check if a file is associated with the homework and delete it
          if (homework.fileUrl) {
            const filePath = path.join(process.cwd(), homework.fileUrl); // Adjust file storage path
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath); // Delete the file from the server
            }
            // Handle cloud storage deletion here if necessary
          }
      
          // Now delete the homework record from the database
          await prisma.homework.delete({
            where: { id: parseInt(id) },
          });
      
          return new Response("Homework and associated submissions deleted successfully", { status: 200 });
        } catch (error) {
          console.error("Error deleting homework and submissions:", error);
          return new Response("Failed to delete homework and submissions", { status: 500 });
        }
      }




