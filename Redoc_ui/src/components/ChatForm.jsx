import { useState, useRef } from "react";

const ChatForm = ({ onSendMsg , onFileUpload}) => {
    const [inputText,setInputText] = useState("");
    const fileRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();             // stops page refresh
        if (!inputText.trim()) return;  // ignore empty input
        
        onSendMsg(inputText);       // send text to App.jsx
        setInputText("");               // clear input box
    };

    const handleFile=(e)=>{
        const file=e.target.files[0];
        if(!file) return;
        if(!file.name.endsWith(".pdf")){
            alert("Please upload a pdf file!");
            return;
        }
        onFileUpload(file);
    }

    return (
        <form onSubmit={handleSubmit} className="chat-form">
            <input 
                type="text" 
                placeholder="message..." 
                className="msg-input" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                required
            />

            <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                style={{display:"none"}}
                onChange={handleFile}/>

            <button type="button" className="attachment-btn material-symbols-outlined" onClick={()=>fileRef.current.click()}>
                add_circle     
            </button>
            <button type="submit" className="material-symbols-outlined">
                arrow_upward   
            </button>
        </form>
    );
};

export default ChatForm;