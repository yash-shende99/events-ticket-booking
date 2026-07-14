"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowLeft, Save, MousePointer2, Eraser, Loader2, Settings } from "lucide-react";
import toast from "react-hot-toast";

export default function SeatLayoutBuilder() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const venueId = params.id as string;
  const screenId = params.screenId as string;

  const [venue, setVenue] = useState<any>(null);
  const [screen, setScreen] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Layout State
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(15);
  const [layout, setLayout] = useState<string[][]>([]);
  const [activeBrush, setActiveBrush] = useState<string>("Standard");

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/login");
    } else if (status === "authenticated" && venueId && screenId) {
      fetchVenueAndScreen();
    }
  }, [status, session, router, venueId, screenId]);

  const fetchVenueAndScreen = async () => {
    try {
      const res = await fetch("/api/theaters", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        const v = data.find((t: any) => t._id === venueId);
        if (v) {
          setVenue(v);
          const s = v.screens?.find((scr: any) => scr._id === screenId);
          if (s) {
            setScreen(s);
            // Initialize layout from DB or generate empty grid
            if (s.layout && s.layout.length > 0) {
              setLayout(s.layout);
              setRows(s.layout.length);
              setCols(s.layout[0].length);
            } else {
              generateEmptyGrid(10, 15);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEmptyGrid = (r: number, c: number) => {
    const newGrid = Array(r).fill(null).map(() => Array(c).fill("Gap"));
    setLayout(newGrid);
  };

  const handleResizeGrid = (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm("Resizing the grid will clear your current layout. Are you sure?")) {
      generateEmptyGrid(rows, cols);
    }
  };

  const handleCellClick = (rIndex: number, cIndex: number) => {
    const newLayout = [...layout];
    newLayout[rIndex] = [...newLayout[rIndex]];
    newLayout[rIndex][cIndex] = activeBrush;
    setLayout(newLayout);
  };

  const handleSaveLayout = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/venues/${venueId}/screens?screenId=${screenId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout })
      });
      if (res.ok) {
        toast.success("Seat layout saved successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save layout");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const getCellColor = (type: string) => {
    switch (type) {
      case "Premium": return "bg-purple-500 border-purple-600";
      case "Standard": return "bg-blue-500 border-blue-600";
      case "Economy": return "bg-emerald-500 border-emerald-600";
      case "Platinum": return "bg-slate-800 border-slate-900";
      case "Gold": return "bg-amber-400 border-amber-500";
      case "Silver": return "bg-gray-300 border-gray-400";
      case "Recliner": return "bg-rose-500 border-rose-600";
      case "Gap": return "bg-transparent border-dashed border-gray-300";
      default: return "bg-gray-200 border-gray-300";
    }
  };

  const brushes = ["Premium", "Platinum", "Gold", "Silver", "Standard", "Economy", "Recliner", "Gap"];

  if (status === "loading" || isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Seat Layout...</div>;
  }

  if (!screen) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Screen not found!</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <div className="flex items-center cursor-pointer text-gray-900">
              <span className="text-3xl font-bold tracking-tighter">
                Cine<span className="text-[#f84464]">Verse</span>
              </span>
            </div>
          </Link>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-2 text-gray-700 font-bold">
            <Shield className="w-5 h-5 text-[#f84464]" /> Admin Control
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/admin/venues/${venueId}/screens`} className="text-sm font-medium text-gray-600 hover:text-[#f84464] transition flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Screens
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seat Layout Builder</h1>
            <p className="text-gray-500 mt-1">
              Designing layout for <span className="font-bold text-gray-800">{screen.name}</span> at {venue.name}
            </p>
          </div>
          <button 
            onClick={handleSaveLayout}
            disabled={isSaving}
            className="bg-[#f84464] hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} 
            Save Layout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-400" /> Grid Settings
              </h3>
              <form onSubmit={handleResizeGrid} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Rows</label>
                    <input type="number" min="1" max="50" value={rows} onChange={e => setRows(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#f84464]" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Columns</label>
                    <input type="number" min="1" max="50" value={cols} onChange={e => setCols(Number(e.target.value))} className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-[#f84464]" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded text-sm transition">
                  Resize & Clear Grid
                </button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MousePointer2 className="w-4 h-4 text-gray-400" /> Paint Brushes
              </h3>
              <p className="text-xs text-gray-500 mb-4">Select a category below, then click on the grid to paint seats.</p>
              
              <div className="space-y-2">
                {brushes.map(brush => (
                  <button 
                    key={brush}
                    onClick={() => setActiveBrush(brush)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                      activeBrush === brush 
                        ? "border-[#f84464] bg-red-50 text-[#f84464]" 
                        : "border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border ${getCellColor(brush)} flex items-center justify-center`}>
                      {brush === "Gap" && <Eraser className="w-3 h-3 text-gray-400" />}
                    </div>
                    {brush === "Gap" ? "Empty Space / Aisle" : brush}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 overflow-auto flex flex-col items-center">
              
              {/* Screen Graphic */}
              <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
                <div className="h-2 w-full bg-gray-300 rounded-t-full shadow-[0_4px_20px_rgba(0,0,0,0.1)]"></div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em] mt-4">Screen This Way</p>
              </div>

              {/* The Grid */}
              <div className="inline-flex flex-col gap-2">
                {layout.map((row, rIndex) => (
                  <div key={`r-${rIndex}`} className="flex gap-2 items-center">
                    {/* Row Label */}
                    <div className="w-6 text-right text-xs font-bold text-gray-400 pr-2 select-none">
                      {String.fromCharCode(65 + rIndex)}
                    </div>
                    
                    {row.map((cellType, cIndex) => (
                      <button
                        key={`c-${rIndex}-${cIndex}`}
                        onMouseDown={() => handleCellClick(rIndex, cIndex)}
                        onMouseEnter={(e) => { if (e.buttons === 1) handleCellClick(rIndex, cIndex); }}
                        className={`w-7 h-7 rounded-t-lg rounded-b-sm border shadow-sm transition-transform active:scale-95 ${getCellColor(cellType)}`}
                        title={`Row ${String.fromCharCode(65 + rIndex)}, Seat ${cIndex + 1} (${cellType})`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                💡 Tip: You can click and drag your mouse across the seats to paint multiple at once!
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
