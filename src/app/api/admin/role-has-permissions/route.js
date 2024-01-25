// import some custom modules
import * as roleHasPermissionModel from "@/backend/models/roleHasPermissionModel";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// Permissions : POST End point
// ***************************************************************
export async function POST(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const body = await req?.json();

    response = await roleHasPermissionModel.store_role_permission(body);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
