// import some custom modules
import * as pageModel from "@/backend/models/pageModel.js";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Active page : GET end points
// *******************************************************************
export async function GET(req, res) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {


    response = await pageModel.get_active_pages_list();
  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}
