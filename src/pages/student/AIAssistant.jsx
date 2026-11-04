import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: `Hello ${user.name.split(' ')[0]}! I'm your ClassGap AI Assistant. I can help you understand difficult topics, generate practice questions, or summarize your notes. What are you studying today?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiText = "That's a great question! In a production environment, I would connect to an LLM API to give you a detailed answer. For this demo, try asking me about 'Linked Lists', 'SQL Joins', or 'Process Scheduling'.";
      
      const lower = userMsg.text.toLowerCase();
      if (lower.includes('linked list')) {
        aiText = "A Linked List is a linear data structure where elements are not stored at contiguous memory locations. \n\n**Key points:**\n- Each node contains a data field and a reference (link) to the next node.\n- Insertion and deletion are O(1) if you have the pointer.\n- Accessing an element is O(n) because you must traverse from the head.\n\nWould you like me to generate a practice question about Linked Lists?";
      } else if (lower.includes('sql') || lower.includes('join')) {
        aiText = "SQL Joins are used to combine rows from two or more tables based on a related column.\n\n**Common Types:**\n- **INNER JOIN:** Returns records that have matching values in both tables.\n- **LEFT JOIN:** Returns all records from the left table, and the matched records from the right.\n- **RIGHT JOIN:** The reverse of LEFT JOIN.\n- **FULL JOIN:** Returns all records when there is a match in either left or right table.\n\nDo you want a cheat sheet on this?";
      }

      setMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: aiText }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 p-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
          <Sparkles size={20} className="text-brand-100" />
        </div>
        <div>
          <h2 className="font-semibold text-lg">AI Learning Assistant</h2>
          <p className="text-xs text-brand-100">Always here to help you understand</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-navy-900 text-white' : 'bg-brand-100 text-brand-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-navy-900 text-white rounded-tr-sm' 
                : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or paste a topic..."
            className="input-field flex-1 bg-slate-50 border-transparent focus:bg-white focus:border-brand-500"
          />
          <button type="submit" disabled={!input.trim() || isTyping} className="btn-primary w-12 h-11 p-0 flex items-center justify-center shrink-0">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}