import { NextRequest, NextResponse } from "next/server";
import { getWorkspaceTree, getBlocksWithChildren, getPage } from "@/lib/notion";
import { getPlainTextFromRichText, cleanPageId } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q")?.toLowerCase() || "";
    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const tree = await getWorkspaceTree();
    const results: Array<{
      pageId: string;
      pageTitle: string;
      snippet: string;
      type: "page" | "block";
      blockType?: string;
    }> = [];

    // Collect all pages
    const allPages: Array<{ id: string; title: string }> = [];
    function collect(nodes: any[]) {
      for (const n of nodes) {
        allPages.push({ id: n.id, title: n.title });
        if (n.children) collect(n.children);
      }
    }
    collect(tree);

    // Search page titles
    for (const p of allPages) {
      if (p.title.toLowerCase().includes(query)) {
        results.push({
          pageId: p.id,
          pageTitle: p.title,
          snippet: `Page: ${p.title}`,
          type: "page",
        });
      }
    }

    // Search inside blocks for matching pages (limit to first 10 pages for speed)
    const samplePages = allPages.slice(0, 8);
    await Promise.all(
      samplePages.map(async (p) => {
        try {
          const blocks = await getBlocksWithChildren(p.id, 1);
          for (const b of blocks) {
            const richText =
              b[b.type]?.rich_text ||
              b.heading_1?.rich_text ||
              b.heading_2?.rich_text ||
              b.heading_3?.rich_text ||
              b.paragraph?.rich_text ||
              b.callout?.rich_text ||
              b.bulleted_list_item?.rich_text ||
              b.numbered_list_item?.rich_text;

            const text = getPlainTextFromRichText(richText);
            if (text && text.toLowerCase().includes(query)) {
              results.push({
                pageId: p.id,
                pageTitle: p.title,
                snippet: text.length > 120 ? text.slice(0, 120) + "..." : text,
                type: "block",
                blockType: b.type,
              });
            }
          }
        } catch (e) {
          // ignore page search error
        }
      })
    );

    return NextResponse.json({
      results: results.slice(0, 20),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
