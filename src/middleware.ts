import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session cookie on every request so server
 * components always see a valid session. Required when using @supabase/ssr.
 *
 * This must NEVER break page loads just because Supabase isn't configured
 * yet or is temporarily unreachable -- every other part of this project
 * (Prisma DB calls, freight rate lookups) degrades gracefully when its
 * backing service isn't set up, and this middleware runs on every single
 * request, so a failure here would take down the entire site.
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // No Supabase configured yet (e.g. local dev before you've set up a
  // project) -- skip auth refresh entirely rather than trying and failing.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });

    await supabase.auth.getUser();
  } catch (error) {
    // Supabase unreachable / misconfigured -- log it, but still serve the page.
    console.warn("[middleware] Supabase session refresh failed, continuing without it:", error);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
