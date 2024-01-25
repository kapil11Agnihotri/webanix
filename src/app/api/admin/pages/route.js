// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as pageModel from "@/backend/models/pageModel.js";
import { pageCreateValidation } from "@/backend/validation/pageValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Page : GET end points
// *******************************************************************
export async function GET(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {

    response = await pageModel.get_pages();
  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Page : POST end points
// *******************************************************************
export async function POST(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong",
    code: 500,
    data: null,
  };

  try {
    const formData = await req.formData();
    const { files, body } = await filterFormData(formData);

    // check the validation -> stop execution if fails**************
    const valid = await pageCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    const cookies =
      req?.cookies?.get("userData")?.value || req.headers.cookies?.accessToken;

    const userData = JSON.parse(cookies);

    response = await pageModel.store_page(body, files, userData?.userId);

  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}
