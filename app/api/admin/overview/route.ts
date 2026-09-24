import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/schema/directory";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

function checkAuth(req: NextRequest, bodyPassword?: string): boolean {
  const serverPassword =
    process.env.ADMIN_PASSWORD ||
    process.env.ANALYTICS_PASSWORD ||
    "owais-vault-2026";

  const cookieToken = req.cookies.get("admin_auth_session")?.value;
  const authHeader = req.headers.get("authorization")?.replace("Bearer ", "");
  const urlPassword = req.nextUrl.searchParams.get("token") || "";

  const password = bodyPassword || authHeader || cookieToken || urlPassword;
  return Boolean(password && password === serverPassword);
}

export async function GET(req: NextRequest) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!db) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    // 1. Parallel counts & data gathering
    const [
      allStores,
      pendingStores,
      pendingClaims,
      allComments,
      recentEvents,
      topPosts,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(schema.directoryStores),
      db.select().from(schema.directoryStores).where(eq(schema.directoryStores.tier, "pending_review")).orderBy(desc(schema.directoryStores.createdAt)).limit(5),
      db.select({
        id: schema.directoryClaims.id,
        claimantName: schema.directoryClaims.claimantName,
        claimantEmail: schema.directoryClaims.claimantEmail,
        createdAt: schema.directoryClaims.createdAt,
        storeName: schema.directoryStores.name,
      })
      .from(schema.directoryClaims)
      .leftJoin(schema.directoryStores, eq(schema.directoryClaims.storeId, schema.directoryStores.id))
      .where(eq(schema.directoryClaims.status, "pending"))
      .orderBy(desc(schema.directoryClaims.createdAt))
      .limit(5),
      db.select().from(schema.blogComments).orderBy(desc(schema.blogComments.createdAt)).limit(5),
      db.select().from(schema.siteAnalyticsEvents).orderBy(desc(schema.siteAnalyticsEvents.timestamp)).limit(8),
      db.select().from(schema.blogPostMetrics).orderBy(desc(schema.blogPostMetrics.views)).limit(5),
    ]);

    const totalStores = Number(allStores[0]?.count || 0);

    return NextResponse.json({
      metrics: {
        totalStores,
        pendingStoresCount: pendingStores.length,
        pendingClaimsCount: pendingClaims.length,
        recentCommentsCount: allComments.length,
      },
      recentStores: pendingStores,
      recentClaims: pendingClaims,
      recentComments: allComments,
      recentEvents,
      topPosts,
    });
  } catch (error: any) {
    console.error("Overview API error:", error);
    return NextResponse.json({ error: error.message || "Failed to load overview data" }, { status: 500 });
  }
}
