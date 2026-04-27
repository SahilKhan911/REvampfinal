"use client";

import React, { useRef } from "react";
import "./InfiniteMovingCards.css";

export function InfiniteMovingCards({ items, className = "" }) {
  const trackRef = useRef(null);

  const handleMouseEnter = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const handleMouseLeave = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  const allItems = [...items, ...items];

  return (
    <div
      className={`testimonial-scroller overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        maskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, white 8%, white 92%, transparent)",
      }}
    >
      <ul ref={trackRef} className="testimonial-track">
        {allItems.map((item, idx) => (
          <li className="testimonial-card" key={idx}>
            <div className="testimonial-card-body">
              <span className="block text-sm leading-[1.7] text-gray-200">
                {item.quote}
              </span>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-1 h-8 rounded-full bg-[#0085FF] shrink-0" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white font-headline">
                    {item.name}
                  </span>
                  <span className="text-xs text-white/30 font-label tracking-wider">
                    {item.title}
                  </span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
