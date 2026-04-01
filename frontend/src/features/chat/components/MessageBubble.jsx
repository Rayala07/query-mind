import ReactMarkdown from "react-markdown";
import userProfileImg from "../../../assets/user_profile.jpeg";
import aiLogoImg from "../../../assets/ai_logo.png";

const markdownComponents = {
  // Headings
  h1: ({ children }) => (
    <h1 className="text-base font-semibold text-white/90 mt-3 mb-1.5 first:mt-0">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-semibold text-white/85 mt-3 mb-1 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-medium text-white/80 mt-2 mb-1 first:mt-0">{children}</h3>
  ),

  // Paragraph
  p: ({ children }) => (
    <p className="text-sm text-white/80 leading-relaxed mb-2 last:mb-0">{children}</p>
  ),

  // Bold & Italic
  strong: ({ children }) => (
    <strong className="font-semibold text-white/95">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-white/75">{children}</em>
  ),

  // Inline code
  code: ({ inline, children }) =>
    inline ? (
      <code className="px-1.5 py-0.5 rounded-md bg-white/[0.08] text-[12px] font-mono text-emerald-400/90">
        {children}
      </code>
    ) : (
      <pre className="my-2 p-3 rounded-xl bg-[#0a0a0a] border border-white/[0.06] overflow-x-auto scrollbar-hide">
        <code className="text-[12px] font-mono text-emerald-400/80 leading-relaxed">
          {children}
        </code>
      </pre>
    ),

  // Lists
  ul: ({ children }) => (
    <ul className="my-1.5 ml-4 space-y-1 list-disc list-outside marker:text-white/30">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-1.5 ml-4 space-y-1 list-decimal list-outside marker:text-white/30">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-white/80 leading-relaxed pl-1">{children}</li>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <blockquote className="my-2 pl-3 border-l-2 border-white/20 text-white/55 italic">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => <hr className="my-3 border-white/[0.08]" />,

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-400/80 hover:text-blue-300 underline underline-offset-2 transition-colors duration-150"
    >
      {children}
    </a>
  ),
};

const MessageBubble = ({ content, role }) => {
  if (role === "user") {
    return (
      <div className="flex items-start justify-end gap-3 w-full">
        <div className="max-w-[65%] bg-[#141414] border border-white/[0.07] rounded-2xl rounded-tr-sm px-4 py-3">
          <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-white/10 mt-0.5">
          <img
            src={userProfileImg}
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 bg-[#141414] border border-white/[0.08] mt-0.5 flex items-center justify-center">
        <img
          src={aiLogoImg}
          alt="AI"
          className="w-5 h-5 object-contain"
        />
      </div>
      <div className="max-w-[65%] bg-[#0f0f0f] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 min-w-[60px] min-h-[44px]">
        {!content ? (
          <div className="flex gap-1 items-center justify-center h-full min-h-[20px]">
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce"></span>
          </div>
        ) : (
          <ReactMarkdown components={markdownComponents}>
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
