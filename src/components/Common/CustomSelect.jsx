import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function CustomSelect({ options = [], value, onChange, placeholder = "Pilih opsi...", label, loading = false, error = null }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find(opt => String(opt.id) === String(value));

    useEffect(() => {
        const handleClickOutside = (event) => {
            const isInsideRef = dropdownRef.current && dropdownRef.current.contains(event.target);
            const isInsidePortal = event.target.closest('.custom-select-portal');
            if (!isInsideRef && !isInsidePortal) setIsOpen(false);
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        (opt.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option.id);
        setIsOpen(false);
        setSearchTerm("");
    };

    const toggleDropdown = () => {
        if (!loading) {
            const rect = dropdownRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="space-y-2 relative" ref={dropdownRef}>
            {label && (
                <label className="text-[10px] font-black uppercase tracking-widest ml-1" style={{ color: '#e50914' }}>
                    {label}
                </label>
            )}

            <div
                onClick={toggleDropdown}
                className={`w-full px-4 py-3.5 rounded-xl cursor-pointer flex items-center justify-between transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: isOpen
                        ? '1px solid rgba(229,9,20,0.5)'
                        : error
                            ? '1px solid rgba(248,113,113,0.5)'
                            : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isOpen ? '0 0 0 3px rgba(229,9,20,0.08)' : 'none',
                }}
            >
                <span className="text-sm font-medium truncate" style={{ color: selectedOption ? '#ffffff' : '#555555' }}>
                    {loading ? 'Memuat data...' : (selectedOption ? selectedOption.name : placeholder)}
                </span>
                <ChevronRight
                    className="w-4 h-4 flex-shrink-0 ml-2 transition-transform duration-300"
                    style={{ color: '#555555', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                />
            </div>

            {isOpen && createPortal(
                <div
                    className="custom-select-portal"
                    style={{
                        position: 'absolute',
                        top: `${coords.top + 6}px`,
                        left: `${coords.left}px`,
                        width: `${coords.width}px`,
                        zIndex: 9999,
                        background: '#111111',
                        border: '1px solid rgba(229,9,20,0.2)',
                        borderRadius: '16px',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
                        overflow: 'hidden',
                    }}
                >
                    {/* Search */}
                    <div className="p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#555555' }} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari..."
                                className="w-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none transition-all rounded-lg"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.4)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {/* Options */}
                    <div className="max-h-56 overflow-y-auto no-scrollbar py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                                const isSelected = String(option.id) === String(value);
                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => handleSelect(option)}
                                        className="px-5 py-3 text-sm font-medium flex items-center justify-between cursor-pointer transition-all"
                                        style={{
                                            background: isSelected ? 'rgba(229,9,20,0.1)' : 'transparent',
                                            color: isSelected ? '#e50914' : '#888888',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#ffffff'; } }}
                                        onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888888'; } }}
                                    >
                                        <span className="truncate">{option.name}</span>
                                        {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 ml-2" style={{ color: '#e50914' }} />}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="px-6 py-8 text-center text-xs italic" style={{ color: '#444444' }}>
                                Tidak ada hasil ditemukan
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {error && (
                <p className="text-[10px] font-bold uppercase tracking-widest ml-1 italic" style={{ color: '#f87171' }}>
                    {error}
                </p>
            )}
        </div>
    );
}
