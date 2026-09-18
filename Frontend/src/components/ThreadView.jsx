import { useEffect, useRef } from "react";
import Message from "./Message.jsx";

export default function ThreadView({ messages }) {
  const viewRef = useRef(null);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.scrollTop = viewRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="thread-view" ref={viewRef}>
      {messages.map((m, i) => (
        <Message key={i} role={m.role} text={m.text} />
      ))}
    </div>
  );
}
