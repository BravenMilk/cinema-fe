import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Search, X, Check } from 'lucide-react';
import { createPortal } from 'react-dom';

/**
 * CustomSelect Component
 * @param {Array} options - [{ id, name }]
 * @param {String|Number} value - Currently selected ID
 * @param {Function} onChange - Callback (value)
 * @param {String} placeholder - Placeholder text
 * @param {String} label - Label text
 * @param {Boolean} loading - Loading state
 * @param {String} error - Error message
 */
export default function CustomSelect({ options = [], value, onChange, placeholder = "Pilih opsi...", label, loading = false, error = null}) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find(opt => String(opt.id) === String(value));

   useEffect(() => {
    const handleClickOutside = (event) => {
        // Cek apakah klik terjadi di dalam container utama (dropdownRef)
        const isInsideRef = dropdownRef.current && dropdownRef.current.contains(event.target);
        
        // Cek apakah klik terjadi di dalam portal (menggunakan class atau ID unik)
        // Karena portal Anda tidak punya ref, kita bisa cek melalui class selector
        const isInsidePortal = event.target.closest('.custom-select-portal');

        if (!isInsideRef && !isInsidePortal) {
            setIsOpen(false);
        }
    };

    // Gunakan 'click' alih-alih 'mousedown' agar tidak mendahului event internal
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
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] ml-1">
                    {label}
                </label>
            )}

            <div onClick={toggleDropdown}
                className={` w-full px-6 py-3 bg-white/10 border  rounded-2xl cursor-pointer flex items-center justify-between transition-all group 
                    ${isOpen ? 'border-indigo-500/50 ring-2 ring-indigo-500/20' : 'border-white/10 hover:border-white/10'}
                    ${error ? 'border-rose-500/50' : ''}
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                <span className={`font-medium ${selectedOption ? 'text-white' : 'text-slate-500'}`}>
                    {loading ? 'Memuaskan data...' : (selectedOption ? selectedOption.name : placeholder)}
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </div>

            {isOpen && createPortal(
                <div 
                    style={{ 
                        position: 'absolute', 
                        top: `${coords.top + 8}px`, 
                        left: `${coords.left}px`, 
                        width: `${coords.width}px`,
                        zIndex: 9999 
                    }}
                    className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="p-4 border-b border-white/10 bg-black/20">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all" onClick={(e) => e.stopPropagation()}/>
                        </div>
                    </div>

                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div key={option.id} onClick={() => handleSelect(option)}
                                    className={`
                                        px-6 py-4 text-sm font-medium flex items-center justify-between cursor-pointer transition-colors
                                        ${String(option.id) === String(value) ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:bg-white/10 hover:text-white'}
                                    `}
                                >
                                    {option.name}
                                    {String(option.id) === String(value) && <Check className="w-4 h-4 text-indigo-400" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-8 text-center text-slate-500 italic text-xs">
                                Tidak ada hasil ditemukan
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {error && <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest ml-1 italic">{error}</p>}
        </div>
    );
}
