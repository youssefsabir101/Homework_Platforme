import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany(); // Fetch all categories from the Category table
    return NextResponse.json(categories); // Return the categories as JSON
  } catch (error) {
    console.error("Error fetching categories:", error); // Log any errors
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
