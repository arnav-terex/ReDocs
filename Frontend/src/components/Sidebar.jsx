export default function Sidebar({ fileName, onNewChat }) {
  return (
    <div className="sidebar">
      <h1>ReDocs</h1>
      <div className="sub">Legal document assistant</div>

      <div className="new-chat" onClick={onNewChat}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New session
      </div>

      <div className="thread-list">
        <div className="thread active">
          {fileName ? `📄 ${fileName}` : "No document uploaded yet"}
        </div>
      </div>

      <div className="sidebar-foot">
        <div className="avatar-sm" />
        <div>Connected to your local ReDocs server</div>
      </div>
    </div>
  );
}
