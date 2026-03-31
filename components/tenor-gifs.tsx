"use client";

import Script from "next/script";
import { useState, useEffect } from "react";

const ALL_GIFS = [
  { id: "14670074772528315829", title: "Bubu Dudu sad", ratio: "1", caption: "vrinda when no meds" },
  { id: "25076921", title: "Piplup excited", ratio: "1", caption: "vrinda when meds taste good" },
  { id: "16389117880733168852", title: "Snorlax eating", ratio: "1.34969", caption: "vrinda every morning" },
  { id: "9406698208260770694", title: "Bubu dancing", ratio: "1.0375", caption: "all meds taken!!" },
  { id: "21630277", title: "Pikachu hi", ratio: "1.12676", caption: "hi vrinda!!" },
  { id: "2972827856134174678", title: "Bubu cheek pinch", ratio: "1", caption: "awww cumtie" },
  { id: "13637251128391806652", title: "Pikahappy", ratio: "1.46667", caption: "pom pom dabadoge" },
  { id: "9540639066796771587", title: "Miss you", ratio: "1.25126", caption: "take ur meds pls" },
  { id: "25108898", title: "Pikachu Piplup stroll", ratio: "1.77778", caption: "morning walk after meds" },
  { id: "9449964773587340375", title: "Captain Pikachu nod", ratio: "0.87751", caption: "good job vrinda" },
  { id: "8113361418257719338", title: "Happy dance", ratio: "1", caption: "soturu vanshika" },
  { id: "19799291", title: "Happy gif", ratio: "1.44796", caption: "meds kha li!!" },
  { id: "11621016293007281394", title: "Rexx meme", ratio: "1.07328", caption: "alasi panda energy" },
  { id: "21049112", title: "Bart Simpson dance", ratio: "1.33891", caption: "vrinda doing literally nothing" },
  { id: "8881886906064729601", title: "Tom & Jerry chaos", ratio: "1.5", caption: "medicine time energy" },
  { id: "26736081", title: "Tom And Jerry", ratio: "1.03896", caption: "vrinda vs the medicine" },
  { id: "26736073", title: "Tom And Jerry 2", ratio: "1.18081", caption: "when meds dont taste good" },
  { id: "5701243", title: "Bleh tongue out", ratio: "1", caption: "vrinda after taking meds" },
  { id: "14423142", title: "What Oh No", ratio: "1.87135", caption: "when vanshika reminds her again" },
];

// Fisher-Yates shuffle (seeded by day to be consistent per day)
function shuffleByDay(arr: typeof ALL_GIFS) {
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = ((seed * (i + 1) * 31337) % (i + 1) + (i + 1)) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function TenorGifGrid() {
  const [gifs, setGifs] = useState(ALL_GIFS);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    setGifs(shuffleByDay(ALL_GIFS));
  }, []);

  // Re-run Tenor's embed processor whenever script loads or gifs change
  useEffect(() => {
    if (scriptLoaded && typeof window !== "undefined" && (window as { __tenor_gif_loaded?: boolean }).__tenor_gif_loaded) {
      // Tenor script re-processes on page visibility or DOM changes in some cases
      // Trigger by dispatching a custom event
      window.dispatchEvent(new Event("tenor-reload"));
    }
  }, [scriptLoaded, gifs]);

  return (
    <>
      <div className="columns-2 gap-3">
        {gifs.map((gif) => (
          <div key={gif.id} className="break-inside-avoid mb-3">
            <div
              className="card overflow-hidden border border-purple-100 hover:scale-[1.02] transition-transform cursor-pointer"
              style={{ boxShadow: "0 4px 0 #e9d5ff" }}
            >
              <div
                className="tenor-gif-embed w-full"
                data-postid={gif.id}
                data-share-method="host"
                data-aspect-ratio={gif.ratio}
                data-width="100%"
              >
                <a href={`https://tenor.com/view/${gif.id}`} target="_blank" rel="noreferrer">
                  {gif.title}
                </a>
              </div>
              <div className="px-3 py-2 bg-white">
                <p className="text-xs font-semibold text-purple-600 italic truncate">
                  {gif.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Script
        src="https://tenor.com/embed.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
    </>
  );
}
