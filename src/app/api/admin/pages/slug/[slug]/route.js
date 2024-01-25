// import some custom modules
import * as pageModel from "@/backend/models/pageModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Page by slug : GET end points
// *******************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {
    const slug = context?.params.slug;
    response = await pageModel.get_pages_by_slug(slug);
  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}
