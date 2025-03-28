"use client";

import { useEffect, useState } from "react";

const InstagramFeed = () => {
    const [mounted, setMounted] = useState(false);
    const username = "artisan.education";
    
    useEffect(() => {
        setMounted(true);
        
        // Instagram requires this script to process embeds
        const script = document.createElement("script");
        script.src = "//www.instagram.com/embed.js";
        script.async = true;
        
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
            if (window.instgrm) {
                delete window.instgrm;
            }
        };
    }, []);

    return (
        <div className="bg-white rounded-xl border border-slate-300 p-8 h-full flex flex-col">
            <div className="flex-1 w-full rounded-xl overflow-hidden border border-slate-200">
                {mounted ? (
                    <blockquote 
                        className="instagram-media" 
                        data-instgrm-permalink={`https://www.instagram.com/${username}/`}
                        data-instgrm-version="14"
                        style={{
                            background: "#FFF",
                            margin: "0",
                            padding: "0",
                            width: "100%",
                            height: "100%"
                        }}
                    >
                        <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                            <div className="w-8 h-8 border-4 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        </div>
                    </blockquote>
                ) : null}
            </div>
        </div>
    );
};

export default InstagramFeed;

// Add TypeScript type definition
declare global {
    interface Window {
        instgrm?: unknown;
    }
} 