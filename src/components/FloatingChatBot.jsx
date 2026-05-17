import React, { useState, useRef, useEffect } from "react";
import { 
  MessageCircle, 
  X, 
  SendHorizontal, 
  Image as ImageIcon, 
  Sparkles, 
  User,
  Minus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatbot } from "../api/chatbotApi";

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const suggestions = [
    "Xin chào !",
    "Tôi muốn tư vấn bệnh",
  ];

  useEffect(() => {
    const saved = localStorage.getItem("course_chat_history");
    if (saved) setChat(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("course_chat_history", JSON.stringify(chat));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const typeText = (text) => {
    let index = 0;
    setChat(prev => [...prev, { sender: "bot", text: "" }]);
    const interval = setInterval(() => {
      index++;
      setChat(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = text.slice(0, index);
        return updated;
      });
      if (index >= text.length) clearInterval(interval);
    }, 10);
  };

  const handleSend = async (customMessage = null) => {
    const msg = customMessage || message;
    if (!msg.trim() && !image) return;
    if (loading) return;

    const imgFile = image;
    if (msg) setChat(prev => [...prev, { sender: "user", text: msg }]);
    if (imgFile) setChat(prev => [...prev, { sender: "user", image: URL.createObjectURL(imgFile) }]);

    setMessage("");
    setImage(null);
    setLoading(true);

    try {
      const res = await sendChatbot({ message: msg, image: imgFile });
      if (!res?.success || !res?.reply) {
        typeText("Hệ thống đang bận, bạn đợi chút nhé! 🛠️");
        return;
      }
      typeText(res.reply);
    } catch (err) {
      typeText("Có lỗi kết nối, bạn kiểm tra lại mạng nhé! 🌐");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <AnimatePresence>
        {/* Nút bong bóng chat */}
        {!open && (
          <motion.button 
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={styles.chatButton} 
            onClick={() => setOpen(true)}
          >
            <MessageCircle size={28} color="#fff" strokeWidth={2.5} />
            <div style={styles.onlineBadge} />
          </motion.button>
        )}

        {/* Khung Chat Container */}
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            style={styles.chatContainer}
          >
            {/* Header - Glassmorphism style */}
            <div style={styles.header}>
              <div style={styles.headerInfo}>
                <div style={styles.botAvatar}>
                  <Sparkles size={18} color="#1f6feb" />
                </div>
                <div>
                  <div style={styles.botName}>AI Assistant</div>
                  <div style={styles.botStatus}>Online</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={styles.controlBtn} onClick={() => setOpen(false)}>
                  <Minus size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div style={styles.messagesArea}>
              <div style={styles.dateDivider}>Hôm nay</div>
              {chat.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  style={{
                    ...styles.messageRow, 
                    flexDirection: msg.sender === "user" ? "row-reverse" : "row"
                  }}
                >
                  <div style={msg.sender === "user" ? styles.userIcon : styles.botIcon}>
                    {msg.sender === "user" ? <User size={12} /> : <Sparkles size={12} />}
                  </div>
                  <div style={{
                    ...styles.bubble,
                    background: msg.sender === "user" ? "#1f6feb" : "#30363d",
                    color: "#e6edf3",
                    borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  }}>
                    {msg.text && <div>{msg.text}</div>}
                    {msg.image && <img src={msg.image} alt="upload" style={styles.msgImage} />}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div style={styles.typing}>
                  <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    Bot đang nghĩ...
                  </motion.span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="no-scrollbar" style={styles.suggestionWrapper}>
              {suggestions.map((s, i) => (
                <button key={i} style={styles.suggestionBtn} onClick={() => handleSend(s)}>
                  {s}
                </button>
              ))}
            </div>

            {/* Footer Input */}
            <div style={styles.footer}>
              {image && (
                <div style={styles.imagePreview}>
                  <img src={URL.createObjectURL(image)} alt="preview" style={styles.previewThumb} />
                  <button onClick={() => setImage(null)} style={styles.removeImg}><X size={12} /></button>
                </div>
              )}
              <div style={styles.inputContainer}>
                <button style={styles.iconBtn} onClick={() => fileInputRef.current.click()}>
                  <ImageIcon size={20} color="#8b949e" />
                </button>
                <input
                  type="file" hidden ref={fileInputRef} accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <input
                  style={styles.inputField}
                  placeholder="Hỏi AI về khóa học..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button 
                  style={{
                    ...styles.sendBtn, 
                    background: (message || image) ? "#1f6feb" : "transparent"
                  }} 
                  onClick={() => handleSend()}
                  disabled={!message && !image}
                >
                  <SendHorizontal size={18} color={(message || image) ? "#fff" : "#484f58"} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 30,
    right: 30,
    zIndex: 9999,
  },
  chatButton: {
    width: 60,
    height: 60,
    borderRadius: "18px",
    background: "#1f6feb",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 24px rgba(31, 111, 235, 0.4)",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    background: "#238636",
    border: "3px solid #0d1117",
    borderRadius: "50%"
  },
  chatContainer: {
    width: 380,
    height: 550,
    background: "#161b22",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 12px 48px rgba(0,0,0,0.5)",
    border: "1px solid #30363d",
    overflow: "hidden",
  },
  header: {
    padding: "16px 20px",
    background: "rgba(22, 27, 34, 0.8)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #30363d",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  botAvatar: {
    width: 34,
    height: 34,
    background: "#0d1117",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #30363d"
  },
  botName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#e6edf3"
  },
  botStatus: {
    fontSize: "11px",
    color: "#238636",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  controlBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#8b949e",
    display: "flex",
    padding: "5px"
  },
  messagesArea: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    background: "#0d1117"
  },
  dateDivider: {
    textAlign: "center",
    fontSize: "11px",
    color: "#484f58",
    margin: "10px 0"
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px"
  },
  botIcon: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#30363d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1f6feb"
  },
  userIcon: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#1f6feb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff"
  },
  bubble: {
    padding: "10px 14px",
    fontSize: "13.5px",
    maxWidth: "80%",
    lineHeight: "1.6",
    border: "1px solid #30363d"
  },
  msgImage: {
    width: "100%",
    borderRadius: "8px",
    marginTop: "8px",
    border: "1px solid #484f58"
  },
  suggestionWrapper: {
    display: "flex",
    gap: "8px",
    padding: "8px 20px",
    overflowX: "auto",
    background: "#0d1117"
  },
  suggestionBtn: {
    background: "#161b22",
    border: "1px solid #30363d",
    padding: "6px 14px",
    borderRadius: "100px",
    fontSize: "11px",
    whiteSpace: "nowrap",
    cursor: "pointer",
    color: "#8b949e",
    transition: "all 0.2s"
  },
  footer: {
    padding: "15px 20px",
    background: "#161b22",
    borderTop: "1px solid #30363d"
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    background: "#0d1117",
    borderRadius: "12px",
    padding: "4px 4px 4px 12px",
    gap: "8px",
    border: "1px solid #30363d"
  },
  inputField: {
    flex: 1,
    border: "none",
    background: "none",
    outline: "none",
    fontSize: "13px",
    color: "#e6edf3"
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex"
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: "8px",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "0.3s"
  },
  typing: {
    fontSize: "11px",
    color: "#484f58",
  },
  imagePreview: {
    position: "relative",
    display: "inline-block",
    marginBottom: "10px"
  },
  previewThumb: {
    width: 45,
    height: 45,
    borderRadius: "8px",
    objectFit: "cover",
    border: "2px solid #1f6feb"
  },
  removeImg: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "#f85149",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    padding: "2px"
  }
};