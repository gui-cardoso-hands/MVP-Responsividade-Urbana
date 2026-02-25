import { useState, FormEvent, useEffect } from 'react';
import { Search, MapPin, Loader2, ArrowRight, History, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geocodeLocation, reverseGeocodeLocation, LocationData } from './services/geocoding';
import { fetchNearbyPlaces, Place, Category } from './services/places';
import Map from './components/Map';
import ServiceRadar from './components/ServiceRadar';
import LandingPage from './components/LandingPage';

const CATEGORIES: Category[] = ['Saúde', 'Educação', 'Lazer', 'Transporte'];

const CATEGORY_COLORS: Record<Category, string> = {
  'Saúde': 'bg-[var(--chart-1)]',
  'Educação': 'bg-[var(--chart-2)]',
  'Lazer': 'bg-[var(--chart-3)]',
  'Transporte': 'bg-[var(--chart-5)]'
};

interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

type ViewState = 'landing' | 'app';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState('');
  const [highlightedCategory, setHighlightedCategory] = useState<Category | null>(null);
  const [radius, setRadius] = useState(800); // Default 800m
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    const saved = localStorage.getItem('searchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }, [history]);

  // Re-fetch places when radius changes if we have a location
  useEffect(() => {
    if (location) {
      setPlacesLoading(true);
      fetchNearbyPlaces(location.lat, location.lon, radius)
        .then(fetchedPlaces => setPlaces(fetchedPlaces))
        .catch(err => console.error(err))
        .finally(() => setPlacesLoading(false));
    }
  }, [radius, location]);

  const addToHistory = (query: string) => {
    setHistory(prev => {
      const newHistory = [{ query, timestamp: Date.now() }, ...prev.filter(h => h.query !== query)].slice(0, 3);
      return newHistory;
    });
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setPlaces([]);
    
    try {
      const data = await geocodeLocation(query);
      if (data) {
        setLocation(data);
        addToHistory(query);
        setPlacesLoading(true);
        fetchNearbyPlaces(data.lat, data.lon, radius)
          .then(fetchedPlaces => setPlaces(fetchedPlaces))
          .catch(err => console.error(err))
          .finally(() => setPlacesLoading(false));
      } else {
        setError('Local não encontrado. Tente verificar o endereço ou CEP.');
      }
    } catch (err) {
      setError('Erro ao buscar localização. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = async (lat: number, lon: number) => {
    setLoading(true);
    setPlacesLoading(true);
    // Optimistic update
    setLocation(prev => prev ? { ...prev, lat, lon, display_name: 'Carregando endereço...' } : null);
    
    try {
      const data = await reverseGeocodeLocation(lat, lon);
      if (data) {
        setLocation(data);
        // Don't add to history for map clicks to avoid clutter? Or maybe yes?
        // Let's not add to history for now, or maybe add it.
        // The user asked to select location, so it acts like a search.
        // Let's add it.
        addToHistory(data.display_name);
        setInputValue(data.display_name); // Update input as well
        
        fetchNearbyPlaces(data.lat, data.lon, radius)
          .then(fetchedPlaces => setPlaces(fetchedPlaces))
          .catch(err => console.error(err))
          .finally(() => setPlacesLoading(false));
      }
    } catch (error) {
      console.error(error);
      setError('Erro ao identificar local.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    performSearch(inputValue);
  };

  const toggleCategory = (category: Category) => {
    setHighlightedCategory(prev => prev === category ? null : category);
  };

  const resetSearch = () => {
    setLocation(null);
    setInputValue('');
    setError('');
    setPlaces([]);
    setHighlightedCategory(null);
  };

  if (view === 'landing') {
    return <LandingPage onStart={() => setView('app')} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-40" 
           style={{
             backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
             backgroundSize: '24px 24px'
           }}>
      </div>

      {/* Back to Home Button (Optional, for navigation) */}
      <button 
        onClick={() => setView('landing')}
        className="absolute top-4 left-4 z-20 p-2 bg-card/80 backdrop-blur rounded-full hover:bg-card text-muted-foreground hover:text-foreground transition-colors shadow-sm border border-border"
        title="Voltar para Home"
      >
        <ArrowRight className="rotate-180" size={20} />
      </button>

      <AnimatePresence mode="wait">
        {!location ? (
          <motion.div 
            key="landing-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md z-10"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-light tracking-tight text-foreground mb-2">Vamos analisar seu Terreno</h1>
              <p className="text-muted-foreground text-sm">Digite o CEP ou o Endereço</p>
            </div>

            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-foreground transition-colors">
                <MapPin size={20} strokeWidth={1.5} />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ex: 01001-000 ou Av. Paulista, 1000"
                className="w-full pl-12 pr-14 py-4 bg-card rounded-2xl shadow-xl shadow-border/20 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-lg placeholder:text-muted-foreground/50"
                disabled={loading}
                autoComplete="street-address"
              />
              <button 
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="absolute inset-y-2 right-2 aspect-square flex items-center justify-center bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
              </button>
            </form>



            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-destructive/10 text-destructive rounded-xl text-sm text-center border border-destructive/20"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-7xl h-[90vh] bg-card rounded-3xl shadow-2xl shadow-border/20 overflow-hidden flex flex-col md:flex-row z-10 relative border border-border"
          >
            
            {/* Left Column (1/3) - Sidebar */}
            <div className="w-full md:w-1/3 bg-muted/30 border-r border-border p-6 flex flex-col gap-6 overflow-y-auto">
              
              {/* Header / New Search */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-light text-foreground">Localizador</h2>
                  <button onClick={resetSearch} className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground">
                    <X size={18} />
                  </button>
                </div>
                
                <form onSubmit={handleSearch} className="relative group mb-4">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Nova busca..."
                    className="w-full pl-10 pr-4 py-3 bg-card rounded-xl shadow-sm border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm"
                  />
                </form>

                {/* Radius Selector */}
                <div className="mb-6">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Raio de Análise</h3>
                  <div className="flex gap-2">
                    {[
                      { label: '800m', value: 800 },
                      { label: '1.5km', value: 1500 },
                      { label: '3km', value: 3000 }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRadius(opt.value)}
                        className={`
                          flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all border
                          ${radius === opt.value 
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                            : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'}
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* History */}
              {history.length > 0 && (
                <div className="border-b border-border pb-4">
                  <button 
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors"
                  >
                    <span>Histórico Recente</span>
                    <ChevronDown 
                      size={14} 
                      className={`transition-transform duration-200 ${isHistoryOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {isHistoryOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-2 pt-1">
                          {history.map((item) => (
                            <button
                              key={item.timestamp}
                              onClick={() => { setInputValue(item.query); performSearch(item.query); }}
                              className="flex items-center gap-3 px-3 py-2 bg-card hover:bg-muted border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition-all text-left group"
                            >
                              <History size={14} className="text-muted-foreground group-hover:text-foreground" />
                              <span className="truncate">{item.query}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Radar Chart Panel */}
              <div className="flex-1 min-h-[250px]">
                 <ServiceRadar places={places} />
                 
                 <div className="mt-4 grid grid-cols-2 gap-2">
                    {CATEGORIES.map(cat => {
                      const count = places.filter(p => p.category === cat).length;
                      return (
                        <div key={cat} className="bg-card p-3 rounded-xl border border-border shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[cat]}`}></div>
                            <span className="text-xs font-medium text-muted-foreground">{cat}</span>
                          </div>
                          <span className="text-sm font-bold text-foreground">{count}</span>
                        </div>
                      );
                    })}
                 </div>
              </div>

              {/* Location Info */}
              <div className="bg-primary text-primary-foreground p-4 rounded-xl mt-auto">
                <h3 className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider mb-1">Local Selecionado</h3>
                <p className="text-sm font-medium leading-relaxed">{location.display_name}</p>
              </div>

            </div>

            {/* Right Column (2/3) - Map */}
            <div className="w-full md:w-2/3 relative h-full">
               <Map 
                 lat={location.lat} 
                 lon={location.lon} 
                 displayName={location.display_name} 
                 places={places}
                 highlightedCategory={highlightedCategory}
                 radius={radius}
                 onLocationSelect={handleMapClick}
               />
               
               {/* Loading Overlay */}
               <AnimatePresence>
                 {placesLoading && (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 bg-background/50 backdrop-blur-sm z-[500] flex items-center justify-center"
                   >
                     <div className="bg-card px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border border-border">
                       <Loader2 className="animate-spin text-muted-foreground" size={20} />
                       <span className="text-sm font-medium text-foreground">Atualizando dados...</span>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Map Controls Overlay */}
               <div className="absolute bottom-6 left-6 right-6 pointer-events-none flex justify-end">
                 <div className="flex flex-wrap justify-end gap-2 pointer-events-auto max-w-full">
                   {CATEGORIES.map(category => {
                     const isHighlighted = highlightedCategory === category;
                     const isDimmed = highlightedCategory !== null && !isHighlighted;
                     
                     return (
                       <button
                         key={category}
                         onClick={() => toggleCategory(category)}
                         className={`
                           flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-sm border backdrop-blur-md
                           ${isHighlighted 
                             ? 'bg-card/90 text-foreground border-border shadow-md ring-1 ring-primary/20 scale-105' 
                             : isDimmed
                               ? 'bg-card/30 text-muted-foreground border-transparent hover:bg-card/50 grayscale'
                               : 'bg-card/60 text-muted-foreground border-transparent hover:bg-card/80'}
                         `}
                       >
                         <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[category]} ${isDimmed ? 'opacity-50' : ''}`} />
                         {category}
                       </button>
                     );
                   })}
                 </div>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
