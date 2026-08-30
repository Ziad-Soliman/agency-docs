import { NextRequest, NextResponse } from "next/server";
import { getPage, getBlocksWithChildren } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing page ID" }, { status: 400 });
    }

    const [page, blocks] = await Promise.all([
      getPage(id),
      getBlocksWithChildren(id, 2),
    ]);

    return NextResponse.json({
      page,
      blocks,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API error fetching page:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch Notion page" },
      { status: 500 }
    );
  }
}
