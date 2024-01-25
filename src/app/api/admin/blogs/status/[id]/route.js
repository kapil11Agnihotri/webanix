// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as blogModel from "@/backend/models/blogModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Blog status by id : GET end points
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

    response = await blogModel.get_published_blog_list(id);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}

// *******************************************************************
// Blog status by id : PUT end points
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

    response = await blogModel.change_blog_status(id, body);
  } catch (err) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
