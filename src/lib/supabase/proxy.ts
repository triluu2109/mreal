import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getSupabasePublicKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/admin/login";

  if (!isAdminRoute) {
    await supabase.auth.getClaims();
    return response;
  }

  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (!isLoginRoute && !userId) {
    return withSessionCookies(redirectToLogin(request), response);
  }

  if (userId) {
    const { data: profile } = await supabase
      .from("admin_profiles")
      .select("id")
      .eq("user_id", userId)
      .eq("is_active", true)
      .is("deleted_at", null)
      .maybeSingle();

    if (!profile) {
      await supabase.auth.signOut();
      return withSessionCookies(redirectToLogin(request, false), response);
    }

    if (isLoginRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return withSessionCookies(NextResponse.redirect(url), response);
    }
  }

  return response;
}

function redirectToLogin(request: NextRequest, preserveNext = true) {
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  if (preserveNext) {
    url.searchParams.set("next", request.nextUrl.pathname);
  } else {
    url.search = "";
  }
  return NextResponse.redirect(url);
}

function withSessionCookies(target: NextResponse, sessionResponse: NextResponse) {
  sessionResponse.cookies.getAll().forEach((cookie) => {
    target.cookies.set(cookie);
  });
  return target;
}
