import React from "react";
import type { Heading } from "../types";

interface TableOfContentsProps {
  headings: Heading[];
  activeId: string | null;
  onHeadingClick: (id: string) => void;
  readingTime: number;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeId,
  onHeadingClick,
  readingTime,
}) => {
  return (
    <nav className="toc">
      <div className="toc-header">
        <h3>Contents</h3>
        <span className="reading-time">{readingTime} min read</span>
      </div>
      <ul className="toc-list">
        {headings.length === 0 ? (
          <li className="toc-empty">No headings found</li>
        ) : (
          headings.map((heading) => (
            <TOCItem
              key={heading.id}
              heading={heading}
              activeId={activeId}
              onClick={onHeadingClick}
            />
          ))
        )}
      </ul>
    </nav>
  );
};

interface TOCItemProps {
  heading: Heading;
  activeId: string | null;
  onClick: (id: string) => void;
  depth?: number;
}

const TOCItem: React.FC<TOCItemProps> = ({
  heading,
  activeId,
  onClick,
  depth = 0,
}) => {
  const isActive = activeId === heading.id;

  return (
    <>
      <li>
        <a
          href={`#${heading.id}`}
          className={`toc-link ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
          onClick={(e) => {
            e.preventDefault();
            onClick(heading.id);
          }}
        >
          {heading.text}
        </a>
      </li>
      {heading.children.map((child) => (
        <TOCItem
          key={child.id}
          heading={child}
          activeId={activeId}
          onClick={onClick}
          depth={depth + 1}
        />
      ))}
    </>
  );
};