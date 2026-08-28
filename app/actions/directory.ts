"use server";

import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function submitClaimAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const storeIdentifier = (formData.get("storeId") || formData.get("storeSlug")) as string;
    const claimantName = (formData.get("claimantName") as string)?.trim();
    const claimantEmail = (formData.get("claimantEmail") as string)?.trim();
    const claimantWhatsapp = (formData.get("claimantWhatsapp") as string)?.trim();
    const claimantRole = (formData.get("claimantRole") as string)?.trim() || "Owner";
    const message = (formData.get("message") as string)?.trim() || "";

    if (!storeIdentifier || !claimantName || !claimantEmail || !claimantWhatsapp) {
      return {
        success: false,
        error: "Please fill in all required fields (Store, Name, Email, WhatsApp).",
      };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(claimantEmail)) {
      return {
        success: false,
        error: "Please provide a valid email address.",
      };
    }

    // Validate Pakistani WhatsApp (+92)
    const cleanWhatsapp = claimantWhatsapp.replace(/[\s\-]/g, "");
    if (!cleanWhatsapp.startsWith("+92") || cleanWhatsapp.length < 12) {
      return {
        success: false,
        error: "WhatsApp number must start with +92 (e.g., +92 300 1234567).",
      };
    }

    let storeId: number | null = null;
    const parsedId = parseInt(storeIdentifier, 10);

    if (db) {
      if (!isNaN(parsedId)) {
        storeId = parsedId;
      } else {
        const [store] = await db
          .select({ id: schema.directoryStores.id, isClaimed: schema.directoryStores.isClaimed })
          .from(schema.directoryStores)
          .where(eq(schema.directoryStores.slug, storeIdentifier))
          .limit(1);

        if (!store) {
          return { success: false, error: "Selected store could not be found." };
        }
        if (store.isClaimed) {
          return { success: false, error: "This store has already been verified and claimed." };
        }
        storeId = store.id;
      }

      if (storeId) {
        await db.insert(schema.directoryClaims).values({
          storeId,
          claimantName,
          claimantEmail,
          claimantWhatsapp,
          claimantRole,
          message,
          status: "pending",
        });
      }
    } else {
      console.log("Database not configured. Logged mock claim:", {
        storeIdentifier,
        claimantName,
        claimantEmail,
        claimantWhatsapp,
      });
    }

    revalidatePath("/stores");
    return {
      success: true,
      message: "Thanks! We'll verify your claim within 24 hours and send you a WhatsApp message.",
    };
  } catch (error: any) {
    console.error("Error submitting claim:", error);
    return {
      success: false,
      error: error.message || "Failed to submit claim. Please try again later.",
    };
  }
}

export async function submitStoreAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const storeName = (formData.get("storeName") as string)?.trim();
    const websiteUrl = (formData.get("websiteUrl") as string)?.trim();
    const category = (formData.get("category") as string)?.trim();
    const city = (formData.get("city") as string)?.trim();
    const platform = (formData.get("platform") as string)?.trim() || "Shopify";
    const claimantName = (formData.get("claimantName") as string)?.trim();
    const claimantEmail = (formData.get("claimantEmail") as string)?.trim();
    const claimantWhatsapp = (formData.get("claimantWhatsapp") as string)?.trim();
    const instagramUrl = (formData.get("instagramUrl") as string)?.trim() || "";
    const description = (formData.get("description") as string)?.trim() || "";
    const notes = (formData.get("notes") as string)?.trim() || "";

    if (!storeName || !websiteUrl || !category || !city || !claimantName || !claimantEmail || !claimantWhatsapp) {
      return {
        success: false,
        error: "Please fill in all mandatory fields.",
      };
    }

    // Validate website URL
    try {
      new URL(websiteUrl);
    } catch {
      return {
        success: false,
        error: "Please enter a valid website URL (including https://).",
      };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(claimantEmail)) {
      return {
        success: false,
        error: "Please provide a valid email address.",
      };
    }

    // Validate Pakistani WhatsApp (+92)
    const cleanWhatsapp = claimantWhatsapp.replace(/[\s\-]/g, "");
    if (!cleanWhatsapp.startsWith("+92") || cleanWhatsapp.length < 12) {
      return {
        success: false,
        error: "WhatsApp number must start with +92 (e.g., +92 300 1234567).",
      };
    }

    const slug = slugify(storeName);

    if (db) {
      // Check if store slug already exists
      const [existing] = await db
        .select({ id: schema.directoryStores.id })
        .from(schema.directoryStores)
        .where(eq(schema.directoryStores.slug, slug))
        .limit(1);

      if (existing) {
        return {
          success: false,
          error: "A store with this name or slug is already listed in the directory.",
        };
      }

      await db.insert(schema.directoryStores).values({
        name: storeName,
        slug,
        website: websiteUrl,
        category,
        city,
        platform,
        description: description || `${storeName} is an emerging Pakistani e-commerce store offering quality ${category.toLowerCase()} products based out of ${city}.`,
        isClaimed: false,
        tier: "pending_review",
        apiScore: 60,
        platformDetected: platform,
        ownerName: claimantName,
        ownerEmail: claimantEmail,
        ownerWhatsapp: claimantWhatsapp,
        instagramUrl: instagramUrl || null,
        notes: notes ? `Submission Notes: ${notes}` : null,
      });
    } else {
      console.log("Database not configured. Logged mock store submission:", {
        storeName,
        websiteUrl,
        category,
        city,
      });
    }

    revalidatePath("/stores");
    return {
      success: true,
      message: "Thanks! We'll review your store within 48 hours and list it once verified.",
    };
  } catch (error: any) {
    console.error("Error submitting store:", error);
    return {
      success: false,
      error: error.message || "Failed to submit store. Please try again later.",
    };
  }
}

