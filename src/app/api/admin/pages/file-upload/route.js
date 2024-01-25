// import some custom modules
import filterFormData from "@/backend/helpers/filterFormData";
import * as pageModel from "@/backend/models/pageModel";

// import next packages
import { NextResponse } from "next/server";

// *******************************************************************
// Page image upload : POST end points
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

    response = await pageModel.file_upload(body, files, "pages");
  } catch (error) {
    response.message = error;
  }

  return NextResponse.json(response, { status: response.code });
}
