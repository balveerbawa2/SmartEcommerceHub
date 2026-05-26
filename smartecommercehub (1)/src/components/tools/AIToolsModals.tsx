import { useState } from "react";
import { X, UploadCloud, Loader2, Download, ImageIcon, Wand2, Video, Search, Trash2 } from "lucide-react";

type ToolType = "bg-remover" | "hd-enhancer" | "3d-video" | "gallery" | null;

export function AIToolsModals({ 
  activeTool, 
  onClose 
}: { 
  activeTool: ToolType, 
  onClose: () => void 
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  // Gallery states
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryItems, setGalleryItems] = useState([
    { id: 1, type: "image", name: "Shoe_nobg.png", date: "Today", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80" },
    { id: 2, type: "video", name: "Watch_3D.mp4", date: "Yesterday", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80" },
    { id: 3, type: "image", name: "Bag_HD.jpg", date: "May 20", url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&q=80" }
  ]);

  // Reset state when tool changes
  if (!activeTool) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResultReady(false);
    }
  };

  const handleProcess = () => {
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate API processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setResultReady(true);
    }, 3000);
  };

  const deleteGalleryItem = (id: number) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id));
  };

  const getToolDetails = () => {
    switch (activeTool) {
      case "bg-remover":
        return {
          icon: <ImageIcon size={24} className="text-blue-600" />,
          title: "Background Remover",
          desc: "Upload a product image to instantly remove its background.",
          processText: "Removing Background...",
          btnProcess: "Remove Background",
          bgClass: "bg-blue-100"
        };
      case "hd-enhancer":
        return {
          icon: <Wand2 size={24} className="text-violet-600" />,
          title: "HD Enhancer",
          desc: "Upscale and enhance blurry product images to 4K quality.",
          processText: "Enhancing Quality...",
          btnProcess: "Enhance to HD",
          bgClass: "bg-violet-100"
        };
      case "3d-video":
        return {
          icon: <Video size={24} className="text-emerald-600" />,
          title: "3D Video Creator",
          desc: "Generate a rotating 3D showcase from a single product image.",
          processText: "Generating 3D Video...",
          btnProcess: "Generate 3D Video",
          bgClass: "bg-emerald-100"
        };
      case "gallery":
        return {
          icon: <ImageIcon size={24} className="text-indigo-600" />,
          title: "AI Gallery",
          desc: "View, download, and manage your AI-generated media.",
          processText: "",
          btnProcess: "",
          bgClass: "bg-indigo-100"
        };
    }
  };

  const details = getToolDetails();

  if (activeTool === "gallery") {
    const filteredItems = galleryItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white max-w-4xl w-full rounded-3xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${details.bgClass}`}>
                {details.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">{details.title}</h3>
                <p className="text-sm text-slate-500">{details.desc}</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Controls */}
          <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search images or videos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="p-6 flex-1 overflow-y-auto bg-slate-50">
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center">
                <ImageIcon size={48} className="text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">No media found</h3>
                <p className="text-slate-500">Generate some content using the AI Media Tools.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden group shadow-sm flex flex-col">
                    <div className="aspect-[4/3] bg-slate-100 relative">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center backdrop-blur">
                            <Video size={20} className="text-slate-900 ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 truncate mb-1" title={item.name}>{item.name}</p>
                        <p className="text-xs text-slate-500">{item.date}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5">
                          <Download size={16} /> Download
                        </button>
                        <button onClick={() => deleteGalleryItem(item.id)} className="p-2 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white max-w-xl w-full rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${details.bgClass}`}>
              {details.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{details.title}</h3>
              <p className="text-sm text-slate-500">{details.desc}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setFile(null);
              setResultReady(false);
              onClose();
            }} 
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {!file ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:bg-slate-50 transition">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={32} />
                </div>
                <p className="font-semibold text-slate-900 mb-1">Click to upload image</p>
                <p className="text-sm text-slate-500 mb-6">Supports JPG, PNG up to 10MB</p>
                <span className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition">
                  Select File
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Setup */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original</p>
                  <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="Original" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Result Preview</p>
                  <div className="aspect-square rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center relative">
                    {!resultReady && !isProcessing && (
                      <p className="text-sm text-slate-400">Not processed yet</p>
                    )}
                    {isProcessing && (
                      <div className="flex flex-col items-center text-slate-500">
                        <Loader2 size={32} className="animate-spin mb-3 text-indigo-600" />
                        <span className="text-sm font-medium animate-pulse">{details.processText}</span>
                      </div>
                    )}
                    {resultReady && (
                      <div className="w-full h-full relative" style={{ backgroundImage: activeTool === 'bg-remover' ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAACVJREFUKFNjZCASMDKgAn//MyKLMTAwMDIwMAIYQ0O4MDb1I8EAzQIIj3rK7AAAAABJRU5ErkJggg==")' : 'none' }}>
                        {activeTool === "bg-remover" && (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Result" 
                            className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl p-4"
                          />
                        )}
                        {activeTool === "hd-enhancer" && (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Result" 
                            className="w-full h-full object-cover contrast-125 saturate-150 brightness-110"
                          />
                        )}
                        {activeTool === "3d-video" && (
                          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center relative">
                            <span className="absolute inset-0 bg-indigo-500/20 animate-pulse"></span>
                            <Video size={48} className="text-white/80 mb-2 z-10" />
                            <span className="text-xs text-white/80 z-10">Preview Generating (Mock)</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!resultReady ? (
                <button 
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-70 transition flex justify-center items-center gap-2"
                >
                  {isProcessing && <Loader2 size={18} className="animate-spin" />}
                  {isProcessing ? "Processing..." : details.btnProcess}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setFile(null);
                      setResultReady(false);
                    }}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition"
                  >
                    Try Another
                  </button>
                  <button 
                    className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex justify-center items-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
