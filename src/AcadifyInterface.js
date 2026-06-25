import React, { useState, useRef, useEffect } from "react";
import "./AcadifyInterface.css";
import {
  FaPlus, FaList, FaArrowUp, FaMoon, FaSun, FaTimes, FaTrash, FaEdit,
  FaMicrophone, FaBook, FaBrain, FaChartBar, FaCalendarAlt, FaStickyNote,
  FaGraduationCap, FaFilePdf, FaFileImage, FaFileWord, FaDownload,
  FaRegLightbulb, FaRegClock, FaCheckCircle, FaRegStar, FaStar,
  FaRegBookmark, FaBookmark, FaShare, FaPrint, FaRegSmile ,FaTrashAlt 
} from "react-icons/fa";

function AcadifyInterface() {
  const chatEndRef = useRef(null);
  const [message, setMessage] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showSubjects, setShowSubjects] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [typing, setTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [renamingId, setRenamingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [studyMode, setStudyMode] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [studyTimer, setStudyTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [bookmarkedMessages, setBookmarkedMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [lastStudyDate, setLastStudyDate] = useState(null);
  const [desktopSidebar, setDesktopSidebar] = useState(true);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarTab, setRightSidebarTab] = useState("bookmarks");
  
  const subjects = [
    { name: "Operating Systems", icon: "🖥️", color: "#3b82f6" },
    { name: "DBMS", icon: "🗄️", color: "#10b981" },
    { name: "Computer Networks", icon: "🌐", color: "#f59e0b" },
    { name: "AI", icon: "🤖", color: "#8b5cf6" },
    { name: "Data Structures", icon: "📊", color: "#ec4899" },
    { name: "Algorithms", icon: "⚡", color: "#ef4444" }
  ];

  const currentChat = allChats.find(c => c.id === currentChatId);
  const currentMessages = currentChat ? currentChat.messages : [];
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to close sidebar (called by X button)
  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setMobileSidebarOpen(false); // Also close mobile menu
  };

  // Function to open sidebar (called by menu icon)
  // Function to open sidebar (called by menu icon)
  const openSidebar = () => {
    // Always set the main sidebar to true so it shows on Desktop
    setIsSidebarOpen(true);

    // Also set mobile state to true in case user is on a phone
    if (window.innerWidth <= 768) {
      setMobileSidebarOpen(true);
    }
  };

  const toggleDesktopSidebar = () => {
    setDesktopSidebar(!desktopSidebar);
    setSidebarOpen(!desktopSidebar);
  };
  // Voice recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support voice recognition. Please try Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, typing]);

  useEffect(() => {
    // Force a reflow to ensure proper centering
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 50);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const storedChats = JSON.parse(localStorage.getItem("acadifyChats"));
    if (storedChats) setAllChats(storedChats);

    const storedBookmarks = JSON.parse(localStorage.getItem("acadifyBookmarks"));
    if (storedBookmarks) setBookmarkedMessages(storedBookmarks);

    const savedNotes = JSON.parse(localStorage.getItem("acadifyNotes"));
    if(savedNotes) setNotes(savedNotes);

  }, []);

  useEffect(() => {
    localStorage.setItem("acadifyChats", JSON.stringify(allChats));
    localStorage.setItem("acadifyBookmarks", JSON.stringify(bookmarkedMessages));
    localStorage.setItem("acadifyNotes", JSON.stringify(notes));

  }, [allChats, bookmarkedMessages, notes, lastStudyDate]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessage("");
    setSelectedFiles([]);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (id) => {
    const filtered = allChats.filter(chat => chat.id !== id);
    setAllChats(filtered);
    if (id === currentChatId) setCurrentChatId(null);
  };

  const handleRenameChat = (id) => {
    setAllChats(prev => prev.map(chat => chat.id === id ? { ...chat, title: newTitle } : chat));
    setRenamingId(null);
    setNewTitle("");
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSend = async () => {
    if (message.trim() === "") return;

    const userMessage = {
      type: "user",
      text: message,
      subject: selectedSubject?.name || "General",
      files: [...selectedFiles],
      timestamp: new Date().toISOString(),
    };

    let chatId = currentChatId;

    if (!chatId) {
      const newChat = {
        id: Date.now().toString(),
        title: message.substring(0, 30) + (message.length > 30 ? "..." : ""),
        messages: [userMessage],
        createdAt: new Date().toISOString(),
        subject: selectedSubject?.name || "General",
      };
      setAllChats(prev => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      chatId = newChat.id;
    } else {
      setAllChats(prev => prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      ));
    }

    setMessage("");
    setTyping(true);

    try {
      const response = await fetch("https://acadgpt-backend.onrender.com/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userMessage.text,
          subject: selectedSubject?.name
        }),
      });

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      const data = await response.json();

      // THIS IS THE IMPORTANT PART - Create message directly from response
      const botMessage = {
        type: "bot",
        text: data.answer || "I'm sorry...",
        timestamp: new Date().toISOString(),
        subject: selectedSubject?.name,
        id: Date.now().toString() + Math.random(),
        // Directly use the data fields - no extra logic needed
        fileLink: data.downloadUrl || null,
        fileName: data.fileName || null
      };

      setAllChats(prev => prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, botMessage] }
          : chat
      ));

    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage = {
        type: "bot",
        text: "❌ Network error. Please try again.",
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setAllChats(prev => prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, errorMessage] }
          : chat
      ));
    } finally {
      setTyping(false);
    }
  };

  const generateFlashcards = (text) => {
    // Simple flashcard generation from key sentences
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const newFlashcards = sentences.slice(0, 3).map(s => ({
      front: s.trim().substring(0, 50) + "...",
      back: s.trim(),
    }));
    setFlashcards(prev => [...prev, ...newFlashcards]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append("book", file));

    try {
      const response = await fetch("https://acadgpt-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Show success message in chat
      const successMessage = {
        type: "bot",
        text: `✅ Successfully uploaded ${files.length} file(s). I've processed them and they're ready for your questions!`,
        timestamp: new Date().toISOString(),
      };

      if (currentChatId) {
        setAllChats(prev => prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, successMessage] }
            : chat
        ));
      }

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }

    const fileData = files.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    setSelectedFiles(prev => [...prev, ...fileData]);
  };

