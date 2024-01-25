// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as queryModel from "@/backend/models/queryModel";
import { queryCreateValidation } from "@/backend/validation/queryValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Query : GET end points
// *******************************************************************
export async function GET(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {


    response = await queryModel.get_queries();
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Query : POST end points
// *******************************************************************
export async function POST(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const formData = await req.formData();
    const { files, body } = await filterFormData(formData);

    // check the validation -> stop execution if fails**************
    const valid = await queryCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await queryModel.store(body, files);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
