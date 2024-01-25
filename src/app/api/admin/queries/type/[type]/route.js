// import some custom modules
import * as queryModel from "@/backend/models/queryModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Query by type : GET end points
// *******************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const type = context?.params.type;

    response = await queryModel.get_by_type(type);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
