"use client";

import { useEffect, useState } from "react";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window));
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (!isIOS || isStandalone) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 rounded-xl border bg-background p-4 shadow-lg">
      <p className="text-sm">
        Install this app on your iPhone: tap the share button{" "}
        <span aria-label="share icon" role="img">
          ⎋
        </span>{" "}
        then &ldquo;Add to Home Screen&rdquo;{" "}
        <span aria-label="plus icon" role="img">
          ➕
        </span>
        .
      </p>
    </div>
  );
}
