import React, { useRef, useEffect } from 'react';
import { MainTab } from '../types';
import { Menu, Search, X, Sparkles, MessageSquarePlus, UserPlus, CalendarPlus } from 'lucide-react';
import { DrMonitoraLogo } from './DrMonitoraLogo';

interface HeaderProps {
  mainTab: MainTab;
  onOpenSidebar: () => void;
  onOpenPrimaryCTA: () => void;
  onOpenSecondaryCTA?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalUniversalMatches?: number;
}

export const Header: React.FC<HeaderProps> = ({
  mainTab,
  onOpenSidebar,
  onOpenPrimaryCTA,
  onOpenSecondaryCTA,
  searchQuery,
  onSearchChange,
  totalUniversalMatches,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const metaByTab = {
    prestadores: {
      title: 'Prestadores de Serviços',
      ctaLabel: 'Novo Prestador',
      ctaIcon: UserPlus,
    },
    templates: {
      title: 'Templates OPA Atendimento',
      ctaLabel: 'Novo Template',
      ctaIcon: MessageSquarePlus,
    },
    regras: {
      title: 'Regras, Pontos Fixos & Agendas',
      ctaLabel: 'Novo Item',
      ctaIcon: CalendarPlus,
    },
  }[mainTab];

  const CtaIcon = metaByTab.ctaIcon;

  // Global Ctrl+K / Cmd+K focuses the single search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 px-4 sm:px-6 bg-[#080d16]/75 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between gap-3 sm:gap-6 sticky top-0 z-30 select-none shadow-[0_4px_25px_rgba(0,0,0,0.4)] relative">
      {/* Top subtle specular reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* Left: Sidebar Toggle & Brand Logo (Always visible open or closed) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="p-2 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center gap-2 shadow-xs active:scale-95 group cursor-pointer"
          aria-label="Abrir menu de navegação lateral"
          title="Abrir navegação lateral (Sidebar)"
        >
          <Menu className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
          <span className="text-xs font-semibold hidden sm:inline text-slate-300 group-hover:text-white">
            Menu
          </span>
        </button>

        {/* Official Brand Logo: always maintained with sidebar open or closed */}
        <div className="flex items-center gap-2">
          <DrMonitoraLogo size="sm" theme="dark" />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-400/30 font-mono shadow-[0_0_10px_rgba(59,130,246,0.2)] hidden sm:inline-block">
            OPA
          </span>
        </div>

        <div className="h-4 w-[1px] bg-white/10 hidden xl:block" />

        <span className="text-xs sm:text-sm font-semibold text-slate-300 tracking-tight truncate hidden xl:block">
          {metaByTab.title}
        </span>
      </div>

      {/* Center: THE ONLY UNIVERSAL SEARCH BAR IN THE APPLICATION */}
      <div className="flex-1 max-w-2xl relative">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
            <Search className="w-4 h-4" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Busca universal (técnico, código, template, KM, regra, ponto fixo)..."
            className="w-full pl-10 pr-24 py-2 bg-[#0c1220]/75 backdrop-blur-md text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl border border-white/10 hover:border-white/20 focus:border-blue-400/80 focus:ring-2 focus:ring-blue-500/25 focus:outline-none transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          />

          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Limpar busca"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-xs font-mono font-medium text-slate-300 bg-white/10 backdrop-blur-xs rounded-md border border-white/15 shadow-xs">
                Ctrl+K
              </kbd>
            )}

            {searchQuery && totalUniversalMatches !== undefined && (
              <span className="text-xs font-mono font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-400/30 shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                {totalUniversalMatches}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {mainTab === 'templates' && onOpenSecondaryCTA && (
          <button
            type="button"
            onClick={onOpenSecondaryCTA}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-b from-[#182236]/80 to-[#101726]/80 hover:from-[#202d48]/80 hover:to-[#141d30]/80 text-slate-200 hover:text-white border border-white/10 text-xs font-medium transition-all shadow-xs active:scale-[0.98]"
            title="Preencher variáveis dinâmicas em formulário guiado"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Preencher Mensagem</span>
          </button>
        )}

        {/* Primary CTA with 3D glass effect */}
        <button
          type="button"
          onClick={onOpenPrimaryCTA}
          className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 active:scale-[0.98] text-white text-xs font-semibold shadow-[0_4px_14px_rgba(37,99,235,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] border-t border-blue-300/40 border-b border-blue-800 transition-all cursor-pointer whitespace-nowrap"
        >
          <CtaIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{metaByTab.ctaLabel}</span>
          <span className="sm:hidden">Novo</span>
        </button>
      </div>
    </header>
  );
};
