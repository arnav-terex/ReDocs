import { useState } from "react";
import Rail from "./components/Rail.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import ThreadView from "./components/ThreadView.jsx";
import Composer from "./components/Composer.jsx";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BACKEND_URL = "http://localhost:8000";

const App = () => {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Upload your legal document here or paste the text" },
  ]);
  const [draft, setDraft] = useState("");
  const [fileName, setFileName] = useState(null);
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const handleFileUpload = async (file) => {
    setFileName(file.name);

    // show in chat
    setMessages((prev) => [
      ...prev,
      { role: "user", text: `📄 ${file.name}` },
      { role: "bot", text: "Thinking..." },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: `${data.message}` },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: "⚠️ Upload failed. Is the server running?" },
      ]);
    }
  };

  const handleSendMsg = async (userTxt) => {
    // 1. Show user message immediately
    setMessages((prev) => [...prev, { role: "user", text: userTxt }]);

    // 2. Show "thinking..." while waiting
    setMessages((prev) => [...prev, { role: "bot", text: "Thinking..." }]);

    try {
      // 3. Call FastAPI backend
      const response = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userTxt }),
      });

      const data = await response.json();

      // 4. Replace "Thinking..." with real answer
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: data.answer },
      ]);
    } catch (error) {
      // 5. Show error if backend is down
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: "Could not connect to server." },
      ]);
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    handleSendMsg(text);
  };

  const handleNewChat = () => {
    setMessages([
      { role: "bot", text: "Upload your legal document here or paste the text" },
    ]);
    setFileName(null);
    setDraft("");
  };

  return (
    <div className="app">
      <Rail />
      <Sidebar fileName={fileName} onNewChat={handleNewChat} />
      <div className="main">
        <Topbar theme={theme} onToggleTheme={toggleTheme} />
        <ThreadView messages={messages} />
        <Composer
          value={draft}
          onChange={setDraft}
          onSend={handleSend}
          onFileUpload={handleFileUpload}
        />
      </div>
    </div>
  );
};

export default App;
