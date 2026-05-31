"use client";

import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface VenueMapProps {
    address: string;
    theme?: 'dark' | 'light' | 'sepia';
    className?: string;
}

const VenueMap: React.FC<VenueMapProps> = ({ address, theme = 'dark', className = "" }) => {
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    const externalUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

    const filterStyles = {
        dark: "invert(90%) hue-rotate(180deg) brightness(1.1) contrast(1.2) grayscale(0.2)",
        light: "grayscale(0.5) contrast(1.1)",
        sepia: "sepia(0.5) contrast(1.1) brightness(0.9)"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`relative group rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm ${className}`}
        >
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/60 pointer-events-none z-10"></div>

            <div className="relative aspect-video w-full overflow-hidden">
                <iframe
                    title="Venue Map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={mapUrl}
                    style={{ filter: filterStyles[theme] }}
                    className="transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 max-w-[60%]">
                    <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 truncate">
                        {address}
                    </span>
                </div>

                <a
                    href={externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-200 text-black rounded-full font-bold text-[9px] uppercase tracking-[0.2em] transition-all hover:scale-105 shadow-xl active:scale-95"
                >
                    Navigate <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </motion.div>
    );
};

export default VenueMap;
