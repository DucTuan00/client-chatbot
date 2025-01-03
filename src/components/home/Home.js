import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'jquery/dist/jquery.min.js';
import $ from 'jquery';
import remarkGfm from 'remark-gfm';

import style from './markdown-styles.module.css';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { xonokai } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { resolvePath } from 'react-router-dom';

function Home() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [message, setMessage] = useState('');

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filesId, setFilesId] = useState([])
  const msgCardBodyRef = useRef(null);
  const fileInputRef = useRef(null);

  // Function to copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Code copied to clipboard!");
    });
  };

  // Function to fetch initial sessions
  const fetchSessions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:5000/api/sessions?userId=${userId}`);
      setSessions(response.data);
      if (response.data.length > 0) setCurrentSessionId(response.data[0].sessionId);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const sendFile = async () => {
    if (!Array.isArray(selectedFiles) || selectedFiles.length === 0) {
      const response = await axios.get(`http://localhost:5000/api/sessions/${currentSessionId}`)
      return response.data.fileIds;
    };

    const ids = await Promise.all(selectedFiles.map(async (file) => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('sessionId', currentSessionId); // Add currentSessionId to the form data

        const response = await axios.post('http://localhost:5000/api/files/', formData);
        setChatHistory([...chatHistory, { role: 'user', content: response.data.uploadedFileData.filename.substring(37) }]);

        return response.data.fileIds; // Return the file ID
      } catch (err) {
        console.error('Error sending file:', err);
        return null; // In case of error, return null
      }
    }));

    // Flatten and filter out nulls
    const filteredIds = ids.filter(id => id !== null); // Filter out nulls
    const longestIdsArray = filteredIds.reduce((prev, current) => {
      return (current.length > prev.length) ? current : prev; // Choose the longest array
    }, []);

    setFilesId(longestIdsArray); // Assign the longest array
    setSelectedFiles([]);
    return longestIdsArray; // Return the longest array
  };

  const handleSend = async () => {
    const ids = await sendFile();
    // const flatIds = ids.flat(); // Flatten the array to a single-level array
    await sendMessage(ids);
  }




  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files); // Store multiple files
    }
  };

  // Delete session function
  const deleteSession = async (sessionId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/sessions/${sessionId}`);
      if (response.status === 204) {
        // Remove the deleted session from the state
        setSessions(prevSessions => prevSessions.filter(session => session.sessionId !== sessionId));
      }
    } catch (error) {
      console.error('Failed to delete session:', error.response ? error.response.data : error.message);
    }
  };


  // Cuộn đoạn chat xuống cuối khi bấm vào session
  useEffect(() => {
    if (msgCardBodyRef.current) {
      msgCardBodyRef.current.scrollTop = msgCardBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  useEffect(() => {
    $('#action_menu_btn').click(function () {
      $('.action_menu').toggle();
    });
    fetchSessions();
  }, []);

  useEffect(() => {
    // Fetch chat messages and files for the selected session
    if (currentSessionId) {
      axios.get(`http://localhost:5000/api/sessions/${currentSessionId}`)
        .then(response => {
          setChatHistory(response.data.messages);
          setFilesId(response.data.fileIds); // Assuming response.data.filesId contains the files array
        })
        .catch(err => console.error('Error loading session:', err));
    }
  }, [currentSessionId]);


  const createNewSession = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:5000/api/sessions?userId=${userId}`);
      setSessions([...sessions, response.data]);
      setCurrentSessionId(response.data.sessionId);
    } catch (err) {
      console.error('Error creating new session:', err);
    }
  };

  const sendMessage = async (fileIds) => {


    if (!message.trim()) return;
    setChatHistory([...chatHistory, { role: 'user', content: message }]);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentSessionId,
          userMessage: message,
          fileIds: fileIds,
          fileNames: chatHistory.filter(msg => msg.role === 'filename').map(msg => msg.content),
        }),
        responseType: 'stream',
      });

      let lastAssistantMessage = { role: 'assistant', content: response.data };

      setChatHistory((prevHistory) => [...prevHistory, lastAssistantMessage]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let chatData = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chatData += decoder.decode(value, { stream: true });
        lastAssistantMessage.content = chatData;
        setChatHistory((prevHistory) => [
          ...prevHistory.slice(0, -1),
          lastAssistantMessage,
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="maincontainer mt-4">
      <div className="container-fluid h-50">
        <div className="row justify-content-center h-100">
          <div className="col-md-4 col-xl-3 chat">
            <div className="card mb-sm-3 mb-md-0 contacts_card">
              <div className="card-header">
                <button onClick={createNewSession} className="btn btn-outline-light btn-sm"><i className="fas fa-solid fa-plus"></i> Đoạn chat mới</button>
                <div className="input-group">
                  <input type="text" placeholder="Tìm kiếm..." className="form-control search" />
                  <div className="input-group-prepend">
                    <span className="input-group-text search_btn"><i className="fas fa-search"></i></span>
                  </div>
                </div>
              </div>
              <div className="card-body contacts_body"
                ref={msgCardBodyRef}
                style={{ maxHeight: '530px', overflowY: 'auto' }}
              >
                <ul className="contacts">
                  {sessions.map((session, index) => (
                    <li
                      key={index}
                      className={session.sessionId === currentSessionId ? "active" : ""}
                      onClick={() => setCurrentSessionId(session.sessionId)}
                    >
                      <div className="d-flex justify-content-between bd-highlight">
                        <div className="user_info">
                          <span>{session.sessionId}</span>
                        </div>
                        <div className="delete-session" onClick={() => { deleteSession(session.sessionId); }}>
                          <span>Xóa</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-8 col-xl-6 chat">
            <div className="card">
              <div className="card-header msg_head">
                <div className="user_info">
                  <span>Chat with Session {currentSessionId}</span>
                </div>
              </div>
              <div className="card-body msg_card_body"
                ref={msgCardBodyRef}
                style={{ maxHeight: '500px', overflowY: 'auto' }}
              >
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`d-flex justify-content-${msg.role === "user" ? "end" : "start"} mb-4`}>
                    <div className={`msg_cotainer${msg.role === "user" ? "_send" : ""}`}>
                      <ReactMarkdown children={msg.content}
                        remarkPlugins={[remarkGfm]}
                        className={style.reactMarkDown}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <div class="code_block" style={{ position: 'relative' }}>
                                <SyntaxHighlighter
                                  style={xonokai}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                                <button
                                  onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                  style={{
                                    position: 'absolute',
                                    top: '5px',
                                    right: '5px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Copy
                                </button>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }} />
                      <span className={`msg_time${msg.role === "user" ? "_send" : ""}`}>{msg.time}</span>
                    </div>
                  </div>
                ))}

              </div>
              {selectedFiles.length > 0 && (
                <div className="selected-file-container">
                  {selectedFiles.map((file, index) => (
                    <span key={index} className="selected-file-name">
                      {file.name}
                    </span>
                  ))}
                  <span className="remove-file-btn" onClick={() => setSelectedFiles([])}>
                    Xóa
                  </span>
                </div>
              )}

              <div className="card-footer">
                <div className="input-group">
                  <div className="input-group-append">
                    <span className="input-group-text attach_btn">
                      <button
                        className="btn btn-default"
                        style={{ border: 'none', padding: '0' }}
                        onClick={() => fileInputRef.current.click()}

                      >
                        <i className="fas fa-paperclip"></i>
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        multiple // Allow multiple files
                        accept="*/*" // Accept all file types
                      />

                    </span>
                  </div>
                  <textarea
                    className="form-control type_msg"
                    placeholder="Nhập tin nhắn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <div className="input-group-append">
                    <span className="input-group-text send_btn" onClick={handleSend}>
                      <i className="fas fa-location-arrow"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
