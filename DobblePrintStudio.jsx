```react
import React, { useState, useMemo } from 'react';
import { Printer, RefreshCw, Plus, Trash2, Info, Square, LayoutGrid, ListOrdered, Download } from 'lucide-react';

const DEFAULT_WORDS = [
  "Apple", "Banana", "Cherry", "Dragon", "Eagle", "Forest", "Guitar", "Honey",
  "Island", "Jungle", "Kite", "Lemon", "Mountain", "Night", "Ocean", "Piano",
  "Quartz", "River", "Sun", "Tiger", "Umbrella", "Violin", "Whale", "Xylophone",
  "Yacht", "Zebra", "Anchor", "Bridge", "Castle", "Desert", "Earth", "Flame",
  "Galaxy", "Hammer", "Ice", "Jacket", "Koala", "Lantern", "Meteor", "Nebula",
  "Olive", "Panda", "Queen", "Rocket", "Star", "Tulip", "Unicorn", "Volcano",
  "Winter", "X-ray", "Yellow", "Zenith", "Air", "Breeze", "Cloud", "Dust", "Echo"
];

const COLORS = [
  "#E11D48", "#2563EB", "#059669", "#D97706", "#7C3AED", 
  "#DB2777", "#0891B2", "#4F46E5", "#16A34A", "#EA580C"
];

const DobblePrintStudio = () => {
  const [words, setWords] = useState(DEFAULT_WORDS);
  const [newWord, setNewWord] = useState("");
  const [layoutMode, setLayoutMode] = useState('playful');
  const [symbolsPerCard, setSymbolsPerCard] = useState(8);

  const n = useMemo(() => symbolsPerCard - 1, [symbolsPerCard]);
  const totalRequiredSymbols = useMemo(() => n * n + n + 1, [n]);

  const cardData = useMemo(() => {
    const finalDeck = [];
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let c = [i]; 
        for (let k = 0; k < n; k++) {
          c.push((n + 1) + k * n + (i * k + j) % n);
        }
        finalDeck.push(c);
      }
    }
    for (let i = 0; i < n; i++) {
      let c = [n];
      for (let j = 0; j < n; j++) {
        c.push((n + 1) + i * n + j);
      }
      finalDeck.push(c);
    }
    let last = [n];
    for (let i = 0; i < n; i++) last.push(i);
    finalDeck.push(last);

    return finalDeck.map(indices => ({
      indices,
      layout: indices.map((_, i) => {
        let x, y, rotation, scale;
        const gridDim = Math.ceil(Math.sqrt(symbolsPerCard));
        if (layoutMode === 'grid') {
          const row = Math.floor(i / gridDim);
          const col = i % gridDim;
          const step = 100 / (gridDim + 1);
          x = step + col * step; y = step + row * step;
          rotation = 0; scale = 1.0;
        } else if (layoutMode === 'playful') {
          const row = Math.floor(i / gridDim);
          const col = i % gridDim;
          const step = 100 / (gridDim + 1);
          const jitter = 5;
          x = (step + col * step) + (Math.random() * jitter - jitter/2);
          y = (step + row * step) + (Math.random() * jitter - jitter/2);
          rotation = Math.random() * 40 - 20; 
          scale = 0.8 + Math.random() * 0.4;
        } else {
          const angle = Math.random() * Math.PI * 2;
          const radius = i === 0 ? Math.random() * 10 : 15 + Math.random() * 30;
          x = 50 + radius * Math.cos(angle);
          y = 50 + radius * Math.sin(angle);
          rotation = Math.random() * 360;
          scale = 0.6 + Math.random() * 0.8;
        }
        return { x, y, rotation, scale, color: COLORS[Math.floor(Math.random() * COLORS.length)] };
      })
    }));
  }, [n, layoutMode, symbolsPerCard]);

  const handleAddWord = (e) => {
    e.preventDefault();
    if (newWord) {
      setWords([...words, newWord]);
      setNewWord("");
    }
  };

  const downloadWords = () => {
    const blob = new Blob([words.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dobble_words.txt';
    link.click();
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-dyslexic tracking-wide">
      <style>{`
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/opendyslexic@1.0.3/font/OpenDyslexic-Regular.otf') format('opentype');
          font-weight: normal; font-style: normal;
        }
        .font-dyslexic { font-family: 'OpenDyslexic', sans-serif; }
        @media print {
          body { background: white; padding: 0; margin: 0; }
          .print\\:hidden { display: none !important; }
          @page { margin: 1cm; size: A4; }
          main { display: block !important; max-width: 100% !important; }
          .grid { display: grid !important; }
          .lg\\:col-span-3 { width: 100% !important; }
        }
      `}</style>
      <header className="max-w-6xl mx-auto mb-8 print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Square className="text-indigo-600" /> Dobble Print Studio
            </h1>
            <p className="text-slate-600">DIY Projective Plane Game Generator</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1 rounded-lg">
              <ListOrdered size={18} className="text-slate-500" />
              <select 
                value={symbolsPerCard}
                onChange={(e) => setSymbolsPerCard(parseInt(e.target.value))}
                className="bg-transparent text-sm font-bold outline-none font-dyslexic cursor-pointer"
              >
                <option value="4">4 words/card</option>
                <option value="6">6 words/card</option>
                <option value="8">8 words/card</option>
                <option value="12">12 words/card</option>
              </select>
            </div>
            <select 
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
              className="bg-white border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold outline-none font-dyslexic"
            >
              <option value="chaotic">Chaotic</option>
              <option value="playful">Playful Grid</option>
              <option value="grid">Clean Grid</option>
            </select>
            <button onClick={() => window.print()} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 shadow-sm font-bold">
              Print
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-4 print:hidden">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Words ({words.length}/{totalRequiredSymbols})</h2>
              <button onClick={downloadWords} className="p-2 text-slate-500 hover:text-indigo-600" title="Download words">
                <Download size={18} />
              </button>
            </div>
            <form onSubmit={handleAddWord} className="flex gap-2 mb-4">
              <input type="text" value={newWord} onChange={(e) => setNewWord(e.target.value)} placeholder="Add..." className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm outline-none font-dyslexic" />
              <button type="submit" className="bg-indigo-600 text-white p-2 rounded-md"><Plus size={18} /></button>
            </form>
            <div className="max-h-[40vh] overflow-y-auto space-y-1 pr-1">
              {words.map((word, i) => (
                <div key={i} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded group border border-transparent hover:border-slate-200">
                  <span className={`truncate font-bold ${i >= totalRequiredSymbols ? 'text-slate-300 line-through' : ''}`}>{word}</span>
                  <button onClick={() => setWords(words.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-amber-900 text-sm">
            <h3 className="font-bold flex items-center gap-1"><Info size={16}/> Math Note</h3>
            <p className="mt-1 opacity-90 text-xs">For {symbolsPerCard} words per card, you need exactly {totalRequiredSymbols} unique words for a full deck.</p>
          </div>
        </aside>
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-0 print:border-l print:border-t print:border-slate-400">
            {cardData.map((card, cardIdx) => (
              <div key={cardIdx} className="relative aspect-square bg-white border-2 border-slate-200 flex items-center justify-center p-6 print:border-r print:border-b print:border-dashed print:border-slate-400" style={{ breakInside: 'avoid' }}>
                <div className="relative w-full h-full pointer-events-none">
                  {card.indices.map((symbolIdx, i) => {
                    const l = card.layout[i];
                    return (
                      <div key={i} className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center whitespace-nowrap font-bold select-none" style={{ left: `${l.x}%`, top: `${l.y}%`, color: l.color, transform: `translate(-50%, -50%) rotate(${l.rotation}deg) scale(${l.scale})`, fontSize: '13px', letterSpacing: '0.05em' }}>
                        {words[symbolIdx] || `[${symbolIdx}]`}
                      </div>
                    );
                  })}
                </div>
                <div className="absolute bottom-1 right-2 text-[7px] font-mono text-slate-300 print:text-slate-200">#{cardIdx + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default DobblePrintStudio;
```
