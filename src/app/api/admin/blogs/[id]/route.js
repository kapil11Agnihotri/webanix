// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as blogModel from "@/backend/models/blogModel";
import { blogUpdateValidation } from "@/backend/validation/blogValidation";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Blogs Page by id : GET end points
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

    response = await blogModel.get_blog_by_id(id);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Blogs Page by id : PUT end points
// *******************************************************************
export async function PUT(req, context) {
  // pre-define the response content
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
    const valid = await blogUpdateValidation.safeParseAsync(body);

    if (!valid.success) {
      (response.message = valid.error), (response.code = 422);
      return NextResponse.json(response, { status: response.code });
    }
    // **************************************************************

    response = await blogModel.update(id, body, files);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// ***************************************************************
// Blogs Page by id: DELETE End point
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

    response = await blogModel.delete_blog(id);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
