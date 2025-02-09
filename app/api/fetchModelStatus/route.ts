// app/api/fetchModelStatus/route.ts
import next from "next";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiUrl =
      "https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=3YHSK";
    const response = await fetch(apiUrl);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    
  }
}
