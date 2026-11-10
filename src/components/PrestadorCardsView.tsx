import React, { useState } from 'react';
import { Prestador } from '../types';
import { Copy, Check, Edit2, Trash2, Phone, Star, MapPin, Hash, ExternalLink } from 'lucide-react';
import { getRegionColor } from '../utils/search';
import { Pagination } from './Pagination';
import { WhatsAppIcon } from './WhatsAppIcon';
import { getWhatsAppUrl, cleanPhoneNumber, openWhatsApp, WHATSAPP_TAB_NAME } from '../utils/whatsapp';

interface PrestadorCardsViewProps {
  prestadores: Prestador[];
  onEdit: (p: Prestador) => void;
  onDelete: (id: string) => void;
  onCopySuccess: (text: string) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return (name.slice(0, 2) || 'PR').toUpperCase();
}

const GLOW_COLOR_MAP: Record<
  string,
  {
    radial: string;
    avatarGrad: string;
    avatarBorder: string;
    badgeBorder: string;
    badgeGlow: string;
    pillBg: string;
  }
> = {
  emerald: {
    radial: 'bg-emerald-500',
    avatarGrad: 'from-emerald-600/30 via-slate-800 to-slate-900',
    avatarBorder: 'border-emerald-500/50 text-emerald-300',
    badgeBorder: 'border-emerald-500/40',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.18)]',
    pillBg: 'from-emerald-950/60 to-slate-900',
  },
  amber: {
    radial: 'bg-amber-500',
    avatarGrad: 'from-amber-600/30 via-slate-800 to-slate-900',
    avatarBorder: 'border-amber-500/50 text-amber-300',
    badgeBorder: 'border-amber-500/40',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.18)]',
    pillBg: 'from-amber-950/60 to-slate-900',
  },
  sky: {
    radial: 'bg-sky-500',
    avatarGrad: 'from-sky-600/30 via-slate-800 to-slate-900',
    avatarBorder: 'border-sky-500/50 text-sky-300',
    badgeBorder: 'border-sky-500/40',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(14,165,233,0.18)]',
    pillBg: 'from-sky-950/60 to-slate-900',
  },
  purple: {
    radial: 'bg-purple-500',
    avatarGrad: 'from-purple-600/30 via-slate-800 to-slate-900',
    avatarBorder: 'border-purple-500/50 text-purple-300',
    badgeBorder: 'border-purple-500/40',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.18)]',
    pillBg: 'from-purple-950/60 to-slate-900',
  },
  rose: {
    radial: 'bg-rose-500',
    avatarGrad: 'from-rose-600/30 via-slate-800 to-slate-900',
    avatarBorder: 'border-rose-500/50 text-rose-300',
    badgeBorder: 'border-rose-500/40',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(244,63,94,0.18)]',
    pillBg: 'from-rose-950/60 to-slate-900',
  },
  blue: {
    radial: 'bg-blue-500',
    avatarGrad: 'from-blue-600/30 via-slate-800 to-slate-900',
    avatarBorder: 'border-blue-500/50 text-blue-300',
    badgeBorder: 'border-blue-500/40',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.18)]',
    pillBg: 'from-blue-950/60 to-slate-900',
  },
  slate: {
    radial: 'bg-slate-500',
    avatarGrad: 'from-slate-700/40 via-slate-800 to-slate-900',
    avatarBorder: 'border-slate-600/60 text-slate-300',
    badgeBorder: 'border-slate-700/60',
    badgeGlow: 'hover:shadow-[0_0_20px_rgba(148,163,184,0.12)]',
    pillBg: 'from-slate-850 to-slate-900',
  },
};

