import { NextResponse } from "next/server";
import { getWorkspaceTree } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tree = await getWorkspaceTree();
    return NextResponse.json({
      tree,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API error fetching workspace tree:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch workspace tree" },
      { status: 500 }
    );
  }
}
