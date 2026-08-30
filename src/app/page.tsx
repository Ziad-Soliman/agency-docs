import { getPage, getBlocksWithChildren, getWorkspaceTree, ROOT_PAGE_ID } from "@/lib/notion";
import { DocViewer } from "@/components/layout/DocViewer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [page, blocks, tree] = await Promise.all([
    getPage(ROOT_PAGE_ID),
    getBlocksWithChildren(ROOT_PAGE_ID, 2),
    getWorkspaceTree(ROOT_PAGE_ID),
  ]);

  return <DocViewer initialPage={page} initialBlocks={blocks} tree={tree} />;
}
