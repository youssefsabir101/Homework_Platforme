/* import prisma from "@/lib/prisma"; // Prisma client to interact with MySQL

export async function POST(req) {
  const { role, loginCode, email, password } = await req.json();

  let user;

  // Check credentials based on role
  if (role === "student") {
    user = await prisma.user.findUnique({
      where: { loginCode },
    });
  } else if (role === "teacher") {
    user = await prisma.user.findUnique({
      where: { email },
    });
  }

  // If no user found or passwords don't match, return an error
  if (!user || user.password !== password) {
    return new Response(JSON.stringify({ error: "Invalid login details" }), {
      status: 401,
    });
  }

  // Return the user data if successful
  return new Response(
    JSON.stringify({ user: { name: user.name, role: user.role } }),
    { status: 200 }
  );
}
  */
/* 
import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma'; // Ensure prisma is set up to connect to your DB
import { serialize } from 'cookie';

export async function POST(request) {
  const { role, loginCode, email, password } = await request.json();

  let user;

  // Find the user based on the role and credentials
  if (role === "student") {
    user = await prisma.user.findFirst({
      where: { loginCode, password, role: "student" },
    });
  } else if (role === "teacher") {
    user = await prisma.user.findFirst({
      where: { email, password, role: "teacher" },
    });
  }

  // Return error if user is not found
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Set cookies for user session
  const nameCookie = serialize('name', user.name, { path: '/', httpOnly: true });
  const roleCookie = serialize('role', user.role, { path: '/', httpOnly: true });

  const response = NextResponse.json({
    success: true,
    user: { name: user.name, role: user.role },
  });

  response.headers.set('Set-Cookie', [nameCookie, roleCookie]);
  return response;
} */


  import { NextResponse } from 'next/server';
  import prisma from '../../../../lib/prisma';
  import { serialize } from 'cookie';
  
  export async function POST(request) {
    const { role, loginCode, email, password } = await request.json();
  
    let user;
  
    // Find the user based on the role and credentials
    if (role === "student") {
      user = await prisma.user.findFirst({
        where: { loginCode, password, role: "student" },
      });
    } else if (role === "teacher") {
      user = await prisma.user.findFirst({
        where: { email, password, role: "teacher" },
      });
    }
  
    // Return error if user is not found
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  
    // Set cookies for user session
    // Example of setting cookies with path "/"
const nameCookie = serialize('name', user.name, { path: '/', httpOnly: false });
const roleCookie = serialize('role', user.role, { path: '/', httpOnly: false });
const idCookie = serialize('id', user.id, { path: '/', httpOnly: false });

  
    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, role: user.role },
    });
  
    // Setting cookies for ID, name, and role
    response.headers.set('Set-Cookie', [nameCookie, roleCookie, idCookie]);
    return response;
  }
  
