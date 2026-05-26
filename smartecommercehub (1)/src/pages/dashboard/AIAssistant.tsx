import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Trash2, Copy, Image as ImageIcon, Video, Wand2, Paperclip, Loader2, Search, Globe, X, FileText, Mic, MicOff, Volume2, Square, Settings, Plus, MessageSquare, Menu, Star, Bookmark, ChevronDown, FolderOpen, Share2, Download, Link as LinkIcon, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AIToolsModals } from "../../components/tools/AIToolsModals";
import { AIOnboarding } from "../../components/tools/AIOnboarding";
import { useAuth } from "../../lib/AuthContext";
import { 
  getChats, saveChat, deleteChatFromDb,
  getNotes, saveNoteToDb, deleteNoteFromDb,
  getTasks, saveTaskToDb, deleteTaskFromDb,
  getProjects, saveProject, deleteProject
} from "../../lib/workspace";
import { downloadAsMarkdown, downloadAsTxt } from "../../lib/exportUtils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachments?: {
    type: "image" | "file";
    url?: string;
    name: string;
  }[];
  sources?: {
    uri: string;
    title: string;
  }[];
};

type ToolType = "bg-remover" | "hd-enhancer" | "3d-video" | "gallery" | null;

type FileAttachment = {
  file: File;
  previewUrl?: string;
  type: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  projectId?: string;
  userId?: string;
};

