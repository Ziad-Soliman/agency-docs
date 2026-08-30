export interface NotionAnnotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}

export interface NotionRichText {
  type: "text" | "mention" | "equation";
  text?: {
    content: string;
    link: { url: string } | null;
  };
  mention?: {
    type: "user" | "page" | "database" | "date" | "link_preview";
    page?: { id: string };
    user?: { id: string; name?: string; avatar_url?: string };
    date?: { start: string; end?: string | null };
  };
  equation?: {
    expression: string;
  };
  annotations: NotionAnnotations;
  plain_text: string;
  href: string | null;
}

export interface NotionIcon {
  type: "emoji" | "external" | "file";
  emoji?: string;
  external?: { url: string };
  file?: { url: string; expiry_time?: string };
}

export interface NotionCover {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string; expiry_time?: string };
}

export interface NotionPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  cover: NotionCover | null;
  icon: NotionIcon | null;
  parent: {
    type: "workspace" | "page_id" | "database_id" | "block_id";
    page_id?: string;
    database_id?: string;
    workspace?: boolean;
  };
  properties: {
    title?: {
      id: string;
      type: "title";
      title: NotionRichText[];
    };
    [key: string]: any;
  };
  url: string;
  title: string;
}

export interface NotionBlock {
  id: string;
  parent?: {
    type: string;
    page_id?: string;
    block_id?: string;
  };
  created_time: string;
  last_edited_time: string;
  has_children: boolean;
  type: string;
  children?: NotionBlock[];
  [key: string]: any;
}

export interface NavNode {
  id: string;
  title: string;
  icon: NotionIcon | null;
  hasChildren: boolean;
  children?: NavNode[];
  lastEditedTime: string;
  isRoot?: boolean;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}
