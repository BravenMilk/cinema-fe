import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, lastPage, onPageChange, loading }) {
    if (lastPage <= 1) return null;

    const pages = [];
    for (let i = 1; i <= lastPage; i++) {
        if (
            i === 1 ||
            i === lastPage ||
            (i >= page - 1 && i <= page + 1)
        ) {
            pages.push(i);
        } else if (i === page - 2 || i === page + 2) {
            pages.push('...' + i);
        }
    }

    return (
        <div className="flex items-center justify-center gap-3 py-8">
            {/* Prev */}
            <button
                disabled={page === 1 || loading}
                onClick={() => onPageChange(page - 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#aaaaaa' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = '#e50914'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#e50914'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#aaaaaa'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers pill */}
            <div className="flex items-center gap-1 px-2 py-1.5 rounded-full"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {pages.map((p) => {
                    if (typeof p === 'string') {
                        return (
                            <span key={p} className="w-8 text-center text-xs font-bold" style={{ color: '#444444' }}>
                                ...
                            </span>
                        );
                    }
                    const isActive = p === page;
                    return (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className="w-8 h-8 rounded-full text-xs font-black transition-all"
                            style={isActive
                                ? { background: '#e50914', color: '#ffffff', boxShadow: '0 0 14px rgba(229,9,20,0.5)' }
                                : { color: '#888888', background: 'transparent' }
                            }
                            onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#ffffff'; }}
                            onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#888888'; }}
                        >
                            {p}
                        </button>
                    );
                })}
            </div>

            {/* Next */}
            <button
                disabled={page >= lastPage || loading}
                onClick={() => onPageChange(page + 1)}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                style={{ background: '#e50914', color: '#ffffff', border: '1px solid #e50914', boxShadow: '0 0 14px rgba(229,9,20,0.4)' }}
                onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#ff1a1a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#e50914'; }}
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
