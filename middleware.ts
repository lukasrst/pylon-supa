import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Hier setzen wir die Cookies direkt auf Request UND Response
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Nutze getUser() für eine sichere Prüfung
  const { data: { user } } = await supabase.auth.getUser()

  const url = new URL(request.url)

  // Logik: Eingeloggt auf Auth-Seiten? -> Dashboard
  if (user && (url.pathname === '/login' || url.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Logik: Nicht eingeloggt auf Protected-Seiten? -> Login
  const protectedPaths = ['/dashboard', '/settings', '/api-keys', '/notifications']
  if (!user && protectedPaths.some(path => url.pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|assets|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}