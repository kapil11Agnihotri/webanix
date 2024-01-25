// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as blogTypeModel from "@/backend/models/blogTypeModel";
import { blogTypeUpdateValidation } from "@/backend/validation/blogTypeValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Blog Type by id : GET end points
// *******************************************************************
export async function GET(req, context) {
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params.id;

    response = await blogTypeModel.get_blog_type_by_id(id);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Blog Type by id : PUT end points
// *******************************************************************
export async function PUT(req, context) {
  // Pre-define the resposne constent
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params.id;
    const formData = await req.formData();
    const { files, body } = await filterFormData(formData);

    body.id = id;

    // check the validation -> stop execution if fails**************
    const valid = await blogTypeUpdateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await blogTypeModel.update(id, body, files);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// Blog Type by id: DELETE End point
// ***************************************************************
export async function DELETE(req, context) {
  // Pre-define the resposne constent
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    const id = context?.params.id;

    response = await blogTypeModel.delete_blog_type(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
