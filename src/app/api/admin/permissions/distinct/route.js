// import some custom modules
import * as permissionModel from "@/backend/models/permissionModel.js";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Permissions Distinct names : GET End point
// ***************************************************************
export async function GET(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    response = await permissionModel.get_distinct_name();
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
