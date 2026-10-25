import { NextResponse } from "next/server";
import { NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  const isAuthPage = path === '/login' || path === '/signup';
  const isPublic = isAuthPage || path === '/verifyEmail';

  const token = request.cookies.get('token')?.value || '';

  if(token && isAuthPage){
    return NextResponse.redirect(new URL('/' , request.nextUrl))
  }
  if(!isPublic && !token){
    return NextResponse.redirect(new URL('/login' , request.nextUrl))
  }

  return NextResponse.next();
}
//check if config is correct or not 

export const config = {
  matcher: ["/", "/login", "/profile", "/profile/:path*", "/signup" , "/verifyEmail"],
};
