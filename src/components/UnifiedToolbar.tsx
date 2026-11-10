import React from 'react';
import { ViewMode } from '../types';
import {
  MapPin,
  LayoutGrid,
  Table as TableIcon,
  Terminal,
  Filter,
} from 'lucide-react';

interface UnifiedToolbarProps {
  selectedRegion: string | null;
  onSelectRegion: (reg: string | null) => void;
  regions: { regiao: string; count: number }[];
  resultCount: number;
  totalCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const QUICK_MACRO_REGIONS = [
  { label: 'Todas', val: null },
  { label: 'Leste', val: 'LESTE 1' },
  { label: 'Oeste', val: 'OESTE 1' },
  { label: 'Norte', val: 'NORTE 1' },
  { label: 'Sul', val: 'SUL 1' },
  { label: 'Campinas', val: 'CAMPINAS 1' },
  { label: 'Sorocaba', val: 'SOROCABA' },
  { label: 'ABC', val: 'ABC 1' },
];

export const UnifiedToolbar: React.FC<UnifiedToolbarProps> = ({
  selectedRegion,
  onSelectRegion,
  regions,
  resultCount,
  totalCount,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="bg-[#0e1424]/70 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.06)] relative overflow-hidden">
      {/* Top subtle reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      {/* Left: Quick Region Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 relative z-10">
        <span className="text-slate-400 font-medium text-xs flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Região:</span>
        </span>

        {QUICK_MACRO_REGIONS.map((chip) => {
          const isActive =
            (chip.val === null && !selectedRegion) ||
            selectedRegion === chip.val;

          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSelectRegion(chip.val)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white border-t border-blue-300/40 border-b border-blue-900 shadow-[0_3px_10px_rgba(37,99,235,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'bg-[#090d16]/70 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 hover:border-white/10'
              }`}
            >
              {chip.label}
            </button>
          );
        })}

        {selectedRegion && (
          <button
            type="button"
            onClick={() => onSelectRegion(null)}
            className="text-xs text-blue-400 hover:text-blue-300 underline ml-1 transition-colors font-medium"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Right: Detailed Select Dropdown & View Mode Switcher */}
      <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-end relative z-10">
        {/* Detailed Region Dropdown in Glass */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <select
            value={selectedRegion || ''}
            onChange={(e) => onSelectRegion(e.target.value || null)}
            className="appearance-none pl-8 pr-7 py-1.5 bg-[#090d16]/80 text-slate-200 text-xs rounded-xl border border-white/10 hover:border-white/20 focus:border-blue-400/80 focus:outline-none cursor-pointer font-medium transition-all shadow-inner"
          >
            <option value="">Todas as Regiões ({totalCount})</option>
            {regions.map((r) => (
              <option key={r.regiao} value={r.regiao}>
                {r.regiao} ({r.count})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Total Count */}
        <span className="text-xs text-slate-400 font-mono hidden sm:inline">
          {resultCount} prestadores
        </span>

        {/* View Mode Segmented Controls - Glass Dock */}
        <div className="inline-flex p-1 bg-[#090d16]/80 backdrop-blur-md border border-white/10 rounded-xl shrink-0 shadow-inner">
          <button
            type="button"
            onClick={() => onViewModeChange('cards')}
            title="Visualização em Cards"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'cards'
                ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('table')}
            title="Visualização em Tabela"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TableIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('terminal')}
            title="Visualização em Terminal Rápido"
            className={`p-1.5 rounded-lg transition-all ${
              viewMode === 'terminal'
                ? 'bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
