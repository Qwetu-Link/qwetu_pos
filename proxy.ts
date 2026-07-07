export { auth as proxy } from "@/auth"
import { NextResponse } from "next/server"
import { auth } from "@/auth"

interface AuthenticatedUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  businessId?: string | null
  roleId?: string | null
  roleName?: string
}

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  // Replace: const userRole = (req.auth?.user as any)?.roleName
// With a safe type assertion:
//   const userRole = (req.auth?.user as typeof req.auth.user & { roleName?: string })?.roleName
  const userRole = (req.auth?.user as AuthenticatedUser | undefined)?.roleName
const businessId = req.auth?.user?.businessId

  const isAuthPage = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/register")
  const isAdminPage = nextUrl.pathname.startsWith("/admin")
  const isDashboardPage = nextUrl.pathname.startsWith("/dashboard")

  // 1. If hitting auth pages while already logged in, redirect based on their role profile
  if (isAuthPage && isLoggedIn) {
    if (userRole === "Super Admin" || !businessId) {
      return NextResponse.redirect(new URL("/superadmin/", nextUrl))
    }
    return NextResponse.redirect(new URL("/admin", nextUrl))
  }

  // 2. Protect Admin panel from normal team members/tenants
  if (isAdminPage && userRole !== "Super Admin") {
    return NextResponse.redirect(new URL("/admin", nextUrl))
  }

  // 3. Protect operational dashboards from unauthenticated sessions
  if (isDashboardPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  // Protect all internal application layouts while skipping static asset files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}