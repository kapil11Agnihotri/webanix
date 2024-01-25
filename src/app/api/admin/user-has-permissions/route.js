// import some custom modules
import * as userHasPermissionModel from "@/backend/models/userHasPermissionModel";

// import the next packages
import { NextResponse } from "next/server";

// User Has Permissions : POST End point
export async function POST(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: [],
  };

  try {
    const body = await req?.json();
    const permission_ids = body.permission_ids;

    /*first delete all stored user permissions*/
    let res =
      await userHasPermissionModel.delete_user_permission(body.user_id);

    if (res.code == 400) {
      return NextResponse.json(res, { status: res.code });
    }

    /*loop through permission_ids array and store permission_id against user_id and role_id one by one*/
    permission_ids.map(async (permission_id) => {
      await userHasPermissionModel.store(
        body.user_id,
        body.role_id,
        permission_id
      );
    });

    response = {
      message: "User permission created successfully!",
      data: [],
      code: 201,
    };

  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
