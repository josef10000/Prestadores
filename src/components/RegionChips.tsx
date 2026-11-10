import React from 'react';
import { MapPin } from 'lucide-react';

interface RegionChipsProps {
  regions: { regiao: string; count: number }[];
  selectedRegion: string | null;
  onSelectRegion: (reg: string | null) => void;
  totalCount: number;
}

export const RegionChips: React.FC<RegionChipsProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  totalCount,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2.5">
        <MapPin className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Filtrar por Região / Base
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <button
          type="button"
          onClick={() => onSelectRegion(null)}
          className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
            selectedRegion === null
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <span>Todas as Regiões</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
              selectedRegion === null ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {totalCount}
          </span>
        </button>

        {regions.map((r) => {
          const isSelected = selectedRegion === r.regiao;
          return (
            <button
              key={r.regiao}
              type="button"
              onClick={() => onSelectRegion(isSelected ? null : r.regiao)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{r.regiao}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${
                  isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {r.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
