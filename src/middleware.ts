import { auth } from '@/auth'

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname.startsWith('/login')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')
  const isPublicRoute = isLoginPage || isApiRoute

  // Redirect logged-in users away from login page
  if (isLoggedIn && isLoginPage) {
    return Response.redirect(new URL('/', req.nextUrl))
  }

  // Redirect unauthenticated users to login (except for public routes)
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }

  return
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
