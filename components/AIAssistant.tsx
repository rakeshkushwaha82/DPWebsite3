
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'ai';
  text?: string;
  image?: string;
  isImage?: boolean;
}

interface AIAssistantProps {
  onClose: () => void;
}

const LogoSVG = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <defs>
      <linearGradient id="goldGradientAI" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c5a059" />
        <stop offset="50%" stopColor="#f7e1ad" />
        <stop offset="100%" stopColor="#b08d44" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="24" fill="#001a35"/>
    <path d="M32 30V70H44C56 70 65 61 65 50C65 39 56 30 45 30H32Z" stroke="url(#goldGradientAI)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M48 30V75M48 52C58 52 68 48 68 38C68 28 58 24 48 24" stroke="url(#goldGradientAI)" strokeWidth="3.5" strokeLinecap="round" transform="translate(4, 4)" />
    <rect x="47.5" y="47.5" width="5" height="5" transform="rotate(45 50 50)" fill="#f7e1ad" />
  </svg>
);

const STORAGE_KEY = 'dp_interior_chat_history';

const MODELS = [
  { id: 'gemini-3-flash-preview', name: 'Standard (Flash 3)', desc: 'Balanced speed & intelligence' },
  { id: 'gemini-3-pro-preview', name: 'Advanced (Pro 3)', desc: 'Complex reasoning & precision' },
  { id: 'gemini-flash-lite-latest', name: 'Fast (Flash Lite)', desc: 'Lowest latency for quick tips' }
];