const toggleBookmark = (message) => {
  if (bookmarkedMessages.some(bm => bm.id === message.id)) {
    setBookmarkedMessages(prev =>
      prev.filter(bm => bm.id !== message.id)
    );
  } else {
    setBookmarkedMessages(prev => [
      ...prev,
      { ...message, chatId: currentChatId }
    ]);
  }
};

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = () => {
    // Generate quiz from recent messages
    const recentMessages = currentMessages.filter(m => m.type === "bot" && !m.isError);
    if (recentMessages.length === 0) return;

    const quiz = {
      questions: recentMessages.slice(-3).map((msg, i) => ({
        id: i,
        question: `Based on our discussion: ${msg.text.substring(0, 100)}...`,
        options: [
          "Option A (Sample)",
          "Option B (Sample)",
          "Option C (Sample)",
          "Option D (Sample)"
        ],
        correct: 0,
      })),
    };
    setCurrentQuiz(quiz);
    setQuizMode(true);
    setQuizAnswers({});
    setQuizResults(null);
  };

  const submitQuiz = () => {
    const score = Object.keys(quizAnswers).length;
    setQuizResults({ score, total: currentQuiz.questions.length });
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf />;
    if (fileType.includes('image')) return <FaFileImage />;
    if (fileType.includes('word')) return <FaFileWord />;
    return <FaFilePdf />;
  };

  return (
    // Update the main container div to include 'sidebar-closed'
    <div className={`container ${darkMode ? "dark" : ""} ${!isSidebarOpen ? 'sidebar-closed' : ''} ${studyMode ? 'study-mode' : ''}`}>
      {/* Sidebar - conditionally rendered or hidden with CSS */}
      <div className={`sidebar ${mobileSidebarOpen ? "open" : ""} ${!isSidebarOpen ? 'hidden' : ''} ${darkMode ? "dark" : ""}`}>
        <div className="sidebar-header">
          <h3>
            <FaBook className="sidebar-icon" /> My Library
          </h3>
          <div
            className="close-icon"
            onClick={closeSidebar}
          >
            ✕
          </div>
        </div>

        <button className="new-chat-btn" onClick={handleNewChat}>
          <FaPlus /> New Study Session
        </button>


        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="history-list">
          {allChats
            .filter(chat => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(chat => (
              <div key={chat.id} className={`history-item ${chat.id === currentChatId ? "active" : ""}`}>
                {renamingId === chat.id ? (
                  <div className="rename-container">
                    <input
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="rename-input"
                      autoFocus
                    />
                    <button className="save-btn" onClick={() => handleRenameChat(chat.id)}>✓</button>
                  </div>
                ) : (
                  <>
                    <div className="chat-info" onClick={() => { setCurrentChatId(chat.id); setSidebarOpen(false); }}>
                      <span className="chat-subject-icon">{subjects.find(s => s.name === chat.subject)?.icon || '📚'}</span>
                      <span className="chat-title">{chat.title}</span>
                    </div>
                    <div className="history-actions">
                      <FaEdit onClick={() => { setRenamingId(chat.id); setNewTitle(chat.title); }} />
                      <FaTrash onClick={() => handleDeleteChat(chat.id)} />
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
          <div className="nav-left">
            {!isSidebarOpen && (
              <div className="menu-icon" onClick={openSidebar}>☰</div>
            )}
            <h1 className="logo">
              <FaGraduationCap className="logo-icon" />
              Acad<span className="highlight">GPT</span>
              <span className="dot">.</span>
            </h1>
          </div>
          <div className="nav-right">
            <button className={`nav-btn ${studyMode ? 'active' : ''}`} onClick={() => setStudyMode(!studyMode)} title="Study Mode">
              <FaBrain />
            </button>

            <button
            className="nav-btn"
            onClick={() => {
              setRightSidebarOpen(true);
              setRightSidebarTab("bookmarks");
            }}
          >
            <FaRegBookmark />
          </button>
          <button className="nav-btn" onClick={() => { setRightSidebarOpen(true);setRightSidebarTab("notes"); }}> 📝 </button>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>
        </div>

        {/* Study Tools Panel */}
        {/* {(showBookmarks || showFlashcards || showGoals || quizMode) && (
          <div className="study-panel">

          </div>
        )} */}
        <div className="content-wrapper">
        {/* Chat Area */}
        <div className="chat-area">
          <div className="chat-content">
            {currentMessages.length === 0 && (
              <div className="empty-state">
                <FaGraduationCap className="empty-icon" />
                <h2>Ready to learn something new?</h2>
                <p>Upload a PDF, ask a question, or start a study session.</p>
                <div className="quick-prompts">
                  <button onClick={() => setMessage("Can you explain Operating Systems concepts?")}>
                    📚 OS Concepts
                  </button>
                  <button onClick={() => setMessage("Help me understand DBMS normalization")}>
                    🗄️ DBMS Help
                  </button>
                  <button onClick={() => setMessage("Help me understand CN topics")}>
                    🎴 Computer Science
                  </button>
                </div>
              </div>
            )}

            {currentMessages.map((msg, index) => {
              if (msg.type === "bot") {
                const downloadRegex = /\[DOWNLOAD:(.*?)\]/;
                const match = msg.text.match(downloadRegex);
                const displayChatText = msg.text.replace(downloadRegex, "").trim();
                const fileName = match ? match[1] : null;
                const isBookmarked = bookmarkedMessages.some(bm => bm.id === msg.id);

                return (
                  <div key={index} className="chat-row bot">
                    <div className="chat-bubble">
                      <div className="message-header">
                        <span className="message-subject">
                          {subjects.find(s => s.name === msg.subject)?.icon || '🤖'} AcadGPT
                        </span>
                        <div className="message-actions">
                          <button
                            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
                            onClick={() => toggleBookmark(msg)}
                          >
                            {isBookmarked ? <FaStar /> : <FaRegStar />}
                          </button>
                        </div>
                      </div>
                      <div className="message-text">{displayChatText}</div>

                      {msg.fileLink && (
                        <div className="file-attachment-card">
                          <div className="file-details">
                            <span className="file-name-label">📄 {msg.fileName}</span>
                            <a
                              href={`https://acadgpt-backend.onrender.com${msg.fileLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="download-now-btn"
                            >
                              <FaDownload /> Download
                            </a>
                          </div>
                        </div>
                      )}

                      <div className="message-timestamp">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div key={index} className="chat-row user">
                  <div className="chat-bubble">
                    <div className="message-header">
                      <span className="message-subject">You</span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div className="chat-row bot">
                <div className="chat-bubble typing-bubble">
                  <span className="typing-text">AcadGPT is thinking</span>
                  <span className="dot-anim">.</span>
                  <span className="dot-anim">.</span>
                  <span className="dot-anim">.</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef}></div>
          </div>
        </div>

        {rightSidebarOpen && (
          <div className="right-sidebar">

            <div className="right-sidebar-header">
              <h3>
                {rightSidebarTab === "bookmarks"
                  ? "Bookmarks"
                  : "Notes"}
              </h3>

              <button
                className="sidebar-close-btn"
                onClick={() => setRightSidebarOpen(false)}
              >
                 <FaTimes />
              </button>
            </div>
          {rightSidebarTab === "bookmarks" && (
            <div className="bookmarks-list">

              {bookmarkedMessages.length === 0 ? (
                      <div className="empty-bookmarks">
                        <p>No bookmarks yet</p>
                      </div>
                    ) : (
                      bookmarkedMessages.map((bm) => (
                        <div key={bm.id} className="bookmark-card">

                          <div className="bookmark-card-header">
                            <span className="bookmark-subject">
                              {bm.subject || "AcadGPT"}
                            </span>

                            <button
                              className="bookmark-star active"
                              onClick={() => toggleBookmark(bm)}
                              title="Remove Bookmark"
                            >
                              <FaStar />
                            </button>
                          </div>

                          <div className="bookmark-content">
                            {bm.text}
                          </div>

                          <div className="bookmark-footer">
                            {new Date(bm.timestamp).toLocaleString()}
                          </div>

                        </div>
                      ))
                    )}

            </div>
          )}
                 {rightSidebarTab === "notes" && (
                    <div className="notes-section">

                      <button
                        className="new-note-btn"
                        onClick={() => {
                          setEditingNote(null);
                          setNoteTitle("");
                          setNoteContent("");
                          setShowNoteEditor(true);
                        }}
                      >
                        Add Notes
                      </button>

                      <div className="notes-list">

                        {notes.map(note => (
                          <div
                            key={note.id}
                            className="note-card"
                              onClick={() => {
                              setEditingNote(note);
                              setNoteTitle(note.title);
                              setNoteContent(note.content);
                              setShowNoteEditor(true);
                      }}>

          <div className="note-card-header">

            <h4>{note.title}</h4>

            <button
              className="delete-note-btn"
              onClick={() =>
                setNotes(prev =>
                  prev.filter(n => n.id !== note.id)
                )
              }
            >
             <FaTrashAlt />
            </button>

          </div>

          <p>
            {note.content.substring(0, 120)}
          </p>

        </div>
      ))}

    </div>
          {showNoteEditor && (
  <div className="note-editor-modal">

    <input
      type="text"
      placeholder="Note Title"
      value={noteTitle}
      onChange={(e) => setNoteTitle(e.target.value)}
    />

    <textarea
      placeholder="Write your notes..."
      value={noteContent}
      onChange={(e) => setNoteContent(e.target.value)}
    />

    <button
      className="note-save-btn"
      onClick={() => {
        const newNote = {
          id: editingNote?.id || Date.now(),
          title: noteTitle,
          content: noteContent,
          createdAt: new Date().toISOString()
        };

        if (editingNote) {
          setNotes(prev =>
            prev.map(n =>
              n.id === editingNote.id ? newNote : n
            )
          );
        } else {
          setNotes(prev => [...prev, newNote]);
        }

        setShowNoteEditor(false);
      }}
    >
      Save 
    </button>

  </div>
)}


  </div>
)}
        

          </div>
        )}
        </div>

        {/* Floating Input Area */}
        <div className="input-container">
          {/* Study Timer */}
          {studyMode && (
            <div className="study-timer">
              <FaRegClock />
              <span>{formatTime(studyTimer)}</span>
              <button onClick={() => setTimerActive(!timerActive)}>
                {timerActive ? 'Pause' : 'Start'}
              </button>
              <button onClick={() => { setStudyTimer(0); setTimerActive(false); }}>
                Reset
              </button>
            </div>
          )}

          {/* Active Attachments */}
          {selectedFiles.length > 0 && (
            <div className="active-attachments">
              {selectedFiles.map((file, index) => (
                <div key={index} className="attachment-chip">
                  <span className="file-icon">{getFileIcon(file.type)}</span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024).toFixed(0)} KB)</span>
                  <button className="remove-file" onClick={() => removeFile(index)}>×</button>
                </div>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="input-wrapper">
            {/* Subject Modal */}
            {showSubjects && (
              <div className="subject-modal">
                {subjects.map((sub, index) => (
                  <div
                    key={index}
                    className="subject-item"
                    onClick={() => {
                      if (selectedSubject?.name === sub.name) {
                        setSelectedSubject(null);
                      } else {
                        setSelectedSubject(sub);
                      }
                      setShowSubjects(false);
                    }}
                  >
                    <span className="subject-icon">{sub.icon}</span>
                    <span className="subject-name">{sub.name}</span>
                  </div>
                ))}
              </div>
            )}

            <button className="action-btn" onClick={() => fileInputRef.current.click()} title="Upload PDF">
              <FaPlus />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,image/*"
              multiple
            />

            <button
              className={`action-btn subject-btn ${selectedSubject ? 'active' : ''}`}
              onClick={() => setShowSubjects(!showSubjects)}
              title="Select Subject"
              style={selectedSubject ? { backgroundColor: selectedSubject.color + '20', color: selectedSubject.color } : {}}
            >
              {selectedSubject ? (
                <>{selectedSubject.icon} {selectedSubject.name}</>
              ) : (
                <><FaList />   Subject </>
              )}
            </button>

            <textarea
              ref={textareaRef}
              className="chat-input"
              placeholder={selectedFiles.length > 0 ? "Ask about your documents..." : "Ask anything..."}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={handleKeyDown}
              rows="1"
            />

            <button
              type="button"
              className={`voice-btn ${isListening ? 'listening' : ''}`}
              onClick={startListening}
              title="Voice input"
            >
              <FaMicrophone style={{ color: isListening ? '#ff4b4b' : 'inherit' }} />
            </button>

            <button
              className={`send-btn ${message.trim() ? 'active' : ''}`}
              onClick={handleSend}
              disabled={!message.trim()}
            >
              <FaArrowUp />
            </button>
          </div>

          <div className="input-footer">
            <span>✨ AcadGPT can make mistakes. Check important info.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AcadifyInterface;