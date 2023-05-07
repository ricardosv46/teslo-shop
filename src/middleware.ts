import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  
  const session: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 

   if (req.nextUrl.pathname.startsWith('/auth')) {
    if (session) {
      // Obtener el valor de "p" y decodificarlo
        const queryParamP = new URLSearchParams(req.nextUrl.search).get('p');
        const decodedP = queryParamP ? decodeURIComponent(queryParamP) : null;
        const url = req.nextUrl.clone();
        url.pathname = decodedP || '/';
        url.search = '';
        console.log({decodedP})
        return NextResponse.redirect(url);
    }
  }
 
 // validacion si no esta logeaddo
  if (!session) {
    if (!req.nextUrl.pathname.startsWith('/auth')) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedPage}`;
    return NextResponse.redirect(url);
  }
}
 
 
  //validacion si esta logeado pero no es administrador
  const validRoles = ['admin','super-user','SEO'];

  if (req.nextUrl.pathname.startsWith('/admin')) {

    if ( !validRoles.includes( session.user.role ) ) {
      const url = req.nextUrl.clone();
      url.pathname = `/`;
      return NextResponse.redirect(url);
    }
  }

  //validacion si esta logeado pero no es administrador
  if (req.nextUrl.pathname.startsWith('/api/admin')) {

    if ( !validRoles.includes( session.user.role ) ) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
    }
  }
 
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/auth/:path*','/checkout/address', '/checkout/summary','/orders/history','/orders/:path*','/admin/:path*','/api/admin/:path*','/((?!api/admin/upload)api/admin/:path*)',]
};