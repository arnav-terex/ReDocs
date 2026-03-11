import { IoChatbubbleEllipses } from "react-icons/io5";
import ChatForm from "./components/ChatForm"
import {useState} from "react";

const App = () => {
  const [messages, setMessages]=useState([
    {role:"bot",text:"Upload your legal document here or paste the text"}
  ]);

  const handleFileUpload = async (file) => {
    // show in chat
    setMessages(prev => [...prev,
        { role: "user", text: `📄 ${file.name}` },
        { role: "bot", text: "⚙️ Processing your document..." }
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        setMessages(prev => [
            ...prev.slice(0, -1),
            { role: "bot", text: ` ${data.message}` }
        ]);
    } catch (error) {
        setMessages(prev => [
            ...prev.slice(0, -1),
            { role: "bot", text: "⚠️ Upload failed. Is the server running?" }
        ]);
    }
};

  const handleSendMsg =async (userTxt) => {
    // 1. Show user message immediately
    setMessages(prev=>[...prev,{role:"user",text:userTxt}]);

    // 2. Show "thinking..." while waiting
    setMessages(prev => [...prev, { role: "bot", text: "Thinking..." }]);
    
    try {
        // 3. Call FastAPI backend
        const response = await fetch("http://localhost:8000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: userTxt })
        });

        const data = await response.json();

        // 4. Replace "Thinking..." with real answer
        setMessages(prev => [
            ...prev.slice(0, -1),        // remove last message (Thinking...)
            { role: "bot", text: data.answer }  // add real answer
        ]);

    }catch (error){
      // 5. Show error if backend is down
        setMessages(prev => [
            ...prev.slice(0, -1),
            { role: "bot", text: "Could not connect to server." }
        ]);
    }
  };

  return(
    <div className ="container">
      <div className ="chatbot">
        {/* CHATBOT HEADER */}
        <div className ="chat-header">
          <div className ="header-info">
            {/* <IoChatbubbleEllipses size={24} /> */}
            <h2 className="logo-text">Redocs</h2>
          </div>
          {/* <button className="material-symbols-outlined">
          stat_minus_1
          </button> */}
        </div>
        {/* CHATBOT BODY */}
        <div className="chat-body">
          {/* <div className="msg bot-msg">
             <IoChatbubbleEllipses className="botLogo" size={24} />
             <p className="msg-text">
              Upload your legal document here or paste the text
             </p>
          </div>
          <div className="msg user-msg">
             <p className="msg-text">
              Lorem ipsum dolor sit amet.
             </p>
          </div> */}
           {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role === "bot" ? "bot-msg" : "user-msg"}`}>
              {msg.role === "bot" && (
                <IoChatbubbleEllipses className="botLogo" size={24} />
              )}
              <p className="msg-text">{msg.text}</p>
            </div>
          ))}
        </div>
        {/* CHATBOT Footer */}
        <div className="chat-footer">
          <ChatForm onSendMsg={handleSendMsg} onFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  ) 
};

export default App;