const LOADING_MESSAGES = [
  "Reviewing floor plan requirements...",
  "Calculating premium material estimates...",
  "Selecting architectural color palettes...",
  "Curating bespoke furniture options...",
  "Optimizing space-saving solutions...",
  "Synthesizing visual design elements...",
  "Generating high-fidelity mood board..."
];

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load chat history", e);
    }
    return [
      { role: 'ai', text: "Welcome to DP Interior's AI Designer! I'm here to help you estimate, visualize, and create mood boards for your dream home. What space are you looking to design today?" }
    ];
  });
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let interval: number;
    if (isLoading || isGeneratingImage) {
      interval = window.setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading, isGeneratingImage]);

  const handleClearHistory = () => {
    const defaultMsg: Message[] = [{ role: 'ai', text: "History cleared. How can I help with your new project today?" }];
    setMessages(defaultMsg);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleGenerateImage = async (customPrompt?: string) => {
    const promptToUse = customPrompt || input;
    if (!promptToUse.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: `Generate a visual mood board for: ${promptToUse}` }]);
    setInput('');
    setIsGeneratingImage(true);
    setLoadingMessageIndex(5);

    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A professional high-end interior design mood board for ${promptToUse}. Include luxury materials, color swatches, furniture inspirations, and a cohesive architectural aesthetic. High resolution, cinematic lighting, ultra-modern style.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      const base64EncodeString = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64EncodeString}`;

      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Here is a conceptual mood board for your vision. This includes a curated selection of textures and palettes aligned with your style preferences.",
        image: imageUrl,
        isImage: true 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "I encountered an error while visualizing your space. My creative engine might be busy—please try again or describe your ideas in text!" }]);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    if (userMsg.toLowerCase().includes('mood board') || userMsg.toLowerCase().includes('generate image') || userMsg.toLowerCase().includes('visualize')) {
      handleGenerateImage(userMsg);
      return;
    }

    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);
    setLoadingMessageIndex(0);

    try {
      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: `Context: You are the DP Interior AI Consultant (inspired by premium brands like HomeLane). 
        Rules: 
        1. Be professional, helpful, and luxury-oriented. 
        2. Ask clarifying questions about floor plans, style preferences, and location in Delhi NCR. 
        3. Provide rough estimates if asked.
        4. Mention our "45-day delivery" and "10-year warranty".
        5. If the user wants to visualize something, mention they can click the 'Visual Mood Board' button.
        
        User says: ${userMsg}`,
      });

      const aiText = response.text || "I'm sorry, I couldn't process that. How can I help with your design journey?";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to my design brain. Please try again or book a real consultation!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-2xl h-[85vh] rounded-[3.5rem] overflow-hidden shadow-3xl flex flex-col border border-gray-100">
        <div className="bg-[#001a35] p-6 md:p-10 text-white flex justify-between items-center relative overflow-visible">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#c5a059]/15 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shadow-2xl flex-shrink-0 p-2">
               <LogoSVG />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold font-serif mb-1 leading-none">Design Hub <span className="text-[#c5a059]">AI</span></h3>
              <div className="relative">
                <button 
                  onClick={() => setShowModelSelect(!showModelSelect)}
                  className="text-[#c5a059] text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-xl transition-all border border-[#c5a059]/10"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  {MODELS.find(m => m.id === selectedModel)?.name}
                  <svg className={`w-3.5 h-3.5 transition-transform ${showModelSelect ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {showModelSelect && (
                    <motion.div 
                      initial={{ opacity: 0, y: -15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="absolute top-full left-0 mt-3 w-72 bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 p-3 z-[110]"
                    >
                      {MODELS.map(model => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelSelect(false);
                          }}
                          className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col gap-1.5 ${
                            selectedModel === model.id ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <span className={`text-[11px] font-bold uppercase tracking-[0.2em] ${selectedModel === model.id ? 'text-[#c5a059]' : 'text-[#001a35]'}`}>
                            {model.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">{model.desc}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 relative z-10">
            <button 
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="p-4 hover:bg-white/10 rounded-full transition-all text-white/30 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              onClick={onClose}
              className="p-4 hover:bg-white/10 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-[#fdfdfd]">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={`${idx}-${msg.role}`} 
                className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[90%] p-8 rounded-[2.5rem] text-[15px] leading-relaxed shadow-sm border ${
                  msg.role === 'ai' 
                  ? 'bg-white text-gray-800 rounded-tl-none border-gray-100' 
                  : 'bg-[#001a35] text-white rounded-tr-none border-[#001a35] shadow-xl'
                }`}>
                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-md p-1">
                          <LogoSVG />
                       </div>
                       <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.3em]">Signature Intelligence</span>
                    </div>
                  )}
                  {msg.text && <p className="mb-5">{msg.text}</p>}
                  {msg.image && (
                    <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white mb-2">
                      <img src={msg.image} alt="AI Generated Interior" className="w-full h-auto" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {(isLoading || isGeneratingImage) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex justify-start"
              >
                <div className="bg-white p-8 rounded-[2.5rem] rounded-tl-none border border-gray-100 shadow-xl flex flex-col gap-6 max-w-[85%]">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden shadow-sm p-2">
                        <LogoSVG />
                        <svg className="absolute inset-0 w-full h-full text-[#c5a059] animate-spin p-2.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-10" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 bg-green-500 border-4 border-white rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#c5a059] uppercase tracking-[0.4em] mb-1">
                        {isGeneratingImage ? "Architectural Visionary" : "Design Logic Engine"}
                      </span>
                      <motion.span 
                        key={loadingMessageIndex}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm text-gray-500 font-medium"
                      >
                        {LOADING_MESSAGES[loadingMessageIndex]}
                      </motion.span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 pl-1.5">
                    <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-10 bg-white border-t border-gray-100 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col gap-6">
            <div className="flex gap-3">
              <button 
                onClick={() => handleGenerateImage()}
                disabled={isLoading || isGeneratingImage || !input.trim()}
                className="flex-1 bg-[#c5a059]/10 text-[#c5a059] py-4 rounded-2xl text-[11px] font-bold tracking-[0.3em] uppercase hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-30 flex items-center justify-center gap-3 border border-[#c5a059]/20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Visualize Space
              </button>
            </div>
            
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your design requirements here..."
                className="w-full pl-10 pr-24 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] focus:ring-4 focus:ring-[#c5a059]/20 focus:bg-white focus:outline-none transition-all text-[15px] shadow-inner font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || isGeneratingImage || !input.trim()}
                className="absolute right-4 p-4 bg-[#001a35] text-[#c5a059] rounded-2xl hover:bg-[#c5a059] hover:text-white transition-all disabled:opacity-50 group shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-between items-center px-6">
              <p className="text-[10px] text-gray-400 font-bold tracking-[0.4em] uppercase">
                Powered by Imagen & Gemini 3
              </p>
              <div className="flex gap-2.5">
                 <div className="w-2 h-2 rounded-full bg-[#c5a059]"></div>
                 <div className="w-2 h-2 rounded-full bg-[#c5a059]/40"></div>
                 <div className="w-2 h-2 rounded-full bg-[#c5a059]/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;