export const PrestadorCardsView: React.FC<PrestadorCardsViewProps> = ({
  prestadores,
  onEdit,
  onDelete,
  onCopySuccess,
  favorites,
  onToggleFavorite,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const itemsPerPage = 12;

  // Reset to page 1 if prestadores count changes and current page is out of bounds
  const totalPages = Math.ceil(prestadores.length / itemsPerPage);
  const effectivePage = Math.min(currentPage, Math.max(1, totalPages));

  const startIndex = (effectivePage - 1) * itemsPerPage;
  const paginatedList = prestadores.slice(startIndex, startIndex + itemsPerPage);

  const handleCopy = (p: Prestador) => {
    const text = `${p.codigo} - ${p.nome} - ${p.regiao}`;
    navigator.clipboard.writeText(text);
    setCopiedId(p.id);
    onCopySuccess(`Copiado: ${text}`);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (prestadores.length === 0) {
    return (
      <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-12 text-center max-w-lg mx-auto my-8 shadow-lg">
        <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white">Nenhum prestador encontrado</h3>
        <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
          Tente ajustar os termos da busca ou selecione outra região para visualizar os técnicos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedList.map((p) => {
          const isCopied = copiedId === p.id;
          const color = getRegionColor(p.regiao);
          const isFav = favorites.includes(p.id);
          const initials = getInitials(p.nome);
          const glowStyles = GLOW_COLOR_MAP[color.glow] || GLOW_COLOR_MAP.slate;

          return (
            <div
              key={p.id}
              className={`relative rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 ease-out
                bg-gradient-to-b from-[#141b2b] via-[#101623] to-[#0c101a]
                border border-slate-800/90 hover:border-slate-700/80
                border-t-slate-700/70 hover:border-t-white/20
                shadow-[0_10px_24px_-6px_rgba(0,0,0,0.65),inset_0_1px_1px_rgba(255,255,255,0.06)]
                hover:shadow-[0_22px_45px_-10px_rgba(0,0,0,0.9)]
                ${glowStyles.badgeGlow}
                hover:-translate-y-1.5 overflow-hidden`}
            >
              {/* 3D Ambient Region Glow effect in top right corner */}
              <div
                className={`absolute -top-14 -right-14 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${glowStyles.radial}`}
              />

              {/* Top Specular 3D Reflection Line */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              <div className="relative z-10">
                {/* Top Row: Region & Code + Subtle 3D Top-Right Action Toolbar */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-300 bg-gradient-to-b from-[#182030] to-[#0e1422] px-2.5 py-1 rounded-lg border border-slate-700/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.4)]">
                      #{p.codigo}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono uppercase tracking-wide border ${glowStyles.badgeBorder} bg-gradient-to-b ${glowStyles.pillBg} ${color.text} shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_2px_4px_rgba(0,0,0,0.3)]`}
                    >
                      <MapPin className="w-3.5 h-3.5 opacity-80" />
                      {p.regiao}
                    </span>
                  </div>

                  {/* Top Right: Subtle Utility Actions (Favorite, Edit, Delete) with tactile feel */}
                  <div className="flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(p.id)}
                      title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
                      className={`p-1.5 rounded-lg transition-all active:scale-90 ${
                        isFav
                          ? 'text-amber-400 bg-amber-500/15 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                          : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      title="Editar prestador"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all active:scale-90"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(p.id)}
                      title="Excluir prestador"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all active:scale-90"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main Body: Sculpted 3D Avatar + Name + Contact Dock */}
                <div className="flex items-start gap-3.5 my-2">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${glowStyles.avatarGrad} border ${glowStyles.avatarBorder} flex items-center justify-center font-bold font-mono text-xs shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_4px_10px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-200`}
                  >
                    {initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="text-base font-bold text-white tracking-tight leading-snug truncate group-hover:text-blue-100 transition-colors"
                      title={p.nome}
                    >
                      {p.nome}
                    </h3>

                    {/* 3D Sunken Dock for Phone & Instant Copy */}
                    {p.telefone ? (
                      <div className="flex items-center justify-between gap-2 mt-2 p-1.5 px-2 rounded-xl bg-gradient-to-b from-[#080d16] to-[#0c121e] border border-slate-800/90 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-md bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 shadow-xs">
                            <Phone className="w-3 h-3 text-emerald-400" />
                          </div>
                          <a
                            href={`tel:${p.telefone}`}
                            className="text-xs font-mono font-medium text-slate-300 hover:text-white transition-colors truncate tracking-wide"
                          >
                            {p.telefone}
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(p.telefone!);
                            setCopiedId(`phone-${p.id}`);
                            onCopySuccess(`Telefone ${p.telefone} copiado!`);
                            setTimeout(() => {
                              setCopiedId((curr) => (curr === `phone-${p.id}` ? null : curr));
                            }, 1800);
                          }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 shrink-0 shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] ${
                            copiedId === `phone-${p.id}`
                              ? 'bg-emerald-600 text-white border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                              : 'bg-gradient-to-b from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-850 text-sky-300 border border-slate-700/80 hover:border-sky-500/40'
                          }`}
                          title="Copiar apenas o telefone"
                        >
                          {copiedId === `phone-${p.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-white" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-sky-400" />
                              <span>Copiar Tel</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 mt-2 italic px-1">
                        Sem telefone cadastrado
                      </div>
                    )}

                    {/* Observação: Sunken Plate Look */}
                    {p.observacao && (
                      <div className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed bg-gradient-to-b from-[#080d16] to-[#0c111c] p-2.5 rounded-xl border border-slate-800/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
                        {p.observacao}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Integrated Bottom Actions: 3D Tactile Buttons */}
              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center gap-2.5 relative z-10">
                <button
                  type="button"
                  onClick={() => handleCopy(p)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.97] shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] ${
                    isCopied
                      ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white border-t border-emerald-300/40 border-b border-emerald-800 shadow-[0_4px_12px_rgba(16,185,129,0.3)]'
                      : 'bg-gradient-to-b from-[#1c2436] to-[#121826] hover:from-[#222c42] hover:to-[#161e30] text-slate-200 border border-slate-700/80 hover:border-slate-600 border-t-white/10'
                  }`}
                  title="Copiar dados formatados para colar no atendimento"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      <span>Copiar Dados</span>
                    </>
                  )}
                </button>

                {p.telefone && cleanPhoneNumber(p.telefone) ? (
                  <a
                    href={getWhatsAppUrl(p.telefone, p.nome, p.codigo)}
                    target={WHATSAPP_TAB_NAME}
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      openWhatsApp(p.telefone!, p.nome, p.codigo);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.97] cursor-pointer
                      bg-gradient-to-b from-[#12a150] via-[#0d8e44] to-[#097737] hover:from-[#15b259] hover:via-[#109e4d] hover:to-[#0a853e]
                      text-white border-t border-emerald-300/40 border-b border-emerald-950
                      shadow-[0_4px_14px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]"
                    title={`Abrir WhatsApp com ${p.nome}`}
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 drop-shadow-xs" />
                    <span>WhatsApp</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => onEdit(p)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 bg-[#0e1422] hover:bg-[#141b2e] text-slate-400 hover:text-slate-200 border border-dashed border-slate-800 hover:border-slate-700 transition-all active:scale-[0.98]"
                    title="Adicionar telefone"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span>+ Contato</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={effectivePage}
        totalItems={prestadores.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
