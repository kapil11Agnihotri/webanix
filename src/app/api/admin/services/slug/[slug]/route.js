// import some custom modules
import * as serviceModel from "@/backend/models/serviceModel";

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

    response = await serviceModel.get_service_by_slug(slug);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
