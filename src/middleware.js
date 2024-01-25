// import next packages
import { NextResponse } from "next/server";

// import some modules : verify middleware
import verifyTokenJose from "@/backend/middleware/verifyTokenJose";

// middleware code define here
export default async function middleware(req) {
  // get the url and method
  const url = req.url;
  const method = req.method;

  // get the token from cookies
  const token =
    req.cookies.get("accessToken")?.value || req.headers.cookies?.accessToken;

  // get the forgot password token from cookies
  const forgotPassword =
    req.cookies.get("forgotPassword")?.value ||
    req.headers.cookies?.accessToken;

  // Frontend : checking if the URL is related to the admin panel
  if (url === `${process.env.NEXT_PUBLIC_MAIN_URL}admin`) {

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_MAIN_URL}admin/dashboard`
    );

  }

  // Backend : check the token is valid or not */api/admin/* routes
  if (url.includes("/api")) {

    // skip these specific routes which is also for public ***********
    if (
      url.includes("/auth") ||
      (url.includes("/admin/inquiries") && method === "POST") ||
      (url.includes("/admin/queries") && method === "POST") ||
      (url.includes("/admin/blogs") && method === "GET") ||
      (url.includes("/admin/services") && method === "GET") ||
      (/\*\/api\/admin\/blogs\/slug\/*/.test(url) && method === "GET") ||
      (/\*\/api\/pages\/slug\/*/.test(url) && method === "GET") ||
      (/\*\/api\/services\/slug\/*/.test(url) && method === "GET") ||
      (/\*\/api\/services\/category\/*/.test(url) && method === "GET") ||
      (/\*\/api\/categories\/slug\/*/.test(url) && method === "GET")
    ) {
      return NextResponse.next();
    }
    // ****************************************************************

    // check the token is valid or not
    let authorised = await verifyTokenJose(req);

    // if token is not valid then redirect to login
    if (!authorised) {
      return NextResponse.json({ message: "Unauthorized!", code: 401 }, { status: 401 });
    }
  }

  // Frontend : checking if the URL is related to the admin panel
  if (url.includes("/admin")) {
    let authorised = await verifyTokenJose(req);

    // If the user is not authorized, redirect to the login page
    if (!authorised) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_MAIN_URL}auth/login`
      );
    }
  }

  // Frontend : checking the user is login or not
  if (url.includes("/login")) {
    // If the user is already logged in, redirect them to the dashboard
    if (token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_MAIN_URL}admin/dashboard`
      );
    }
  }

  // checking the user have opt page access or not
  if (url.includes("/forget-password/otp")) {
    if (forgotPassword != "OTP") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_MAIN_URL}auth/login`
      );
    }
  }

  // checking the user have password page access or not
  if (url.includes("/forget-password/password")) {
    if (forgotPassword != "password") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_MAIN_URL}auth/login`
      );
    }
  }

  return NextResponse.next();
}
