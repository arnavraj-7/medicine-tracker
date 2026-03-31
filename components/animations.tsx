"use client";

import dynamic from "next/dynamic";
import trophyData from "../public/Trophy.json";
import snorlaxData from "../public/Day 18 - Dreaming Snorlax.json";
import bearData from "../public/Sleeping Polar Bear.json";
import indolentData from "../public/Indolent Evening.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export function TrophyAnimation({ size = 120 }: { size?: number }) {
  return (
    <Lottie
      animationData={trophyData}
      loop={false}
      style={{ height: size, width: size }}
    />
  );
}

export function SnorlaxAnimation({ size = 160 }: { size?: number }) {
  return (
    <Lottie
      animationData={snorlaxData}
      loop
      style={{ height: size, width: size }}
    />
  );
}

export function BearAnimation({ size = 160 }: { size?: number }) {
  return (
    <Lottie
      animationData={bearData}
      loop
      style={{ height: size, width: size }}
    />
  );
}

export function IndolentAnimation({ size = 160 }: { size?: number }) {
  return (
    <Lottie
      animationData={indolentData}
      loop
      style={{ height: size, width: size }}
    />
  );
}
