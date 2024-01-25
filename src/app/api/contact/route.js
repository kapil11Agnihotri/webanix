// import some custom modules
import * as contactModel from "@/backend/models/contactModel.js";
import { contactCreateValidation } from "@/backend/validation/contactValidation.js";

// import the next packages
import { NextResponse } from "next/server";

// ***************************************************************
// INQUIRIES : GET End point
// ***************************************************************
export async function GET(req) {
  // Pre-define the resposne constent
  let message = "Something went wrong!",
    code = 500,
    data = null;

  try {
    const result = await contactModel.get_contact(req);

    message = result.message;
    code = result.code;
    data = result.data;
  } catch (err) {
    message = err;
  }

  return NextResponse.json({ message, code, data }, { status: code });
}

// ***************************************************************
// INQUIRIES : POST End point
// ***************************************************************
export async function POST(req) {
  // Pre-define the resposne constent
  let message = "Something went wrong!",
    code = 500,
    data = null;

  try {
    // parse the upcoming req into json;
    const body = await req?.json();

    // check the validation -> stop execution if fails**************
    const valid = await contactCreateValidation.safeParseAsync(body);

    if (!valid.success) {
      (message = valid.error), (code = 422);
      return NextResponse.json({ message, code, data }, { status: code });
    }
    // **************************************************************

    // Model code start here ****************************************
    const result = await contactModel.store(body);

    message = result.message;
    code = result.code;
    data = result.data;
    // **************************************************************
  } catch (err) {
    message = err;
  }

  return NextResponse.json({ message, code, data }, { status: code });
}
