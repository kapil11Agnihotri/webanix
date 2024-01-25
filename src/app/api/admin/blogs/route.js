// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as blogModel from "@/backend/models/blogModel";
import { blogCreateValidation } from "@/backend/validation/blogValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Blogs : GET end points
// *******************************************************************
export async function GET(req) {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {


    response = await blogModel.get_blogs();
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Blogs : POST end points
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
    const valid = await blogCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await blogModel.store(body, files);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