export default function AIAssistant() {
  const { user } = useAuth();
  const getDefaultWelcomeMessage = (): ChatMessage => ({
    id: "1",
    role: "assistant",
    text: "Hello! I am your AI Ecommerce Assistant. How can I help you grow your store today? You can ask me in English or Hindi.\n\n*Namaste! Main aapka AI Ecommerce Assistant hoon. Main aapki store ko grow karne mein kaise madad kar sakta hoon?*"
  });

  const [chats, setChats] = useState<ChatSession[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getChats(user.uid).then(data => setChats(data as any));
      getNotes(user.uid).then(data => setNotes(data));
      getTasks(user.uid).then(data => setTasks(data));
      getProjects(user.uid).then(data => setProjects(data));
    } else {
      try {
        const c = localStorage.getItem("smarthub_ai_chats");
        if (c) setChats(JSON.parse(c));
        const n = localStorage.getItem("smarthub_ai_notes");
        if (n) setNotes(JSON.parse(n));
        const t = localStorage.getItem("smarthub_ai_tasks");
        if (t) setTasks(JSON.parse(t));
      } catch (e) {}
    }
  }, [user]);

  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const currentChat = chats.find(c => c.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [getDefaultWelcomeMessage()];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"projects" | "history" | "prompts" | "notes" | "tasks">("history");
  const [responseMode, setResponseMode] = useState<"smart" | "fast" | "deep" | "creative" | "research">("smart");

  const [savedPrompts, setSavedPrompts] = useState<{id: string, title: string, prompt: string}[]>(() => {
    try {
      const saved = localStorage.getItem("smarthub_ai_prompts");
      if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: "1", title: "Create Business Plan", prompt: "Create a comprehensive business plan for a new ecommerce store." },
      { id: "2", title: "Analyze Market", prompt: "Analyze the current market trends and provide ecommerce insights." },
      { id: "3", title: "Product Strategy", prompt: "Develop a product launch and pricing strategy for high-ticket items." },
      { id: "4", title: "Compare Competitors", prompt: "Compare my specified product against top 3 market competitors." },
      { id: "5", title: "Rewrite Content", prompt: "Rewrite this product description to be more engaging and SEO optimized." },
      { id: "6", title: "Brainstorm Ideas", prompt: "Brainstorm creative marketing campaigns for the upcoming holiday season." }
    ];
  });

  useEffect(() => {
    localStorage.setItem("smarthub_ai_prompts", JSON.stringify(savedPrompts));
  }, [savedPrompts]);



  const saveNote = (text: string) => {
    if (!text.trim()) return;
    const note = { id: Date.now().toString(), text, createdAt: Date.now(), userId: user?.uid || 'local', projectId: currentProjectId || undefined };
    setNotes([note, ...notes]);
    if (user) saveNoteToDb(note);
    else localStorage.setItem("smarthub_ai_notes", JSON.stringify([note, ...notes]));
    setActiveTab("notes");
    if (window.innerWidth < 1024) setIsSidebarOpen(true);
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    if (user) deleteNoteFromDb(id);
    else localStorage.setItem("smarthub_ai_notes", JSON.stringify(updated));
  };

  const addTask = (text: string) => {
    if (!text.trim()) return;
    const task = { id: Date.now().toString(), text, completed: false, createdAt: Date.now(), userId: user?.uid || 'local', projectId: currentProjectId || undefined };
    setTasks([task, ...tasks]);
    if (user) saveTaskToDb(task);
    else localStorage.setItem("smarthub_ai_tasks", JSON.stringify([task, ...tasks]));
    setActiveTab("tasks");
    if (window.innerWidth < 1024) setIsSidebarOpen(true);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    if (user) saveTaskToDb(updated.find((t: any) => t.id === id));
    else localStorage.setItem("smarthub_ai_tasks", JSON.stringify(updated));
  };

  const deleteTask = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    if (user) deleteTaskFromDb(id);
    else localStorage.setItem("smarthub_ai_tasks", JSON.stringify(updated));
  };

  const handleCreateProject = () => {
    if (!user) return alert("Please sign in to create workspaces/projects.");
    const name = window.prompt("New Project Name:");
    if (!name?.trim()) return;
    const proj = {
      id: Date.now().toString(),
      userId: user.uid,
      name,
      description: "",
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setProjects([proj, ...projects]);
    saveProject(proj);
    setCurrentProjectId(proj.id);
  };

  const deleteProjectHandler = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this project?")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      deleteProject(id);
      if (currentProjectId === id) setCurrentProjectId(null);
    }
  };

  const savePrompt = (promptText: string) => {
    if (!promptText.trim()) return;
    const title = promptText.length > 25 ? promptText.substring(0, 25) + '...' : promptText;
    setSavedPrompts([{ id: Date.now().toString(), title, prompt: promptText }, ...savedPrompts]);
  };

  const deletePrompt = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
  };

  const updateCurrentChatMessages = (newMessages: ChatMessage[]) => {
    setChats(prev => {
      let updatedChats = [...prev];
      let tId = currentChatId;

      if (!tId) {
        tId = Date.now().toString();
        setCurrentChatId(tId);
        updatedChats.unshift({
          id: tId,
          title: "New Chat",
          messages: [],
          updatedAt: Date.now(),
          projectId: currentProjectId || undefined,
          userId: user?.uid || 'local'
        } as any);
      }

      const chatIndex = updatedChats.findIndex(c => c.id === tId);
      if (chatIndex >= 0) {
        // Generate title if it's the first user message
        let title = updatedChats[chatIndex].title;
        if (title === "New Chat" && newMessages.length > 1 && newMessages[1].role === "user") {
          title = newMessages[1].text.slice(0, 30) + (newMessages[1].text.length > 30 ? "..." : "");
        }

        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          messages: newMessages,
          title: title,
          updatedAt: Date.now()
        };

        if (user) {
          saveChat(updatedChats[chatIndex] as any);
        } else {
          localStorage.setItem("smarthub_ai_chats", JSON.stringify(updatedChats));
        }
      }
      return updatedChats;
    });
  };

  const setMessages = (updater: any) => {
    const newMessages = typeof updater === 'function' ? updater(messages) : updater;
    updateCurrentChatMessages(newMessages);
  };

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState<"searching" | "analyzing" | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>(null);
  const [pendingAttachments, setPendingAttachments] = useState<FileAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Voice state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const [voiceSettings, setVoiceSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("smarthub_ai_voice_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return { autoRead: false, speed: 1, muted: false, gender: 'female' };
  });

  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [showResponseMode, setShowResponseMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return localStorage.getItem("smarthub_ai_onboarding_dismissed") !== "true";
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("smarthub_ai_onboarding_dismissed", "true");
  };

  const scrollToBottom = () => {
    if (!showOnboarding) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, showOnboarding]);

  useEffect(() => {
    localStorage.setItem("smarthub_ai_voice_settings", JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  useEffect(() => {
    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false; // Stop after first sentence to allow easy sending
        recognitionRef.current.interimResults = true;
        // Mixed language support is tricky with basic API. Often setting to local helps, or just defaulting to en-IN/hi-IN
        recognitionRef.current.lang = 'hi-IN'; // Works well for Hindi + English
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setSpeechError(null);
        };
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join(' ');
          setInput(transcript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setSpeechError(event.error === 'not-allowed' ? "Microphone access denied" : "Failed to recognize speech");
          setIsListening(false);
          setTimeout(() => setSpeechError(null), 3000);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition not supported in your browser");
      setTimeout(() => setSpeechError(null), 3000);
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInput(""); // Clear input when starting to listen
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text: string, messageId: string) => {
    if (!synthRef.current || voiceSettings.muted) return;
    
    // If playing this same message, stop
    if (playingMessageId === messageId) {
      synthRef.current.cancel();
      setPlayingMessageId(null);
      return;
    }

    // Stop current
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*_#]/g, '')); // Strip basic markdown
    utterance.rate = voiceSettings.speed;
    
    // Pick an English or Hindi voice if possible
    const voices = synthRef.current.getVoices();
    let selectedVoice = null;
    if (voiceSettings.gender === 'male') {
      selectedVoice = voices.find(v => (v.name.includes("Google UK English Male") || v.name.toLowerCase().includes("male")) && !v.name.toLowerCase().includes("female"));
    } else {
      selectedVoice = voices.find(v => v.name.includes("Google UK English Female") || v.name.toLowerCase().includes("female") || v.name.includes("Samantha"));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => setPlayingMessageId(null);
    utterance.onerror = () => setPlayingMessageId(null);
    
    setPlayingMessageId(messageId);
    synthRef.current.speak(utterance);
  };
  
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setPlayingMessageId(null);
    }
  };

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // get base64 part
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && pendingAttachments.length === 0) return;

    if (showOnboarding) {
      handleDismissOnboarding();
    }

    setIsLoading(true);
    setSearchStatus(null);
    
    // Process attachments
    const processedAttachments = [];
    const attachmentsForUI = [];
    
    for (const pending of pendingAttachments) {
      let isText = false;
      const type = pending.file.type;
      const name = pending.file.name.toLowerCase();
      
      // Determine if text-based
      if (type.startsWith("text/") || 
          name.endsWith(".json") || 
          name.endsWith(".csv") || 
          name.endsWith(".md") || 
          name.endsWith(".ts") || 
          name.endsWith(".tsx") || 
          name.endsWith(".js") || 
          name.endsWith(".html") || 
          name.endsWith(".css")) {
        isText = true;
      }

      attachmentsForUI.push({
        type: pending.type as "image" | "file",
        name: pending.file.name,
        url: pending.previewUrl
      });

      try {
        if (isText) {
          const text = await pending.file.text();
          processedAttachments.push({
            name: pending.file.name,
            mimeType: pending.file.type || "text/plain",
            text
          });
        } else {
          // Send as base64 for images, pdfs, etc.
          const base64 = await readFileAsBase64(pending.file);
          processedAttachments.push({
            name: pending.file.name,
            mimeType: pending.file.type,
            data: base64
          });
        }
      } catch (err) {
        console.error("Error reading file", err);
      }
    }

    const currentInput = input;
    setInput("");
    setPendingAttachments([]);

    const userMessage: ChatMessage = { 
      id: Date.now().toString(), 
      role: "user", 
      text: currentInput || "Uploaded files.",
      attachments: attachmentsForUI.length > 0 ? attachmentsForUI : undefined
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Create a placeholder for the assistant response
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: assistantMessageId, role: "assistant", text: "", sources: [] }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "text/event-stream"
        },
        body: JSON.stringify({
          message: userMessage.text,
          attachments: processedAttachments,
          history: messages.slice(1).map(m => ({ role: m.role, text: m.text })),
          mode: responseMode
        })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let done = false;
      let fullResponse = "";
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunkStr = decoder.decode(value, { stream: true });
          const parts = chunkStr.split("\n\n");
          
          for (const part of parts) {
            if (part.startsWith('data: ')) {
              try {
                const data = JSON.parse(part.substring(6));
                
                if (data.status === "searching" || data.status === "analyzing") {
                  setSearchStatus(data.status);
                } else if (data.text) {
                  setSearchStatus(null);
                  fullResponse += data.text;
                  setMessages(prev => prev.map(m => {
                    if (m.id === assistantMessageId) {
                      return {
                        ...m,
                        text: m.text + data.text,
                        sources: data.sources && Array.isArray(data.sources) && data.sources.length > 0 ? Array.from(new Map([...(m.sources || []), ...data.sources].map((item) => [item.uri, item])).values()) : m.sources
                      };
                    }
                    return m;
                  }));
                } else if (data.error) {
                  setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, text: `Error: ${data.error}` } : m));
                } else if (data.done) {
                  // Stream finished
                }
              } catch (e) {}
            }
          }
        }
      }
      
      if (voiceSettings.autoRead && fullResponse.trim()) {
        setTimeout(() => handleSpeak(fullResponse, assistantMessageId), 100);
      }
    } catch (err: any) {
      setMessages(prev => prev.map(m => m.id === assistantMessageId ? { ...m, text: err.message || "Network error occurred. The server might be unreachable." } : m));
    } finally {
      setIsLoading(false);
      setSearchStatus(null);
    }
  };

  const createNewChat = () => {
    setCurrentChatId(null);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = chats.filter(c => c.id !== id);
    setChats(updated);
    if (user) deleteChatFromDb(id);
    else localStorage.setItem("smarthub_ai_chats", JSON.stringify(updated));
    if (currentChatId === id) setCurrentChatId(null);
  };

  const clearChat = () => {
    if (currentChatId) {
      setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, messages: [getDefaultWelcomeMessage()] } : c));
    } else {
      setMessages([getDefaultWelcomeMessage()]);
    }
  };

  const handleExport = (format: 'txt' | 'md') => {
    const chatToExport = currentChatId ? chats.find(c => c.id === currentChatId) : { title: "New Chat", messages };
    if (!chatToExport) return;
    
    let content = `# ${chatToExport.title}\n\n`;
    (chatToExport.messages || messages).forEach((msg: any) => {
      content += `**${msg.role === 'user' ? 'User' : 'Assistant'}**:\n${msg.content || msg.text}\n\n`;
    });
    const filename = `chat_${Date.now()}`;
    if (format === 'txt') downloadAsTxt(content, filename);
    else downloadAsMarkdown(content, filename);
    setShowExportMenu(false);
  };

  const generateShareLink = async () => {
    if (!currentChatId || !user) {
      alert("Please sign in and save this chat before sharing.");
      return;
    }
    const currentChatIndex = chats.findIndex(c => c.id === currentChatId);
    if (currentChatIndex === -1) return;
    
    let chat = chats[currentChatIndex] as any;
    if (!chat.sharedId) {
      chat.sharedId = `shared_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await saveChat(chat);
      const updatedChats = [...chats];
      updatedChats[currentChatIndex] = chat;
      setChats(updatedChats);
    }
    
    const url = `${window.location.origin}/shared/${chat.sharedId}`;
    setShareLink(url);
    setShowShareModal(true);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleFileAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        type: file.type.startsWith("image/") ? "image" : "file"
      }));
      setPendingAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        file,
        previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        type: file.type.startsWith("image/") ? "image" : "file"
      }));
      setPendingAttachments(prev => [...prev, ...newFiles]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] md:h-screen w-full bg-slate-50 relative overflow-hidden">
      <AIToolsModals activeTool={activeTool} onClose={() => setActiveTool(null)} />
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`fixed lg:static inset-y-0 left-0 z-30 w-72 md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-slate-200">
          <button 
            onClick={createNewChat}
            className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-800 rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-2 shadow-sm font-semibold"
          >
            <Plus size={18} /> New Chat
          </button>
        </div>
        
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex bg-slate-100 rounded-lg p-1 mb-3 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab("projects")} 
              className={`flex-1 min-w-[70px] text-xs font-medium py-1.5 px-2 rounded-md transition ${activeTab === "projects" ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab("history")} 
              className={`flex-1 min-w-[60px] text-xs font-medium py-1.5 px-2 rounded-md transition ${activeTab === "history" ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Chats
            </button>
            <button 
              onClick={() => setActiveTab("prompts")} 
              className={`flex-1 min-w-[60px] text-xs font-medium py-1.5 px-2 rounded-md transition flex items-center justify-center gap-1 ${activeTab === "prompts" ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Prompts
            </button>
            <button 
              onClick={() => setActiveTab("notes")} 
              className={`flex-1 min-w-[60px] text-xs font-medium py-1.5 px-2 rounded-md transition ${activeTab === "notes" ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Notes
            </button>
            <button 
              onClick={() => setActiveTab("tasks")} 
              className={`flex-1 min-w-[60px] text-xs font-medium py-1.5 px-2 rounded-md transition ${activeTab === "tasks" ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tasks
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder={activeTab === "history" ? "Search chats..." : activeTab === "prompts" ? "Search prompts..." : activeTab === "notes" ? "Search notes..." : activeTab === "projects" ? "Search projects..." : "Search tasks..."}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-200/50 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 rounded-lg pl-9 pr-3 py-2 text-sm transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="p-3 space-y-1 w-full">
            {activeTab === "projects" && (
              <>
                <div className="flex items-center justify-between mb-2 px-2 mt-2">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Projects</h3>
                  <button onClick={handleCreateProject} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Plus size={14} /></button>
                </div>
                {projects
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(project => (
                  <div 
                    key={project.id} 
                    onClick={() => {
                      setCurrentProjectId(project.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group cursor-pointer transition ${currentProjectId === project.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-200/50 text-slate-600'}`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FolderOpen size={16} className={currentProjectId === project.id ? 'text-indigo-500' : 'text-amber-400'} />
                      <span className="text-sm truncate font-medium">{project.name}</span>
                    </div>
                    <button 
                      onClick={(e) => deleteProjectHandler(e, project.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-sm text-slate-400 px-2 py-4 text-center">{user ? "No projects created yet" : "Sign in to save projects"}</p>
                )}
              </>
            )}
            {activeTab === "history" && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-2">Recent Chats</h3>
                {chats
                  .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) && (!currentProjectId || c.projectId === currentProjectId))
                  .map(chat => (
                  <div 
                    key={chat.id} 
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between group cursor-pointer transition ${currentChatId === chat.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-200/50 text-slate-600'}`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <MessageSquare size={16} className={currentChatId === chat.id ? 'text-indigo-500' : 'text-slate-400'} />
                      <span className="text-sm truncate font-medium">{chat.title}</span>
                    </div>
                    <button 
                      onClick={(e) => deleteChat(e, chat.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {chats.length === 0 && (
                  <p className="text-sm text-slate-400 px-2 py-4 text-center">No chat history yet</p>
                )}
              </>
            )}
            {activeTab === "prompts" && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-2">Saved Prompts</h3>
                {savedPrompts
                  .filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(prompt => (
                  <div 
                    key={prompt.id} 
                    onClick={() => {
                      setInput(prompt.prompt);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg flex flex-col group cursor-pointer transition hover:bg-slate-200/50 text-slate-600 mb-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Bookmark size={14} className="text-amber-500 flex-shrink-0" />
                        <span className="text-sm truncate font-medium text-slate-800">{prompt.title}</span>
                      </div>
                      <button 
                        onClick={(e) => deletePrompt(e, prompt.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-1 pl-6">{prompt.prompt}</p>
                  </div>
                ))}
              </>
            )}
            {activeTab === "notes" && (
              <>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-2 mt-2">Saved Notes</h3>
                {notes
                  .filter(n => n.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(note => (
                  <div 
                    key={note.id} 
                    className="w-full text-left px-3 py-3 rounded-lg flex flex-col group transition bg-slate-50 border border-slate-100 hover:border-slate-300 text-slate-600 mb-2 relative"
                  >
                     <p className="text-xs text-slate-700 whitespace-pre-wrap">{note.text}</p>
                     <div className="flex justify-between items-center mt-2">
                        <span className="text-[10px] text-slate-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                        <button 
                          onClick={(e) => deleteNote(e, note.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={12} />
                        </button>
                     </div>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-sm text-slate-400 px-2 py-4 text-center">No saved notes</p>
                )}
              </>
            )}
            {activeTab === "tasks" && (
              <>
                <div className="flex items-center justify-between mb-2 px-2 mt-2">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Items</h3>
                </div>
                {tasks
                  .filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(task => (
                  <div 
                    key={task.id} 
                    className="w-full text-left px-3 py-2 rounded-lg flex items-start gap-2 group transition hover:bg-slate-200/50 text-slate-600 mb-1"
                  >
                    <button onClick={() => toggleTask(task.id)} className="mt-0.5 text-slate-400 hover:text-indigo-600 shrink-0">
                      <Square size={16} className={task.completed ? "fill-indigo-600 text-indigo-600" : ""} />
                    </button>
                    <span className={`text-sm flex-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{task.text}</span>
                    <button 
                      onClick={(e) => deleteTask(e, task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-sm text-slate-400 px-2 py-4 text-center">No tasks yet</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">AI Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setActiveTool("bg-remover")} className="p-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex flex-col items-center gap-1">
              <ImageIcon size={16} className="text-indigo-500" /> BG Remove
            </button>
            <button onClick={() => setActiveTool("hd-enhancer")} className="p-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 flex flex-col items-center gap-1">
              <Wand2 size={16} className="text-indigo-500" /> Enhance
            </button>
          </div>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        {/* Chat Header */}
        <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200 bg-white/80 backdrop-blur top-0 z-10 w-full shrink-0">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center rounded-lg shadow-sm">
              <Bot size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 leading-tight">
                 {currentProjectId ? `Project: ${projects.find(p => p.id === currentProjectId)?.name || 'Unknown'}` : 'Workspace Co-Pilot'}
              </h2>
              <p className="text-[10px] text-emerald-600 flex items-center mt-0.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span> {user ? `Online as ${user.email}` : "Online (Local Mode)"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative border border-slate-200 bg-slate-50 rounded-lg overflow-hidden flex items-center hover:border-slate-300 transition-colors">
              <div className="pl-2 pr-1 opacity-50"><Wand2 size={14} /></div>
              <select 
                value={responseMode} 
                onChange={(e) => setResponseMode(e.target.value as any)}
                className="bg-transparent border-none text-xs font-medium text-slate-700 py-1.5 pr-6 cursor-pointer focus:ring-0 w-[120px] sm:w-auto appearance-none"
              >
                <option value="smart">Smart Mode</option>
                <option value="fast">Fast Mode</option>
                <option value="deep">Deep Reasoning</option>
                <option value="creative">Creative Mode</option>
                <option value="research">Research Mode</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 text-slate-400 pointer-events-none" />
            </div>
            {currentProjectId && (
              <button 
                onClick={() => setCurrentProjectId(null)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition" 
                title="Exit Project"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Share Button */}
            <button 
              onClick={generateShareLink} 
              className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              title="Share Chat"
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* Export Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)} 
                className="px-2.5 py-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                title="Export"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </button>
              {showExportMenu && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <button onClick={() => handleExport('txt')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition">As Text (.txt)</button>
                  <button onClick={() => handleExport('md')} className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition">As Markdown (.md)</button>
                </div>
              )}
            </div>

            <button onClick={clearChat} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Clear Chat">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-6 space-y-6">
          {showOnboarding ? (
            <AIOnboarding 
              onStart={handleDismissOnboarding} 
              onSetInput={(text) => setInput(text)}
            />
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white ml-3' : 'bg-slate-100 text-slate-700 mr-3'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className={`group relative px-5 py-3.5 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-slate-900 text-white rounded-tr-sm' 
                        : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-sm'
                    }`}>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {msg.attachments.map((att, idx) => (
                            <div key={idx} className="relative group max-w-[200px]">
                              {att.type === 'image' && att.url ? (
                                <img src={att.url} alt={att.name} className="w-full h-auto rounded-lg overflow-hidden border border-slate-200/50" />
                              ) : (
                                <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 text-white rounded-lg border border-slate-700 w-full text-xs truncate">
                                  <FileText size={14} className="shrink-0 text-indigo-300" />
                                  <span className="truncate">{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {msg.text ? (
                        <div className="prose prose-sm max-w-none text-current opacity-90 pb-1">
                          <ReactMarkdown>{msg.text}</ReactMarkdown>
                        </div>
                      ) : (
                        msg.role === 'assistant' && isLoading && (
                          <div className="flex items-center gap-2 text-indigo-500 font-medium text-sm py-1">
                            {searchStatus === "searching" ? (
                              <><Search className="animate-pulse" size={16} /> Searching web...</>
                            ) : searchStatus === "analyzing" ? (
                              <><Loader2 className="animate-spin" size={16} /> Analyzing results...</>
                            ) : (
                              <div className="flex gap-1.5 items-center px-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                              </div>
                            )}
                          </div>
                        )
                      )}

                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5"><Globe size={12} className="text-indigo-400" /> Live Web Results</p>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((s, idx) => {
                              let hostname = "Link";
                              try { hostname = new URL(s.uri).hostname; } catch(e){}
                              return (
                                <a href={s.uri} target="_blank" rel="noopener noreferrer" key={idx} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-white border border-slate-200 text-xs text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all max-w-full">
                                  <span className="truncate max-w-[150px]">{s.title || hostname}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.text && msg.id === messages[messages.length - 1]?.id && !isLoading && (
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                          {[
                            { label: "Summarize", prompt: "Please summarize the key points above concisely." },
                            { label: "Improve", prompt: "Can you improve the structure or ideas mentioned above?" },
                            { label: "Expand", prompt: "Please expand on this and provide more details." },
                            { label: "Compare", prompt: "Can you provide a comparison or alternatives to this?" },
                            { label: "Explain Simply", prompt: "Explain this to me in very simple terms, like I am 5." },
                            { label: "Deep Analyze", prompt: "Run a comprehensive deep analysis on the implications of this." },
                            { label: "Create Plan", prompt: "Turn this into a step-by-step actionable business plan." }
                          ].map(action => (
                            <button
                              key={action.label}
                              onClick={() => { setInput(action.prompt); }}
                              className="text-[10px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-indigo-600 hover:border-indigo-300 transition-colors shadow-sm font-medium tracking-wide"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {msg.role === 'assistant' && msg.text && (
                        <div className="absolute -right-20 bottom-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition">
                          <button 
                            onClick={() => playingMessageId === msg.id ? stopSpeaking() : handleSpeak(msg.text, msg.id)} 
                            className={`p-1.5 border rounded-md shadow-sm transition ${playingMessageId === msg.id ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-white text-slate-400 hover:text-slate-700 border-slate-200'}`}
                            title={playingMessageId === msg.id ? "Stop voice" : "Read aloud"}
                          >
                            {playingMessageId === msg.id ? <Square size={14} className="fill-current" /> : <Volume2 size={14} />}
                          </button>
                          <button 
                            onClick={() => saveNote(msg.text)} 
                            className="p-1.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-md shadow-sm transition"
                            title="Save as Note"
                          >
                            <Bookmark size={14} />
                          </button>
                          <button 
                            onClick={() => addTask((msg.text || "").substring(0, 50) + "...")} 
                            className="p-1.5 text-slate-400 hover:text-emerald-600 bg-white border border-slate-200 rounded-md shadow-sm transition"
                            title="Add to Tasks"
                          >
                            <Square size={14} />
                          </button>
                          <button 
                            onClick={() => copyToClipboard(msg.text)} 
                            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-md shadow-sm transition"
                            title="Copy text"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      )}
                      {msg.role === 'user' && msg.text && (
                        <div className="absolute -left-10 bottom-2 flex opacity-0 group-hover:opacity-100 transition">
                          <button 
                            onClick={() => savePrompt(msg.text)} 
                            className="p-1.5 text-slate-400 hover:text-amber-500 bg-white border border-slate-200 rounded-md shadow-sm transition"
                            title="Save as Shortcut Prompt"
                          >
                            <Star size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggested Prompts */}
        {messages.length === 1 && !showOnboarding && (
          <div className="p-4 flex flex-wrap gap-2 justify-center hide-scrollbar overflow-x-auto">
            <button onClick={() => setInput("How can I increase my profit margin from 15% to 25%?")} className="px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-full text-xs font-medium hover:bg-slate-50 whitespace-nowrap">How to increase profit margin?</button>
            <button onClick={() => setInput("Write an engaging Instagram description for my new leather wallet.")} className="px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-full text-xs font-medium hover:bg-slate-50 whitespace-nowrap">Instagram description for product</button>
            <button onClick={() => setInput("What are the best trending products for Q4 2024?")} className="px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-full text-xs font-medium hover:bg-slate-50 whitespace-nowrap">Trending products for Q4</button>
          </div>
        )}

        {/* Chat Input */}
        <div className="p-4 md:p-6 bg-white border-t border-slate-200 w-full shrink-0">
          <form 
            onSubmit={(e) => handleSend(e)} 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`max-w-4xl mx-auto relative flex flex-col items-center rounded-2xl transition-all duration-300 ${isDragging ? 'bg-indigo-50/50 ring-2 ring-indigo-500/50 p-2' : ''}`}
          >
            {pendingAttachments.length > 0 && (
              <div className="w-full flex flex-wrap gap-2 mb-3 pb-2 border-b border-slate-100 px-2 justify-start">
                {pendingAttachments.map((att, idx) => (
                  <div key={idx} className="relative flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                    {att.type === 'image' && att.previewUrl ? (
                      <div className="w-5 h-5 rounded overflow-hidden relative shrink-0">
                        <img src={att.previewUrl} className="w-full h-full object-cover" alt="" />
                      </div>
                    ) : (
                      <FileText size={14} className="text-indigo-500 shrink-0" />
                    )}
                    <span className="max-w-[120px] truncate">{att.file.name}</span>
                    <button 
                      type="button"
                      onClick={() => removePendingAttachment(idx)}
                      className="p-0.5 ml-1 bg-slate-200 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Settings Overlay */}
            {showVoiceSettings && (
              <div className="absolute right-0 bottom-[120%] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-64 z-20 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800 text-sm">Voice Settings</h3>
                  <button type="button" onClick={() => setShowVoiceSettings(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Auto-read replies</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={voiceSettings.autoRead} onChange={(e) => setVoiceSettings({ ...voiceSettings, autoRead: e.target.checked })} />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Mute all</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={voiceSettings.muted} onChange={(e) => setVoiceSettings({ ...voiceSettings, muted: e.target.checked })} />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600 block mb-2">Voice</span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {['female', 'male'].map(gender => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => setVoiceSettings({ ...voiceSettings, gender })}
                          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition capitalize ${voiceSettings.gender === gender ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-slate-600 block mb-2">Speech Speed</span>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                      {[0.75, 1, 1.25, 1.5].map(speed => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => setVoiceSettings({ ...voiceSettings, speed })}
                          className={`flex-1 text-xs py-1.5 rounded-md font-medium transition ${voiceSettings.speed === speed ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="w-full relative flex items-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple
                accept="image/*,.pdf,.doc,.docx,.csv,.xlsx,.txt,.json,.js,.ts,.html,.css"
                onChange={handleFileAttach}
              />
              <button 
                type="button" 
                onClick={handleFileAttachClick}
                className="absolute left-3 md:left-4 p-2 text-slate-400 hover:text-slate-600 transition"
                title="Attach File or Image"
              >
                <Paperclip size={20} />
              </button>
              
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute left-10 md:left-12 p-2 transition rounded-full ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-slate-600'}`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              {isListening && (
                <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-bounce shadow-sm flex items-center gap-1">
                  Listening... <span className="flex gap-0.5"><span className="w-1 h-2 bg-white rounded-full animate-pulse"></span><span className="w-1 h-3 bg-white rounded-full animate-pulse delay-75"></span><span className="w-1 h-2 bg-white rounded-full animate-pulse delay-150"></span></span>
                </div>
              )}

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask for product ideas, margin strategies..."}
                className={`w-full pl-[5.5rem] md:pl-20 pr-24 py-4 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition ${isListening ? 'bg-indigo-50/50' : ''}`}
                disabled={isLoading}
              />
              
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className={`p-2.5 rounded-full transition ${showVoiceSettings ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  title="Voice Settings"
                >
                  <Settings size={18} />
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading || (!input.trim() && pendingAttachments.length === 0)}
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  <Send size={18} />
                </button>
              </div>

              {/* Speech Error Banner */}
              {speechError && (
                <div className="absolute top-[-40px] left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg text-xs shadow-lg animate-in fade-in slide-in-from-bottom-2 whitespace-nowrap">
                  {speechError}
                </div>
              )}
            </div>
          </form>
          <div className="text-center mt-3">
            <p className="text-[11px] text-slate-400 uppercase tracking-widest font-medium">AI can make mistakes. Verify critical business numbers.</p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95">
            <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-2 rounded-full">
              <X size={20} />
            </button>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <Share2 size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Share this Chat</h2>
            <p className="text-sm text-slate-500 mb-6">Anyone with this link can view a read-only version of this conversation.</p>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="relative flex-1">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  readOnly 
                  value={shareLink}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none"
                />
              </div>
              <button 
                onClick={copyShareLink}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition whitespace-nowrap"
              >
                {isCopied ? <Check size={16} /> : <Copy size={16} />}
                {isCopied ? 'Copied' : 'Copy'}
              </button>
            </div>
            
            <button onClick={() => setShowShareModal(false)} className="w-full py-2.5 bg-slate-100 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-200 transition">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