export async function updateStoreAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  try {
    const slug = (formData.get("slug") as string)?.trim();
    const token = (formData.get("token") as string)?.trim();
    const website = (formData.get("website") as string)?.trim();
    const logoUrl = (formData.get("logoUrl") as string)?.trim() || null;
    const productCountStr = (formData.get("productCount") as string)?.trim();
    const instagramUrl = (formData.get("instagramUrl") as string)?.trim() || null;
    const facebookUrl = (formData.get("facebookUrl") as string)?.trim() || null;
    const tiktokUrl = (formData.get("tiktokUrl") as string)?.trim() || null;
    const youtubeUrl = (formData.get("youtubeUrl") as string)?.trim() || null;
    const linkedinUrl = (formData.get("linkedinUrl") as string)?.trim() || null;
    const twitterUrl = (formData.get("twitterUrl") as string)?.trim() || null;
    const themeColor = (formData.get("themeColor") as string)?.trim() || "#3D7BFF";
    const bannerPattern = (formData.get("bannerPattern") as string)?.trim() || "gradient";
    const coverUrl = (formData.get("coverUrl") as string)?.trim() || null;
    const coverMobileUrl = (formData.get("coverMobileUrl") as string)?.trim() || null;
    const tagline = (formData.get("tagline") as string)?.trim() || null;
    const highlightsRaw = (formData.get("highlights") as string)?.trim() || "";
    const highlights = highlightsRaw
      ? highlightsRaw
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const description = (formData.get("description") as string)?.trim();

    if (!slug || !token || !website || !description) {
      return {
        success: false,
        error: "Please fill in all required fields (Website, Description, and Owner Token).",
      };
    }

    // Strict URL validation
    const validateSafeUrl = (urlStr: string | null, fieldName: string) => {
      if (!urlStr) return true;
      try {
        const parsed = new URL(urlStr);
        if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
          return false;
        }
        // Block private/internal network addresses (SSRF prevention)
        const host = parsed.hostname.toLowerCase();
        if (
          host === "localhost" ||
          host === "127.0.0.1" ||
          host.startsWith("192.168.") ||
          host.startsWith("10.") ||
          host.endsWith(".local") ||
          host.endsWith(".internal")
        ) {
          return false;
        }
        return true;
      } catch {
        return false;
      }
    };

    if (!validateSafeUrl(website, "Website")) {
      return {
        success: false,
        error: "Please enter a valid, public website URL (e.g. https://yourstore.pk).",
      };
    }
    if (logoUrl && !validateSafeUrl(logoUrl, "Logo")) {
      return {
        success: false,
        error: "Please enter a valid, secure public HTTPS image URL for your Logo.",
      };
    }
    if (coverUrl && !validateSafeUrl(coverUrl, "Desktop Cover Banner")) {
      return {
        success: false,
        error: "Please enter a valid, secure public HTTPS image URL for your Desktop Cover Banner.",
      };
    }
    if (coverMobileUrl && !validateSafeUrl(coverMobileUrl, "Mobile Cover Banner")) {
      return {
        success: false,
        error: "Please enter a valid, secure public HTTPS image URL for your Mobile Cover Banner.",
      };
    }

    const productCount = productCountStr ? parseInt(productCountStr, 10) : null;

    if (db) {
      const [store] = await db
        .select()
        .from(schema.directoryStores)
        .where(eq(schema.directoryStores.slug, slug))
        .limit(1);

      if (!store) {
        return {
          success: false,
          error: "Store not found.",
        };
      }

      // Check token match
      if (!store.editToken || store.editToken.trim() !== token?.trim()) {
        return {
          success: false,
          error: "Unauthorized: Invalid or missing owner verification token.",
        };
      }

      await db
        .update(schema.directoryStores)
        .set({
          website,
          logoUrl,
          productCount: !isNaN(Number(productCount)) ? productCount : store.productCount,
          instagramUrl,
          facebookUrl,
          tiktokUrl,
          youtubeUrl,
          linkedinUrl,
          twitterUrl,
          themeColor,
          bannerPattern,
          coverUrl,
          coverMobileUrl,
          tagline,
          highlights,
          description,
          updatedAt: new Date(),
        })
        .where(eq(schema.directoryStores.slug, slug));
    }

    revalidatePath(`/stores/${slug}`);
    revalidatePath("/stores");

    return {
      success: true,
      message: "Store profile updated successfully!",
    };
  } catch (error: any) {
    console.error("Error updating store:", error);
    return {
      success: false,
      error: error.message || "Failed to update store profile.",
    };
  }
}
