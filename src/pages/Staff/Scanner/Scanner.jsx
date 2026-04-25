import React, { useState } from 'react';
import { ShieldCheck, Loader2, Ticket, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStaffScanner } from '../../../hooks/staff/useStaffScanner';

export default function Scanner() {
    const { handleScan, loading, scanResult, error, resetScan } = useStaffScanner();
    const [serialInput, setSerialInput] = useState("");

    const onFinish = async (e) => {
        e.preventDefault();
        if (!serialInput) return;
        try {
            await handleScan(serialInput);
            setSerialInput("");
        } catch (err) {}
    };

    return (
        <div className="p-6 md:p-10 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                <div className="space-y-6">
                    <form onSubmit={onFinish} className="p-8 rounded-2xl relative overflow-hidden"
                        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5" style={{ background: '#e50914' }}></div>

                        <label className="text-xs font-black uppercase tracking-widest mb-4 block ml-2" style={{ color: '#a0a0a0' }}>
                            Ticket Serial Number
                        </label>
                        <div className="relative group">
                            <Ticket className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors" style={{ color: '#555555' }} />
                            <input
                                type="text"
                                value={serialInput}
                                onChange={(e) => setSerialInput(e.target.value)}
                                placeholder="e.g. SN-ABCD12345EFG"
                                className="w-full rounded-2xl pl-14 pr-6 py-5 text-lg font-black tracking-widest text-white uppercase focus:outline-none transition-all"
                                style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.08)' }}
                                onFocus={e => { e.target.style.borderColor = 'rgba(229,9,20,0.5)'; e.target.style.boxShadow = '0 0 0 4px rgba(229,9,20,0.08)'; }}
                                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !serialInput}
                            className="w-full mt-5 py-5 font-black rounded-2xl transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: '#e50914', color: '#ffffff', boxShadow: '0 8px 24px rgba(229,9,20,0.2)' }}
                            onMouseEnter={e => { if (!loading && serialInput) e.currentTarget.style.background = '#ff1a1a'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#e50914'; }}>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                            Verify Ticket
                        </button>
                    </form>

                    <div className="p-6 rounded-2xl flex items-center gap-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <AlertCircle className="w-7 h-7" style={{ color: '#555555' }} />
                        </div>
                        <div>
                            <h4 className="text-white font-black uppercase text-xs tracking-tight">Need QR Scanning?</h4>
                            <p className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color: '#555555' }}>Connect a USB QR Scanner for faster workflow</p>
                        </div>
                    </div>
                </div>

                <div className="min-h-[400px]">
                    {!scanResult && !error ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-2xl"
                            style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <Ticket className="w-10 h-10" style={{ color: '#333333' }} />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-sm" style={{ color: '#333333' }}>Waiting for Scan</h3>
                            <p className="text-xs font-bold uppercase tracking-widest mt-2" style={{ color: '#2a2a2a' }}>Enter a serial number to see verification status</p>
                        </div>
                    ) : error ? (
                        <div className="p-10 rounded-2xl flex flex-col items-center text-center gap-6"
                            style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
                            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-2xl"
                                style={{ background: '#f87171', boxShadow: '0 20px 60px rgba(248,113,113,0.2)' }}>
                                <AlertCircle className="w-10 h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight" style={{ color: '#f87171' }}>Verification Failed</h3>
                                <p className="text-xs font-black uppercase tracking-widest mt-2 px-4 py-2 rounded-full inline-block"
                                    style={{ color: 'rgba(248,113,113,0.8)', background: 'rgba(248,113,113,0.1)' }}>{error}</p>
                            </div>
                            <button onClick={resetScan}
                                className="text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2"
                                style={{ color: '#555555' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                                onMouseLeave={e => e.currentTarget.style.color = '#555555'}>
                                <Loader2 className="w-4 h-4" /> Reset Output
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 rounded-2xl flex flex-col gap-6"
                            style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)' }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
                                        style={{ background: '#22c55e', boxShadow: '0 8px 24px rgba(34,197,94,0.2)' }}>
                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight leading-none" style={{ color: '#4ade80' }}>Ticket Valid</h3>
                                        <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: 'rgba(74,222,128,0.5)' }}>Ready for entrance</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#555555' }}>
                                    {scanResult.data.ticket_serial}
                                </span>
                            </div>

                            <div className="p-6 rounded-2xl space-y-4" style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <div>
                                    <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Customer Name</span>
                                    <p className="text-white font-black uppercase tracking-tight">{scanResult.data.booking?.user?.name || 'Anonymous'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Hall / Room</span>
                                        <p className="font-black uppercase" style={{ color: '#e50914' }}>{scanResult.data.booking?.showtime?.hall?.name || 'Standard'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#555555' }}>Seat Number</span>
                                        <p className="font-black uppercase" style={{ color: '#fbbf24' }}>{scanResult.data.seat?.row_label}{scanResult.data.seat?.seat_number}</p>
                                    </div>
                                </div>
                            </div>

                            <button onClick={resetScan}
                                className="w-full py-4 font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#ffffff' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                                Scan Next Ticket <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
