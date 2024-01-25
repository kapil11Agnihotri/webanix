// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as serviceModel from "@/backend/models/serviceModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Service image upload : POST end points
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

    response = await serviceModel.file_upload(body, files, "services");
  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}
