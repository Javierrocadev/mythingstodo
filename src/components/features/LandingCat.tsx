"use client";

import { CatLottie } from "./CatLottie";

export function LandingCat() {
  return (
    <div className="flex h-48 w-56 items-center justify-center">
      <CatLottie mood="HAPPY" className="h-full w-auto" />
    </div>
  );
}
