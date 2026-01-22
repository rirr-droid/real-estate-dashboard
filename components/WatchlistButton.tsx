"use client";

import { useState, useEffect } from "react";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";

interface WatchlistButtonProps {
  metroId: string;
  size?: "sm" | "md" | "lg";
}

export default function WatchlistButton({ metroId, size = "md" }: WatchlistButtonProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsWatched(isInWatchlist(metroId));
  }, [metroId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWatched) {
      removeFromWatchlist(metroId);
      setIsWatched(false);
    } else {
      addToWatchlist(metroId);
      setIsWatched(true);
    }
  };

  if (!mounted) return null;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={handleToggle}
      className={`${sizeClasses[size]} ${
        isWatched
          ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-2 border-yellow-400"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300"
      } rounded-lg font-semibold transition-all`}
      title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
    >
      {isWatched ? "⭐ Watching" : "☆ Watch"}
    </button>
  );
}
