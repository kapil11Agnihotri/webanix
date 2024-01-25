// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as blogTypeModel from "@/backend/models/blogTypeModel";
import { blogTypeCreateValidation } from "@/backend/validation/blogTypeValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Blog Types Page : GET end points
// *******************************************************************
export async function GET() {
  // Pre-define the resposne constent
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    response = await blogTypeModel.get_blog_types();
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Blog Types Page : POST end points
// *******************************************************************
export async function POST(req) {
  // Pre-define the resposne constent
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const formData = await req.formData();
    const { files, body } = await filterFormData(formData);

    // check the validation -> stop execution if fails**************
    const valid = await blogTypeCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await blogTypeModel.store(body, files);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
