// import some custom modules
import * as queryModel from "@/backend/models/queryModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Query by id : GET end points
// *******************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {

    const id = context?.params.id;

    response = await queryModel.get_by_id(id);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// Query by id: DELETE End point
// ***************************************************************
export async function DELETE(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params.id;

    response = await queryModel.delete_query(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
