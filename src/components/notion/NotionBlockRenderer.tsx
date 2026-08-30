"use client";

import React from "react";
import { NotionBlock } from "@/lib/types";
import { RichText } from "./RichText";
import { HeadingBlock } from "./HeadingBlock";
import { CalloutBlock } from "./CalloutBlock";
import { TableBlock } from "./TableBlock";
import { CodeBlock } from "./CodeBlock";
import { ListGroup } from "./ListBlock";
import { TodoBlock } from "./TodoBlock";
import { ToggleBlock } from "./ToggleBlock";
import { QuoteBlock } from "./QuoteBlock";
import { DividerBlock } from "./DividerBlock";
import { ImageBlock } from "./ImageBlock";
import { BookmarkBlock } from "./BookmarkBlock";
import { ChildPageCard } from "./ChildPageCard";
import { EquationBlock } from "./EquationBlock";
import { getPlainTextFromRichText, isRTL } from "@/lib/utils";
import { File, Video, Music } from "lucide-react";

interface NotionBlockRendererProps {
  blocks: NotionBlock[];
}

export function NotionBlockRenderer({ blocks }: NotionBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="py-12 text-center text-zinc-400 dark:text-zinc-500 text-sm italic">
        No content in this section.
      </div>
    );
  }

  // Helper to render nested children recursively
  const renderChildren = (childBlocks: NotionBlock[]) => {
    return <NotionBlockRenderer blocks={childBlocks} />;
  };

  // Group adjacent list items (bulleted and numbered)
  const renderedElements: React.ReactNode[] = [];
  let currentListType: "bulleted_list_item" | "numbered_list_item" | null = null;
  let currentListGroup: NotionBlock[] = [];

  const flushList = () => {
    if (currentListGroup.length > 0 && currentListType) {
      renderedElements.push(
        <ListGroup
          key={`list-${currentListGroup[0].id}`}
          blocks={[...currentListGroup]}
          ordered={currentListType === "numbered_list_item"}
          childrenRenderer={renderChildren}
        />
      );
      currentListGroup = [];
      currentListType = null;
    }
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      if (currentListType === block.type) {
        currentListGroup.push(block);
      } else {
        flushList();
        currentListType = block.type;
        currentListGroup.push(block);
      }
      continue;
    } else {
      flushList();
    }

    switch (block.type) {
      case "paragraph": {
        const data = block.paragraph;
        if (!data) break;
        const plainText = getPlainTextFromRichText(data.rich_text);
        if (!plainText.trim()) {
          // Empty paragraph acts as a small breathing space
          renderedElements.push(<div key={block.id} className="h-4" />);
          break;
        }
        const rtl = isRTL(plainText);
        renderedElements.push(
          <p
            key={block.id}
            dir={rtl ? "rtl" : "ltr"}
            className="my-3 text-[0.98rem] leading-[1.75] text-zinc-700 dark:text-zinc-300 font-normal"
          >
            <RichText richText={data.rich_text} />
          </p>
        );
        break;
      }

      case "heading_1":
      case "heading_2":
      case "heading_3": {
        renderedElements.push(<HeadingBlock key={block.id} block={block} />);
        break;
      }

      case "callout": {
        renderedElements.push(
          <CalloutBlock key={block.id} block={block} childrenRenderer={renderChildren} />
        );
        break;
      }

      case "table": {
        renderedElements.push(<TableBlock key={block.id} block={block} />);
        break;
      }

      case "code": {
        renderedElements.push(<CodeBlock key={block.id} block={block} />);
        break;
      }

      case "to_do": {
        renderedElements.push(
          <TodoBlock key={block.id} block={block} childrenRenderer={renderChildren} />
        );
        break;
      }

      case "toggle": {
        renderedElements.push(
          <ToggleBlock key={block.id} block={block} childrenRenderer={renderChildren} />
        );
        break;
      }

      case "quote": {
        renderedElements.push(
          <QuoteBlock key={block.id} block={block} childrenRenderer={renderChildren} />
        );
        break;
      }

      case "divider": {
        renderedElements.push(<DividerBlock key={block.id} />);
        break;
      }

      case "image": {
        renderedElements.push(<ImageBlock key={block.id} block={block} />);
        break;
      }

      case "bookmark": {
        renderedElements.push(<BookmarkBlock key={block.id} block={block} />);
        break;
      }

      case "child_page": {
        renderedElements.push(<ChildPageCard key={block.id} block={block} />);
        break;
      }

      case "equation": {
        renderedElements.push(<EquationBlock key={block.id} block={block} />);
        break;
      }

      case "column_list": {
        if (block.children && block.children.length > 0) {
          const colCount = block.children.length;
          renderedElements.push(
            <div
              key={block.id}
              className={`my-6 grid grid-cols-1 md:grid-cols-${Math.min(colCount, 4)} gap-6`}
            >
              {block.children.map((col) => (
                <div key={col.id} className="min-w-0">
                  {col.children && renderChildren(col.children)}
                </div>
              ))}
            </div>
          );
        }
        break;
      }

      case "synced_block": {
        if (block.children && block.children.length > 0) {
          renderedElements.push(
            <div key={block.id} className="my-3 border-l-2 border-indigo-400/40 pl-3">
              {renderChildren(block.children)}
            </div>
          );
        }
        break;
      }

      case "video": {
        const vidUrl = block.video?.type === "external" ? block.video?.external?.url : block.video?.file?.url;
        if (vidUrl) {
          renderedElements.push(
            <div key={block.id} className="my-6 rounded-2xl overflow-hidden ring-1 ring-zinc-800 bg-zinc-950 p-1">
              <div className="rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center">
                {vidUrl.includes("youtube.com") || vidUrl.includes("youtu.be") || vidUrl.includes("vimeo.com") ? (
                  <iframe src={vidUrl} className="w-full h-full" allowFullScreen />
                ) : (
                  <video src={vidUrl} controls className="w-full h-full" />
                )}
              </div>
            </div>
          );
        }
        break;
      }

      case "audio": {
        const audUrl = block.audio?.type === "external" ? block.audio?.external?.url : block.audio?.file?.url;
        if (audUrl) {
          renderedElements.push(
            <div key={block.id} className="my-4 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800 flex items-center gap-3">
              <Music className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <audio src={audUrl} controls className="w-full h-8" />
            </div>
          );
        }
        break;
      }

      case "file":
      case "pdf": {
        const fData = block[block.type];
        const fileUrl = fData?.type === "external" ? fData?.external?.url : fData?.file?.url;
        const fileName = fData?.name || "Download File";
        if (fileUrl) {
          renderedElements.push(
            <a
              key={block.id}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="my-3 inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 text-sm font-medium text-zinc-900 dark:text-zinc-100 transition-colors shadow-sm"
            >
              <File className="w-4 h-4 text-indigo-500" />
              <span>{fileName}</span>
            </a>
          );
        }
        break;
      }

      default:
        break;
    }
  }

  flushList();

  return <div className="space-y-1">{renderedElements}</div>;
}
