"use client";

import { ModeToggle } from "@/components/global/mode-toggle";
import Home from "./home";

export default function HomePage() {
  return (
    <div>
      <Home />;
      <div className="absolute top-2 right-2">
        <ModeToggle />
      </div>
    </div>
  );
}
