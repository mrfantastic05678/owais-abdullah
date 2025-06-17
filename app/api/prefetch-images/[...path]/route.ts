// import { NextRequest, NextResponse } from "next/server";
// import { getPrefetchImagesFromPage } from "@/lib/prefetch-utils";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { path: string[] } }
// ) {
//   try {
//     // Reconstruct the path from the params
//     const path = `/${params.path.join("/")}`;
    
//     // Get the images from the page
//     const images = await getPrefetchImagesFromPage(path);
    
//     // Return the images as JSON
//     return NextResponse.json({ images });
//   } catch (error) {
//     console.error("Error fetching images:", error);
//     return NextResponse.json({ images: [] }, { status: 500 });
//   }
// }

// // Add a default route handler for the root path
// export const dynamic = 'force-dynamic';