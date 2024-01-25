// import some custom modules
import * as blogModel from "@/backend/models/blogModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Services Page by slug : GET end points
// *******************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const slug = context?.params.slug;

    response = await blogModel.get_blog_by_slug(slug);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
