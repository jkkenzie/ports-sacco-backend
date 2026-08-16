import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import aiRobotHelp from '../../assets/image/chat-icon.svg';
import chatBg from '../../assets/image/chat-bg.jpg';
import { wpAbsoluteUrl } from '../utils/wpEnv';

const gradientBorder = 'linear-gradient(90deg, #22b5e0 0%, #22acb6 25%, #4ade80 50%, #f59e0b 75%, #ef4444 100%)';
const ORANGE = '#EE6E2A';

const getApiBaseUrl = () => {
  const apiPath = import.meta.env.VITE_WP_REST_PATH || '/wp-json/chat/v1';
  if (apiPath.startsWith('http://') || apiPath.startsWith('https://')) {
    return apiPath.replace(/\/$/, '');
  }
  return wpAbsoluteUrl(apiPath).replace(/\/$/, '');
};

const API_BASE_URL = getApiBaseUrl();

const suggestionBubbles = [
  'How can I help you today? please let me know any questions or problems you encounter',
  'Are you looking for information? I can help you find specific products or services',
  'Is there a particular loan you\'d like to be aware of? I can make recommendations based on your preferences',
];

export function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStatus, setChatStatus] = useState('bot'); // bot, agent, offline
  const [whatsappRedirect, setWhatsappRedirect] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (chatRef.current && !chatRef.current.contains(e.target)) {
        const button = e.target.closest('[data-floating-help-trigger]');
        if (!button) setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      createSession();
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createSession = async () => {
    const url = `${API_BASE_URL}/session`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const contentType = response.headers.get('content-type');
      const data =
        contentType && contentType.includes('application/json')
          ? await response.json()
          : {};

      if (data.session_id) {
        setSessionId(data.session_id);
        setMessages((prev) =>
          prev.length === 0
            ? [{
                id: 1,
                from: 'bot',
                text: '👋 Hello! I\'m here to help you. How can I assist you today?',
                timestamp: new Date(),
              }]
            : prev
        );
        return data.session_id;
      }

      // Log for debugging
      console.warn('Chat session failed:', response.status, url, data);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    return null;
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    let currentSessionId = sessionId;
    if (!currentSessionId) {
      currentSessionId = await createSession();
      if (!currentSessionId) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            from: 'bot',
            text: 'Unable to connect. Please check your connection and try again. If you opened this site from a different URL (e.g. localhost vs ports-sacco), open it from the same address as the site.',
            timestamp: new Date(),
          },
        ]);
        return;
      }
    }

    const userMessage = {
      id: Date.now(),
      from: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: currentSessionId,
          message: text.trim(),
        }),
      });

      const data = await response.json();

      if (data.type === 'whatsapp_redirect') {
        setWhatsappRedirect({
          intent: data.intent,
          message: data.reply,
        });
        setIsTyping(false);
        return;
      }

      if (data.type === 'agent_transfer') {
        setChatStatus('agent');
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          from: 'bot',
          text: data.reply,
          timestamp: new Date(),
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          from: 'bot',
          text: data.reply,
          timestamp: new Date(),
        }]);
      }

      setIsTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'bot',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (text) => {
    sendMessage(text);
  };

  const getWhatsAppLink = () => {
    // Get from environment or use default
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '';
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanNumber}`;
    }
    return '#';
  };

  // Convert plain text with URLs and (link) patterns to clickable links
  const formatMessageWithLinks = (text) => {
    if (!text) return text;
    
    // Escape HTML first to prevent XSS
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Pattern 1: URLs (http://, https://) - make clickable
    escaped = escaped.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2271b1; text-decoration: underline; word-break: break-all;">${url}</a>`;
      }
    );
    
    // Pattern 2: (tel:...) patterns - make phone number clickable and remove (tel:) part
    // Example: "Phone: +1234567890 (tel:+1234567890)" -> "Phone: <a href="tel:+1234567890">+1234567890</a>"
    escaped = escaped.replace(
      /Phone:\s*([^\s(]+)\s*\(tel:([^)]+)\)/g,
      (match, displayPhone, phoneLink) => {
        return `Phone: <a href="tel:${phoneLink}" style="color: #2271b1; text-decoration: underline;">${displayPhone}</a>`;
      }
    );
    
    // Pattern 3: (mailto:...) patterns - make email clickable and remove (mailto:) part
    // Example: "Email: test@example.com (mailto:test@example.com)" -> "Email: <a href="mailto:test@example.com">test@example.com</a>"
    escaped = escaped.replace(
      /Email:\s*([^\s(]+)\s*\(mailto:([^)]+)\)/g,
      (match, displayEmail, emailLink) => {
        return `Email: <a href="mailto:${emailLink}" style="color: #2271b1; text-decoration: underline;">${displayEmail}</a>`;
      }
    );
    
    return escaped;
  };

  return (
    <>
      <style>{`
        .chat-widget-container {
          position: fixed;
          z-index: 9999;
        }
        @media (min-width: 769px) {
          .chat-widget-container {
            right: 24px;
            bottom: 15%;
            top: auto;
            transform: none;
            max-width: calc(100vw - 48px);
            /* Ensure container stays within viewport */
            max-height: 100vh;
            overflow: visible;
          }
          .chat-widget-desktop {
            position: absolute;
            right: 0;
            bottom: 100%;
            margin-bottom: 8px;
            width: 320px;
            border-radius: 16px;
            /* Constrain to viewport: ensure it fits above button */
            max-height: min(70vh, calc(85vh - 100px));
            min-height: 380px;
            /* If content is taller, allow scrolling */
            overflow-y: auto;
          }
        }
        @media (max-width: 768px) {
          .chat-widget-container {
            right: 16px;
            bottom: 20px;
            top: auto;
            transform: none;
            max-width: calc(100vw - 32px);
          }
          .chat-widget-mobile {
            position: fixed !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            top: auto !important;
            width: 100vw !important;
            max-width: 100vw !important;
            border-radius: 24px 24px 0 0 !important;
            max-height: min(90vh, calc(100vh - 80px)) !important;
            margin: 0 !important;
            z-index: 9999 !important;
          }
        }
      `}</style>
      {/* Desktop: Fixed right center, mobile: Fixed bottom */}
      <div 
        className="chat-widget-container"
        ref={chatRef}
      >
        {/* Chat box - Desktop: above button, Mobile: full screen overlay */}
        {isOpen && (
          <>
            {/* Mobile overlay backdrop */}
            {isMobile && (
              <div
                className="fixed inset-0 bg-black/50 z-[9998]"
                onClick={() => setIsOpen(false)}
                style={{ top: 0, left: 0, right: 0, bottom: 0 }}
              />
            )}
            <div
              className={isMobile ? "chat-widget-mobile shadow-xl p-[2px]" : "chat-widget-desktop shadow-xl p-[2px]"}
              style={{ 
                background: gradientBorder,
                zIndex: isMobile ? 9999 : 50,
                borderRadius: isMobile ? '24px 24px 0 0' : '16px',
              }}
            >
              <div
                className="w-full h-full flex flex-col overflow-hidden"
                style={{
                  backgroundImage: `url(${chatBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'top center',
                  minHeight: isMobile ? '400px' : '376px',
                  maxHeight: isMobile ? 'calc(90vh - 4px)' : 'calc(70vh - 4px)',
                  borderRadius: isMobile ? '22px 22px 0 0' : '14px',
                }}
              >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 flex-shrink-0">
              <h2 className="flex-1 font-bold text-gray-900 text-sm truncate text-left">
                Chat for quick help
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: ORANGE }}
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                {suggestionBubbles.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSuggestionClick(text)}
                    className="w-full text-left px-4 py-3 rounded-xl border text-sm font-normal transition-colors hover:bg-white/60"
                    style={{
                      backgroundColor: '#f0f8ff',
                      borderColor: '#e0e0e0',
                      color: '#333333',
                    }}
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                    msg.from === 'user'
                      ? 'bg-white/90 text-gray-900'
                      : 'bg-white/70 text-gray-800'
                  }`}
                >
                  <div 
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: formatMessageWithLinks(msg.text) }}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/70 px-4 py-2 rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {whatsappRedirect && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="text-sm text-yellow-800 mb-2">{whatsappRedirect.message}</div>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                >
                  Continue on WhatsApp →
                </a>
              </div>
            )}

            {chatStatus === 'agent' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
                ✓ Connected to agent
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input + Send */}
          <div className="flex-shrink-0 flex items-center gap-2 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input.trim()) {
                  sendMessage(input);
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              style={{ backgroundColor: '#424242' }}
              disabled={isTyping}
              aria-label="Type your message"
            />
            <button
              type="button"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: ORANGE }}
              aria-label="Send"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
              </div>
            </div>
          </>
        )}

        {/* Trigger button */}
        <button
          type="button"
          data-floating-help-trigger
          onClick={() => setIsOpen(!isOpen)}
          className="flex rounded-full shadow-md hover:shadow-lg transition-shadow no-underline border-0 cursor-pointer relative z-10"
          style={{
            padding: '2px',
            background: gradientBorder,
            position: 'relative',
          }}
          aria-label="AI Help"
          aria-expanded={isOpen}
        >
          <span className="flex flex-col min-[480px]:flex-row items-center gap-2 px-4 py-2 rounded-full bg-white">
            <img src={aiRobotHelp} alt="" className="w-8 h-7 flex-shrink-0" aria-hidden />
            <span className="text-xs font-normal text-gray-600 min-[480px]:hidden">help?</span>
            <span className="hidden min-[480px]:flex flex-col">
              <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">We'are Online!</span>
              <span className="text-xs font-normal text-gray-600 whitespace-nowrap">How may I help you today?</span>
            </span>
          </span>
        </button>
      </div>
    </>
  );
}
