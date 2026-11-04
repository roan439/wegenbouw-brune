"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image met een nette, merkgebonden fallback als een (extern) beeld niet laadt.
 * Zo breekt de layout nooit, ook niet tijdens een CMS-migratie.
 */
export default function ProjectImage({ alt, className = "", ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`pattern-paving flex items-end bg-graphite p-5 ${className}`}
        style={props.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        <span className="eyebrow text-white/40">Beeld volgt</span>
      </div>
    );
  }
  return <Image alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
