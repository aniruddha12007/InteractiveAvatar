import React, { useRef, useState, useMemo, useEffect } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { useDebounce } from "ahooks";
import { useMessageHistory, MessageSender } from "../logic";

interface MessageHistoryProps {
  className?: string;
  summary?: string | null; // kept for API compatibility, not used
}

interface ImageData {
  link: string;
  thumbnail: string;
  title: string;
}

interface Turn {
  id: string;
  user: string;
  avatar: string[];
  images: ImageData[];
}

const customMarkdownComponents: Components = {
  p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
  ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2" {...props} />,
  ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2" {...props} />,
  li: ({ node, ...props }) => <li className="mb-1" {...props} />,
};

export const MessageHistory: React.FC<MessageHistoryProps> = ({ className }) => {
  const { messages } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [imagesByTurn, setImagesByTurn] = useState<Record<string, ImageData[]>>(
    {},
  );
  const [imgLoadingTurnId, setImgLoadingTurnId] = useState<string | null>(null);

  // Build conversational turns: each starts with a user (CLIENT) message
  const turns: Turn[] = useMemo(() => {
    const result: Turn[] = [];
    let current: Turn | null = null;

    messages.forEach((msg) => {
      if (msg.sender === MessageSender.CLIENT) {
        if (current) result.push(current);
        current = {
          id: msg.id,
          user: msg.content,
          avatar: [],
          images: imagesByTurn[msg.id] || [],
        };
      } else {
        // avatar message
        if (!current) return;
        current.avatar.push(msg.content);
      }
    });

    if (current) result.push(current);
    // Attach imagesByTurn updates
    return result.map((t) => ({ ...t, images: imagesByTurn[t.id] || [] }));
  }, [messages, imagesByTurn]);

  // ------------ IMAGE FETCHING LOGIC -------------
  const lastAvatarMsgObj = [...messages]
    .reverse()
    .find((m) => m.sender === MessageSender.AVATAR);
  const debouncedAvatarMsg = useDebounce(lastAvatarMsgObj?.content, { wait: 1000 });

  useEffect(() => {
    if (!debouncedAvatarMsg || !lastAvatarMsgObj) return;

    // detect visual cue keywords
    const visualRegex =
      /(diagram|flow\s?chart|illustrat|visual|mind\s?map|graph|architecture|chart|timeline|schematic|infograph|concept|process|image|picture|figure|map|wireframe|network)/i;
    if (!visualRegex.test(debouncedAvatarMsg)) return;

    // Find the most recent user message (turn) before this avatar msg
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.sender === MessageSender.CLIENT);
    if (!lastUserMsg) return;

    const turnId = lastUserMsg.id;
    if (imagesByTurn[turnId]?.length) return; // already fetched

    const query = `${debouncedAvatarMsg} diagram flowchart illustration visual infographic schematic mindmap concept map timeline architecture process chart graph image`;

    setImgLoadingTurnId(turnId);
    fetch("/api/image-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.images) return;
        setImagesByTurn((prev) => ({ ...prev, [turnId]: data.images }));
      })
      .finally(() => setImgLoadingTurnId(null));
  }, [debouncedAvatarMsg, lastAvatarMsgObj, messages, imagesByTurn]);

  // ------------ UI ACTIONS -------------
  const handleToggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
  };

  const handleExportPdf = async () => {
    if (!containerRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(containerRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // calculate dimensions
    const ratio = canvas.width / canvas.height;
    let imgWidth = pageWidth;
    let imgHeight = imgWidth / ratio;
    if (imgHeight > pageHeight) {
      imgHeight = pageHeight;
      imgWidth = imgHeight * ratio;
    }

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save("chat-history.pdf");
  };

  // Auto-scroll to bottom when a new turn is added
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [turns.length]);

  return (
    <div
      className={`${isFullScreen ? "fixed inset-0 z-50 bg-zinc-900" : "h-full"} flex flex-col rounded-xl ${className}`}
    >
      {/* Action buttons */}
      <div className="flex justify-end gap-2 p-2 bg-zinc-800 rounded-t-xl h-12 flex-shrink-0">
        <button
          onClick={handleToggleFullScreen}
          className="px-3 py-1 text-xs bg-zinc-600 hover:bg-zinc-500 rounded text-white"
        >
          {isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
        <button
          onClick={handleExportPdf}
          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded text-white"
        >
          Export PDF
        </button>
      </div>

      <div
        ref={containerRef}
        className="overflow-y-auto flex flex-col gap-4 p-4 text-white bg-zinc-800 flex-1 rounded-b-xl"
      >
      {turns.map((turn) => (
        <div key={turn.id} className="bg-zinc-700 p-3 rounded-lg flex flex-col gap-2">
          <div className="text-xs text-cyan-400 font-semibold">You:</div>
          <div className="text-xs whitespace-pre-line break-words">{turn.user}</div>

          {turn.avatar.length > 0 && (
            <>
              <div className="text-xs text-amber-400 font-semibold">Tutor (summary):</div>
              <div className="prose prose-invert prose-xs max-w-none text-xs">
                <ReactMarkdown components={customMarkdownComponents}>
                  {turn.avatar.join("\n\n")}
                </ReactMarkdown>
              </div>
            </>
          )}

          {imgLoadingTurnId === turn.id && (
            <div className="text-zinc-400 text-xs">Loading images...</div>
          )}

          {turn.images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {turn.images.map((img) => (
                <a
                  key={img.link}
                  href={img.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={img.link}
                    alt={img.title}
                    className="w-32 h-32 object-cover rounded"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
};
