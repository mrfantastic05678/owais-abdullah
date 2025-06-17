// // lib/prefetch-utils.ts
// import { PrefetchImage } from "@/components/ui/link";

// // For TypeScript - if you're not using Sanity, you can remove this import
// let sanityClient: any;

// // Try to import Sanity client only if it's installed
// try {
//   const { createClient } = require('next-sanity');
//   sanityClient = createClient({
//     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
//     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
//     apiVersion: "2023-05-21",
//     useCdn: process.env.NODE_ENV === "production",
//   });
// } catch (error) {
//   console.log("Sanity client not available, skipping initialization");
// }

// // Types for image sources
// export type ImageSource = {
//   type: "sanity" | "public" | "external";
//   query?: string;
//   imagePaths?: string[];
//   externalUrls?: string[];
// };

// // Page to image source mapping
// // This is where you configure which images to prefetch for each route
// export const pageImageSources: Record<string, ImageSource> = {
//   // Example for a product page with Sanity images
//   "/products": {
//     type: "sanity",
//     query: `*[_type == "product"][0...10]{
//       "images": featuredImage.asset->url
//     }`
//   },
//   // Example for a static page with public folder images
//   "/about": {
//     type: "public",
//     imagePaths: [
//       "/images/team.jpg",
//       "/images/office.jpg"
//     ]
//   },
//   // Example for a page with external images
//   "/partners": {
//     type: "external",
//     externalUrls: [
//       "https://example.com/logo1.png",
//       "https://example.com/logo2.png"
//     ]
//   },
//   // Add more pages as needed
// };

// // Helper to create a PrefetchImage object from a URL
// function createPrefetchImageFromUrl(url: string): PrefetchImage {
//   return {
//     src: url,
//     srcset: url,
//     sizes: "100vw", // Default, adjust as needed
//     alt: "", // Default, you won't have alt text in prefetch
//     loading: "eager"
//   };
// }

// // Helper to get Sanity images (only if Sanity is available)
// async function getSanityImages(query: string): Promise<PrefetchImage[]> {
//   if (!sanityClient) {
//     console.warn("Sanity client not initialized, cannot fetch images");
//     return [];
//   }
  
//   try {
//     const data = await sanityClient.fetch(query);
//     return extractImagesFromSanityData(data);
//   } catch (error) {
//     console.error("Error fetching Sanity images:", error);
//     return [];
//   }
// }

// // Helper to extract images from Sanity data
// function extractImagesFromSanityData(data: any): PrefetchImage[] {
//   const images: PrefetchImage[] = [];
  
//   if (!data) {
//     return images;
//   }
  
//   try {
//     if (Array.isArray(data)) {
//       // Handle array of items
//       data.forEach(item => {
//         if (!item) return;
        
//         // Handle direct image URLs
//         if (item.images) {
//           if (typeof item.images === 'string') {
//             images.push(createPrefetchImageFromUrl(item.images));
//           } else if (Array.isArray(item.images)) {
//             item.images.forEach((url: string) => {
//               if (url) images.push(createPrefetchImageFromUrl(url));
//             });
//           }
//         }
//       });
//     } else if (typeof data === 'object') {
//       // Handle single object
//       if (data.images) {
//         if (typeof data.images === 'string') {
//           images.push(createPrefetchImageFromUrl(data.images));
//         } else if (Array.isArray(data.images)) {
//           data.images.forEach((url: string) => {
//             if (url) images.push(createPrefetchImageFromUrl(url));
//           });
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error extracting images from Sanity data:", error);
//   }
  
//   return images;
// }

// // Function to get PrefetchImages for a specific page path
// export async function getPrefetchImagesFromPage(path: string): Promise<PrefetchImage[]> {
//   // Check if we have a configuration for this path
//   const source = findMatchingSource(path);
  
//   if (!source) {
//     return [];
//   }
  
//   // Get images based on the source type
//   switch (source.type) {
//     case "sanity":
//       if (source.query) {
//         return await getSanityImages(source.query);
//       }
//       return [];
      
//     case "public":
//       if (source.imagePaths && source.imagePaths.length > 0) {
//         return source.imagePaths.map(path => createPrefetchImageFromUrl(path));
//       }
//       return [];
      
//     case "external":
//       if (source.externalUrls && source.externalUrls.length > 0) {
//         return source.externalUrls.map(url => createPrefetchImageFromUrl(url));
//       }
//       return [];
      
//     default:
//       return [];
//   }
// }

// // Helper to find the matching image source configuration for a path
// function findMatchingSource(path: string): ImageSource | null {
//   // Try exact match first
//   if (pageImageSources[path]) {
//     return pageImageSources[path];
//   }
  
//   // Try to find a parent path match
//   const pathSegments = path.split('/').filter(Boolean);
  
//   while (pathSegments.length > 0) {
//     const testPath = '/' + pathSegments.join('/');
//     if (pageImageSources[testPath]) {
//       return pageImageSources[testPath];
//     }
//     pathSegments.pop();
//   }
  
//   // No match found
//   return null;
// }