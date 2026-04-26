import { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
    const [phase, setPhase] = useState(0);
    // phase 0: film strip masuk, phase 1: logo reveal, phase 2: progress, phase 3: fade out

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 400);
        const t2 = setTimeout(() => setPhase(2), 900);
        const t3 = setTimeout(() => setPhase(3), 2400);
        const t4 = setTimeout(() => onDone(), 2900);
        return () => [t1, t2, t3, t4].forEach(clearTimeout);
    }, [onDone]);

    return (
        <div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: '#0a0a0a',
                opacity: phase === 3 ? 0 : 1,
                transition: phase === 3 ? 'opacity 0.5s ease' : 'none',
                pointerEvents: phase === 3 ? 'none' : 'all',
            }}
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(229,9,20,0.12) 0%, transparent 70%)',
                        opacity: phase >= 1 ? 1 : 0,
                        transition: 'opacity 0.8s ease',
                    }}
                />
            </div>

            {/* Film strip top */}
            <FilmStrip position="top" visible={phase >= 0} />

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Clapperboard SVG animation */}
                <div
                    style={{
                        opacity: phase >= 1 ? 1 : 0,
                        transform: phase >= 1 ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(20px)',
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                >
                    <ClapperboardIcon phase={phase} />
                </div>

                {/* Logo text */}
                <div
                    className="text-center"
                    style={{
                        opacity: phase >= 1 ? 1 : 0,
                        transform: phase >= 1 ? 'translateY(0)' : 'translateY(16px)',
                        transition: 'all 0.5s ease 0.15s',
                    }}
                >
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
                        Cine<span style={{ color: '#e50914' }}>Pass</span>
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-[0.4em] mt-2" style={{ color: '#444444' }}>
                        Cinema Experience
                    </p>
                </div>

                {/* Progress bar */}
                <div
                    className="w-48 md:w-64"
                    style={{
                        opacity: phase >= 2 ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    <div className="h-px w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div
                            className="h-full rounded-full"
                            style={{
                                background: 'linear-gradient(to right, #e50914, #ff4444)',
                                width: phase >= 2 ? '100%' : '0%',
                                transition: phase >= 2 ? 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                                boxShadow: '0 0 8px rgba(229,9,20,0.6)',
                            }}
                        />
                    </div>
                    <p
                        className="text-center text-[9px] font-black uppercase tracking-[0.3em] mt-3 animate-pulse"
                        style={{ color: '#333333' }}
                    >
                        Loading...
                    </p>
                </div>
            </div>

            {/* Film strip bottom */}
            <FilmStrip position="bottom" visible={phase >= 0} />

            {/* Scan line effect */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
                }}
            />
        </div>
    );
}

function FilmStrip({ position, visible }) {
    const holes = Array.from({ length: 20 });
    const isTop = position === 'top';

    return (
        <div
            className={`absolute ${isTop ? 'top-0' : 'bottom-0'} left-0 right-0 h-14 flex items-center overflow-hidden`}
            style={{
                background: '#0d0d0d',
                borderBottom: isTop ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderTop: !isTop ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transform: visible ? 'translateY(0)' : isTop ? 'translateY(-100%)' : 'translateY(100%)',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            {/* Sprocket holes */}
            <div className="flex items-center gap-6 px-4 animate-film-scroll">
                {[...holes, ...holes].map((_, i) => (
                    <div
                        key={i}
                        className="w-5 h-8 rounded-sm flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.04)' }}
                    />
                ))}
            </div>
        </div>
    );
}

function ClapperboardIcon({ phase }) {
    return (
        <div className="relative w-24 h-24 md:w-28 md:h-28">
            {/* Outer glow ring */}
            <div
                className="absolute inset-0 rounded-3xl"
                style={{
                    background: 'rgba(229,9,20,0.15)',
                    boxShadow: phase >= 2 ? '0 0 40px rgba(229,9,20,0.4), 0 0 80px rgba(229,9,20,0.15)' : '0 0 20px rgba(229,9,20,0.2)',
                    transition: 'box-shadow 0.5s ease',
                }}
            />
            {/* Main box */}
            <div
                className="absolute inset-0 rounded-3xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e50914, #b8070f)' }}
            >
                {/* Clapperboard SVG */}
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                    {/* Board body */}
                    <rect x="6" y="18" width="40" height="28" rx="3" fill="white" fillOpacity="0.95" />
                    {/* Lines on board */}
                    <line x1="6" y1="26" x2="46" y2="26" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                    <line x1="6" y1="34" x2="46" y2="34" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
                    {/* Clapper top - animated */}
                    <g
                        style={{
                            transformOrigin: '6px 18px',
                            transform: phase >= 2 ? 'rotate(-20deg)' : 'rotate(0deg)',
                            transition: phase >= 2 ? 'transform 0.15s ease 0.8s' : 'none',
                        }}
                    >
                        <rect x="6" y="10" width="40" height="10" rx="2" fill="white" fillOpacity="0.9" />
                        {/* Diagonal stripes */}
                        <clipPath id="clip-clapper">
                            <rect x="6" y="10" width="40" height="10" rx="2" />
                        </clipPath>
                        <g clipPath="url(#clip-clapper)">
                            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                <rect key={i} x={-2 + i * 12} y="10" width="6" height="10"
                                    fill="rgba(229,9,20,0.85)" transform={`skewX(-20)`} />
                            ))}
                        </g>
                    </g>
                    {/* Play button */}
                    <polygon points="20,28 20,40 34,34" fill="rgba(229,9,20,0.7)" />
                </svg>
            </div>
        </div>
    );
}
