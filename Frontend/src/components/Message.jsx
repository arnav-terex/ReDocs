import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Message({ role, text }) {
  const isBot = role === "bot";
  const avatarClass = isBot ? "ai" : "user";
  const isThinking = isBot && text === "Thinking...";

  return (
    <div className={`msg-row ${avatarClass}`}>
      <div className={`msg-avatar ${avatarClass}`} />
      <div className="msg-body">
        {isThinking ? (
          <div className="signal">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        ) : (
          <div className="bubble markdown">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}