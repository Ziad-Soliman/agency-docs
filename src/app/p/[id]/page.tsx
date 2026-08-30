import { getPage, getBlocksWithChildren, getWorkspaceTree, ROOT_PAGE_ID } from "@/lib/notion";
import { DocViewer } from "@/components/layout/DocViewer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [page, blocks, tree] = await Promise.all([
      getPage(id),
      getBlocksWithChildren(id, 2),
      getWorkspaceTree(ROOT_PAGE_ID),
    ]);

    if (!page || !page.id) {
      notFound();
    }

    return <DocViewer initialPage={page} initialBlocks={blocks} tree={tree} />;
  } catch (error) {
    console.error("Error loading page:", error);
    notFound();
  }
}
