export default function Topbar({ theme, onToggleTheme }) {
  return (
    <div className="topbar">
      <div className="model-tag">
        <span className="pulse-dot" />
        ReDocs &nbsp;<span className="status">backend · localhost:8000</span>
      </div>
      <div className="topbar-actions">
        <button className="theme-toggle" onClick={onToggleTheme}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </div>
    </div>
  );
}
