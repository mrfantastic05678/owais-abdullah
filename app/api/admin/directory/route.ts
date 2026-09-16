import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest, bodyPassword?: string): boolean {
  const serverPassword =
    process.env.ANALYTICS_PASSWORD ||
    process.env.ADMIN_PASSWORD ||
    "owais-vault-2026";

  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
  const password = bodyPassword || authHeader;
  return Boolean(password && password === serverPassword);
}

// GET: Return pending submissions, pending claims, and all directory stores
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
    const urlPassword = req.nextUrl.searchParams.get("token") || "";

    if (!checkAuth(req, urlPassword || authHeader)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({
        pendingStores: [],
        pendingClaims: [],
        allStores: [],
        stats: { totalStores: 0, pendingStores: 0, pendingClaims: 0, claimedStores: 0 },
        warning: "Database not connected",
      });
    }

    // 1. Fetch pending store submissions (tier = 'pending_review')
    const pendingStores = await db
      .select()
      .from(schema.directoryStores)
      .where(eq(schema.directoryStores.tier, "pending_review"))
      .orderBy(desc(schema.directoryStores.createdAt));

    // 2. Fetch pending claims joined with store info
    const pendingClaims = await db
      .select({
        id: schema.directoryClaims.id,
        storeId: schema.directoryClaims.storeId,
        claimantName: schema.directoryClaims.claimantName,
        claimantEmail: schema.directoryClaims.claimantEmail,
        claimantWhatsapp: schema.directoryClaims.claimantWhatsapp,
        claimantRole: schema.directoryClaims.claimantRole,
        message: schema.directoryClaims.message,
        status: schema.directoryClaims.status,
        createdAt: schema.directoryClaims.createdAt,
        storeName: schema.directoryStores.name,
        storeSlug: schema.directoryStores.slug,
        storeWebsite: schema.directoryStores.website,
        storeCategory: schema.directoryStores.category,
        storeCity: schema.directoryStores.city,
      })
      .from(schema.directoryClaims)
      .leftJoin(schema.directoryStores, eq(schema.directoryClaims.storeId, schema.directoryStores.id))
      .where(eq(schema.directoryClaims.status, "pending"))
      .orderBy(desc(schema.directoryClaims.createdAt));

    // 3. Fetch all active/listed stores
    const allStores = await db
      .select()
      .from(schema.directoryStores)
      .orderBy(desc(schema.directoryStores.createdAt));

    const totalStores = allStores.length;
    const pendingStoresCount = pendingStores.length;
    const pendingClaimsCount = pendingClaims.length;
    const claimedStoresCount = allStores.filter((s) => s.isClaimed).length;

    return NextResponse.json({
      pendingStores,
      pendingClaims,
      allStores,
      stats: {
        totalStores,
        pendingStores: pendingStoresCount,
        pendingClaims: pendingClaimsCount,
        claimedStores: claimedStoresCount,
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin directory data:", error);
    return NextResponse.json({ error: error.message || "Failed to load directory data" }, { status: 500 });
  }
}

// POST: Manage Actions (approve-store, reject-store, approve-claim, reject-claim, toggle-claim, delete-store)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, action } = body;

    if (!checkAuth(req, password)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    switch (action) {
      case "approve-store": {
        const { storeId, tier = "silver", apiScore = 75 } = body;
        if (!storeId) return NextResponse.json({ error: "Missing storeId" }, { status: 400 });

        const [store] = await db
          .select()
          .from(schema.directoryStores)
          .where(eq(schema.directoryStores.id, Number(storeId)))
          .limit(1);

        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        // Generate owner edit token if not set
        const editToken = store.editToken || `${store.slug}-${Math.random().toString(36).substring(2, 10)}`;

        await db
          .update(schema.directoryStores)
          .set({
            tier,
            apiScore: Number(apiScore) || 75,
            editToken,
            updatedAt: new Date(),
          })
          .where(eq(schema.directoryStores.id, Number(storeId)));

        revalidatePath("/stores");
        revalidatePath(`/stores/${store.slug}`);
        return NextResponse.json({ success: true, message: `Store "${store.name}" approved as ${tier} tier!`, editToken });
      }

      case "reject-store": {
        const { storeId } = body;
        if (!storeId) return NextResponse.json({ error: "Missing storeId" }, { status: 400 });

        await db
          .delete(schema.directoryStores)
          .where(eq(schema.directoryStores.id, Number(storeId)));

        revalidatePath("/stores");
        return NextResponse.json({ success: true, message: "Store submission rejected and removed." });
      }

      case "approve-claim": {
        const { claimId, storeId } = body;
        if (!claimId || !storeId) return NextResponse.json({ error: "Missing claimId or storeId" }, { status: 400 });

        const [claim] = await db
          .select()
          .from(schema.directoryClaims)
          .where(eq(schema.directoryClaims.id, Number(claimId)))
          .limit(1);

        if (!claim) return NextResponse.json({ error: "Claim not found" }, { status: 404 });

        const [store] = await db
          .select()
          .from(schema.directoryStores)
          .where(eq(schema.directoryStores.id, Number(storeId)))
          .limit(1);

        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        // Generate owner edit token
        const editToken = `${store.slug}-${Math.random().toString(36).substring(2, 12)}`;

        // 1. Mark claim approved
        await db
          .update(schema.directoryClaims)
          .set({
            status: "approved",
            reviewedAt: new Date(),
          })
          .where(eq(schema.directoryClaims.id, Number(claimId)));

        // 2. Mark store claimed with claimant contact and edit token
        await db
          .update(schema.directoryStores)
          .set({
            isClaimed: true,
            claimedAt: new Date(),
            ownerName: claim.claimantName,
            ownerEmail: claim.claimantEmail,
            ownerWhatsapp: claim.claimantWhatsapp,
            editToken,
            updatedAt: new Date(),
          })
          .where(eq(schema.directoryStores.id, Number(storeId)));

        revalidatePath("/stores");
        revalidatePath(`/stores/${store.slug}`);
        revalidatePath("/stores/claim");

        return NextResponse.json({
          success: true,
          message: `Claim for "${store.name}" approved!`,
          editUrl: `/stores/${store.slug}/edit?token=${editToken}`,
          editToken,
        });
      }

      case "reject-claim": {
        const { claimId } = body;
        if (!claimId) return NextResponse.json({ error: "Missing claimId" }, { status: 400 });

        await db
          .update(schema.directoryClaims)
          .set({
            status: "rejected",
            reviewedAt: new Date(),
          })
          .where(eq(schema.directoryClaims.id, Number(claimId)));

        return NextResponse.json({ success: true, message: "Claim rejected." });
      }

      case "toggle-claim": {
        const { storeId, isClaimed } = body;
        if (!storeId) return NextResponse.json({ error: "Missing storeId" }, { status: 400 });

        const [store] = await db
          .select()
          .from(schema.directoryStores)
          .where(eq(schema.directoryStores.id, Number(storeId)))
          .limit(1);

        if (!store) return NextResponse.json({ error: "Store not found" }, { status: 404 });

        const nextClaimed = typeof isClaimed === "boolean" ? isClaimed : !store.isClaimed;
        const editToken = nextClaimed && !store.editToken
          ? `${store.slug}-${Math.random().toString(36).substring(2, 10)}`
          : store.editToken;

        await db
          .update(schema.directoryStores)
          .set({
            isClaimed: nextClaimed,
            claimedAt: nextClaimed ? new Date() : null,
            editToken,
            updatedAt: new Date(),
          })
          .where(eq(schema.directoryStores.id, Number(storeId)));

        revalidatePath("/stores");
        revalidatePath(`/stores/${store.slug}`);
        return NextResponse.json({
          success: true,
          message: `Store "${store.name}" marked as ${nextClaimed ? "Verified & Claimed" : "Unclaimed"}.`,
          isClaimed: nextClaimed,
          editToken,
        });
      }

      case "delete-store": {
        const { storeId } = body;
        if (!storeId) return NextResponse.json({ error: "Missing storeId" }, { status: 400 });

        // First remove any claims referencing this store
        await db
          .delete(schema.directoryClaims)
          .where(eq(schema.directoryClaims.storeId, Number(storeId)));

        // Then delete the store
        await db
          .delete(schema.directoryStores)
          .where(eq(schema.directoryStores.id, Number(storeId)));

        revalidatePath("/stores");
        return NextResponse.json({ success: true, message: "Store deleted permanently." });
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Admin action failed:", error);
    return NextResponse.json({ error: error.message || "Failed to execute admin action" }, { status: 500 });
  }
}
