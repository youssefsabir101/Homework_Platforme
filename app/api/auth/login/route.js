
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
      user = await prisma.teacher.findFirst({
        where: { email, password, role: "teacher" },
      });
    }
  
    // Return error if user is not found
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  
    // Set cookies for user session
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
  
