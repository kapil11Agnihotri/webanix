import * as categoryModel from "@/backend/models/categoryModel";
import { NextResponse } from "next/server";

// Services Page by slug : GET end points
export async function GET(req, context) {
  let response = {
    message: "Something went wrong!",
    code: 500,
    data: null,
  };

  try {
    response = await categoryModel.get_category_list_by_slug(context?.params.slug);
  } catch (error) {
    response.message = err;
  }

  return NextResponse.json(response, { status: response.code });
}
