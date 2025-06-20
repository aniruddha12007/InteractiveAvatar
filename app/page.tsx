"use client";

import React, { useState } from "react";
import InteractiveAvatar from "@/components/InteractiveAvatar";
import LandingPage from "@/components/LandingPage";

export default function App() {
  const [showInteractiveAvatar, setShowInteractiveAvatar] = useState(false);

  return (
    <div className="w-full flex-1 flex flex-col items-center">
      {!showInteractiveAvatar ? (
        <LandingPage onStartLearning={() => setShowInteractiveAvatar(true)} />
      ) : (
        <div className="flex-1 w-full h-full">
          <InteractiveAvatar onTestComplete={() => setShowInteractiveAvatar(false)} />
        </div>
      )}
    </div>
  );
}
