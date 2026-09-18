import { useRef } from "react";

export default function Composer({ value, onChange, onSend, onFileUpload }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInput = (e) => {
    onChange(e.target.value);
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
    e.target.value = "";
  };

  return (
    <div className="composer">
      <div className="composer-inner">
        <button
          type="button"
          className="attach-btn"
          title="Upload document"
          onClick={() => fileInputRef.current?.click()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.44 11.05 12.25 20.24a5 5 0 0 1-7.07-7.07l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95L10.13 17.14a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          hidden
          accept=".pdf,.doc,.docx,.txt"
        />
        <textarea
          id="chat-input"
          ref={textareaRef}
          rows={1}
          placeholder="Ask about the document, or paste text…"
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" title="Send" onClick={onSend}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div className="composer-note">ReDocs can make mistakes. Verify anything that matters legally.</div>
    </div>
  );
}
