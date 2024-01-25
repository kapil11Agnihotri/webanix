// import some custom modules
import * as userHasPermissionModel from "@/backend/models/userHasPermissionModel";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// User Has Permissions : GET End point
// ***************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: [],
  };

  try {
    const id = context.params.id;

    response = await userHasPermissionModel.get_permissions_by_user(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
