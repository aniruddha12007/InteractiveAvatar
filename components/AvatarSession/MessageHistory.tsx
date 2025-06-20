import React, { useRef, useEffect, useState } from "react";
import ReactMarkdown, { Components } from 'react-markdown'; // Import Components type
import { useDebounce } from "ahooks";

import { useMessageHistory, MessageSender } from "../logic";

interface MessageHistoryProps {
  className?: string;
  summary?: string | null;
}

// Define custom components for ReactMarkdown to apply styling
const customMarkdownComponents: Components = {
  // Target paragraph elements rendered by ReactMarkdown
  p: ({ node, ...props }) => {
    // Apply margin-bottom to each paragraph
    // Tailwind CSS classes like 'mb-4' (margin-bottom: 1rem) or 'mb-2' (margin-bottom: 0.5rem)
    // Choose the margin that gives you the desired space.
    return <p className="mb-4 last:mb-0" {...props} />; // `last:mb-0` removes margin from the very last paragraph
  },
  // You can also define other components like ul, li if you want to style lists differently
  // ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
  // li: ({ node, ...props }) => <li className="mb-1" {...props} />,
};

interface ImageData { link: string; thumbnail: string; title: string; }
interface ImageGroup { id: string; summary: string; images: ImageData[] }

export const MessageHistory: React.FC<MessageHistoryProps> = ({ className, summary }) => {
  const { messages } = useMessageHistory();
    const containerRef = useRef<HTMLDivElement>(null);
  const [groups, setGroups] = useState<ImageGroup[]>([]);
  const [imgLoading, setImgLoading] = useState(false);



  // Find the last avatar message
  const lastAvatarMsg = [...messages].reverse().find(m => m.sender === MessageSender.AVATAR)?.content;
// Debounce the content to wait for 1 s of inactivity before triggering a fetch
const debouncedAvatarMsg = useDebounce(lastAvatarMsg, { wait: 1000 });

// Cache to make sure we do not hit the same query more than once in the same session
const fetchedQueriesRef = useRef<Set<string>>(new Set());

  // Push a new group when summary updates
  useEffect(() => {
    if (summary) {
      setGroups(prev => [...prev, { id: Date.now().toString(), summary, images: [] }]);
    }
  }, [summary]);

  useEffect(() => {
    let query = "";
    const contextWords = "diagram flowchart illustration visual infographic schematic mindmap concept map timeline architecture process chart graph image";
    const sourceText = debouncedAvatarMsg ?? summary ?? "";
    // Heuristic: fetch only if the text contains words indicating a diagram / visual is helpful
    const visualRegex = /(diagram|flow\s?chart|illustrat|visual|mind\s?map|graph|architecture|chart|timeline|schematic|infograph|concept|process|image|picture|figure|map|wireframe|network)/i;

    if (!visualRegex.test(sourceText)) {
      // Nothing that obviously needs a visual – skip fetching
      return;
    }

    query = `${sourceText} ${contextWords}`;
    // Skip if we have already fetched images for this query in this session
    if (fetchedQueriesRef.current.has(query)) return;
    fetchedQueriesRef.current.add(query);

    setImgLoading(true);
    fetch("/api/image-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.images) return;
        setGroups(prev => {
          if (prev.length === 0) return prev; // safeguard
          const copy = [...prev];
          copy[copy.length - 1] = {
            ...copy[copy.length - 1],
            images: [...copy[copy.length - 1].images, ...data.images],
          };
          return copy;
        });
      })
      .finally(() => setImgLoading(false));
  }, [debouncedAvatarMsg, summary]);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto flex flex-col gap-2 p-4 text-white rounded-xl bg-zinc-800 h-full ${className}`}
    >
      {groups.map(group => (
        <div key={group.id} className="bg-zinc-700 p-3 rounded-lg">
          <h3 className="text-sm font-semibold mb-1">Conversation Summary:</h3>
          <div className="text-xs text-zinc-300">
            <ReactMarkdown components={customMarkdownComponents}>{group.summary}</ReactMarkdown>
          </div>
          {imgLoading && groups[groups.length -1].id === group.id && (
            <div className="text-zinc-400 text-xs mt-2">Loading images...</div>
          )}
          {group.images.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {group.images.map(img => (
                <a key={img.link} href={img.link} target="_blank" rel="noopener noreferrer">
                  <img src={img.link} alt={img.title} className="w-32 h-32 object-cover rounded" />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};