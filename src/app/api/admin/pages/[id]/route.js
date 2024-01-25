// import some custom modules
import * as pageModel from "@/backend/models/pageModel.js";
import {
  pageUpdateValidation,
  pageDeleteValidation,
} from "@/backend/validation/pageValidation";
import filterFormData from "@/backend/helpers/filterFormData";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Page by id : GET end points
// *******************************************************************
export async function GET(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params.id;


    response = await pageModel.get_pages_by_id(id);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Page by id : PUT end points
// *******************************************************************
export async function PUT(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params.id;
    const formData = await req.formData();
    const { files, body } = await filterFormData(formData);

    // insert id into the body for validation body requirment
    body.id = id;

    // check the validation -> stop execution if fails**************
    const valid = await pageUpdateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    const cookies =
      req?.cookies?.get("userData")?.value || req.headers.cookies?.accessToken;

    const userData = JSON.parse(cookies);

    response = await pageModel.update_page(id, body, files, userData?.userId);

  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Page by id : DELETE end points
// *******************************************************************
export async function DELETE(req, context) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params?.id;
    const body = { id: id };

    // check the validation -> stop execution if fails**************
    const valid = await pageDeleteValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await pageModel.delete_page(id);
  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}
