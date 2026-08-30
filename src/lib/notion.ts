import { NotionBlock, NotionPage, NavNode, NotionRichText } from "./types";
import { getPlainTextFromRichText, normalizePageId, cleanPageId } from "./utils";

const NOTION_API_KEY = process.env.NOTION_API_KEY || "";
const NOTION_VERSION = "2022-06-28";
export const ROOT_PAGE_ID = process.env.NOTION_ROOT_PAGE_ID || "3ccf10a7857f8097b95feda711758b2f";

async function notionFetch(endpoint: string, options: RequestInit = {}) {
  if (!NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is not defined. Please set it in your environment variables or .env.local file.");
  }

  const url = `https://api.notion.com/v1${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${NOTION_API_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Notion API error (${response.status}) on ${endpoint}:`, errorText);
    throw new Error(`Notion API returned ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function queryDatabase(databaseId: string) {
  const normalizedId = normalizePageId(databaseId);
  const rows: any[] = [];
  let cursor: string | undefined = undefined;

  while (true) {
    const body: any = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;

    const data = await notionFetch(`/databases/${normalizedId}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (data.results && Array.isArray(data.results)) {
      rows.push(...data.results);
    }

    if (data.has_more && data.next_cursor) {
      cursor = data.next_cursor;
    } else {
      break;
    }
  }

  return rows;
}

export async function getPage(pageId: string): Promise<NotionPage> {
  const normalizedId = normalizePageId(pageId);

  // Try fetching as page first
  try {
    const data = await notionFetch(`/pages/${normalizedId}`);

    let title = "Untitled";
    if (data.properties) {
      for (const key of Object.keys(data.properties)) {
        if (data.properties[key]?.type === "title") {
          const titleArray = data.properties[key].title as NotionRichText[];
          title = getPlainTextFromRichText(titleArray) || "Untitled";
          break;
        }
      }
    }

    return {
      ...data,
      id: cleanPageId(data.id),
      title,
      isDatabase: false,
    };
  } catch (pageError) {
    // If it failed as a page, try fetching as a database!
    try {
      const dbMeta = await notionFetch(`/databases/${normalizedId}`);
      const title = dbMeta.title ? getPlainTextFromRichText(dbMeta.title) : "Services Catalog";
      const databaseRows = await queryDatabase(normalizedId);

      return {
        ...dbMeta,
        id: cleanPageId(dbMeta.id),
        title: title || "Services Catalog",
        isDatabase: true,
        databaseRows,
        databaseSchema: dbMeta.properties,
      };
    } catch (dbError) {
      console.error(`Failed to fetch neither page nor database for ${pageId}:`, dbError);
      throw pageError;
    }
  }
}

export async function getBlockChildren(blockId: string): Promise<NotionBlock[]> {
  const normalizedId = normalizePageId(blockId);
  const results: NotionBlock[] = [];
  let cursor: string | undefined = undefined;

  try {
    while (true) {
      const query = cursor ? `?page_size=100&start_cursor=${cursor}` : `?page_size=100`;
      const data = await notionFetch(`/blocks/${normalizedId}/children${query}`);

      if (data.results && Array.isArray(data.results)) {
        results.push(...data.results);
      }

      if (data.has_more && data.next_cursor) {
        cursor = data.next_cursor;
      } else {
        break;
      }
    }
  } catch (e) {
    // If it's a database, it might not have block children, which is normal
    return [];
  }

  return results;
}

export async function getBlocksWithChildren(blockId: string, maxDepth: number = 3): Promise<NotionBlock[]> {
  const blocks = await getBlockChildren(blockId);

  if (maxDepth <= 0) return blocks;

  const populated = await Promise.all(
    blocks.map(async (block) => {
      if (block.has_children && block.type !== "child_page" && block.type !== "child_database") {
        try {
          const children = await getBlocksWithChildren(block.id, maxDepth - 1);
          return {
            ...block,
            children,
          };
        } catch (e) {
          console.warn(`Failed to fetch children for block ${block.id} (${block.type}):`, e);
          return block;
        }
      }
      return block;
    })
  );

  return populated;
}

export async function getWorkspaceTree(rootId: string = ROOT_PAGE_ID): Promise<NavNode[]> {
  try {
    const rootPage = await getPage(rootId);
    const rootChildren = await getBlockChildren(rootId);

    // Filter child_page AND child_database blocks!
    const childNodes = rootChildren.filter(
      (b) => b.type === "child_page" || b.type === "child_database"
    );

    const subNodes: NavNode[] = await Promise.all(
      childNodes.map(async (cp) => {
        const cleanId = cleanPageId(cp.id);
        const isDb = cp.type === "child_database";
        const title = isDb
          ? cp.child_database?.title || "Services Catalog Database"
          : cp.child_page?.title || "Untitled";

        let nestedChildren: NavNode[] = [];
        if (!isDb) {
          try {
            const subBlocks = await getBlockChildren(cleanId);
            const nestedChildPages = subBlocks.filter(
              (b) => b.type === "child_page" || b.type === "child_database"
            );

            nestedChildren = nestedChildPages.map((ncp) => ({
              id: cleanPageId(ncp.id),
              title:
                ncp.type === "child_database"
                  ? ncp.child_database?.title || "Database"
                  : ncp.child_page?.title || "Untitled",
              icon: ncp.icon || null,
              hasChildren: false,
              lastEditedTime: ncp.last_edited_time,
              isDatabase: ncp.type === "child_database",
            }));
          } catch (e) {
            console.warn(`Could not fetch subchildren for ${cleanId}`, e);
          }
        }

        return {
          id: cleanId,
          title,
          icon: cp.icon || null,
          hasChildren: nestedChildren.length > 0,
          children: nestedChildren,
          lastEditedTime: cp.last_edited_time,
          isDatabase: isDb,
        };
      })
    );

    const rootNode: NavNode = {
      id: cleanPageId(rootPage.id),
      title: rootPage.title || "New Agency Egypt",
      icon: rootPage.icon,
      hasChildren: subNodes.length > 0,
      children: subNodes,
      lastEditedTime: rootPage.last_edited_time,
      isRoot: true,
      isDatabase: false,
    };

    return [rootNode];
  } catch (error) {
    console.error("Error fetching workspace tree:", error);
    return [];
  }
}
