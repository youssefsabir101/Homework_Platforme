import fs from 'fs';
import path from 'path';
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { id } = params;

  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const dueDate = formData.get("dueDate");
    const categoryId = formData.get("categoryId");
    const file = formData.get("file");

    if (!title || !description || !dueDate || !categoryId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let fileUrl = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);

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

    const updatedHomework = await prisma.homework.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        categoryId: parseInt(categoryId),
        fileUrl: fileUrl || undefined,
        fileName: file ? file.name : undefined,
        fileType: file ? file.type : undefined,
      },
    });

    return NextResponse.json(updatedHomework);
  } catch (error) {
    console.error("Error updating homework:", error);
    return NextResponse.json({ error: 'Failed to update homework' }, { status: 500 });
  }
}
