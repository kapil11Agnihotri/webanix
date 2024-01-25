// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as categoryModel from "@/backend/models/categoryModel";
import { categoryCreateValidation } from "@/backend/validation/categoryValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Category : GET end points
// *******************************************************************
export async function GET() {
  // pre-define the response content
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    response = await categoryModel.get_category_list();
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Category : POST end points
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
    const valid = await categoryCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await categoryModel.store(body, files);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
