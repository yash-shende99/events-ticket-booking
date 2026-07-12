"use client";

import { useState } from "react";
import Image from "next/image";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function PersonCard({ name, role, image }: { name: string; role: string; image?: string | null }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col items-center shrink-0 w-[120px] cursor-pointer group">
      <div
        className="w-[120px] h-[120px] overflow-hidden mb-3 group-hover:opacity-90 transition bg-[#f0f0f0] rounded-full"
      >
        {image && !imgError ? (
          <Image
            src={image}
            alt={name}
            width={120}
            height={120}
            className="w-full h-full object-cover"
            unoptimized
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <span className="text-gray-600 font-bold text-2xl select-none">
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 text-center leading-tight mb-0.5 w-full truncate px-1">{name}</h3>
      <p className="text-xs text-gray-500 text-center w-full truncate px-1">{role}</p>
    </div>
  );
}

export function CastSection({ cast }: { cast: any[] }) {
  const clean = cast.filter((c) => c.name && c.name !== "Lead Actor" && c.name !== "Supporting Actor");
  if (!clean.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold text-gray-900 mb-5">Cast</h2>
      <div className="flex overflow-x-auto gap-5 pb-2 hide-scrollbar">
        {clean.map((actor, idx) => (
          <PersonCard key={idx} name={actor.name} role={actor.role} image={actor.image} />
        ))}
      </div>
    </section>
  );
}

export function CrewSection({ crew }: { crew: any[] }) {
  const clean = crew.filter((c) => c.name && c.name !== "Lead Actor" && c.name !== "Supporting Actor");
  if (!clean.length) return null;

  return (
    <>
      <hr className="border-gray-100" />
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Crew</h2>
        <div className="flex overflow-x-auto gap-5 pb-2 hide-scrollbar">
          {clean.map((member, idx) => (
            <PersonCard key={idx} name={member.name} role={member.role} image={member.image} />
          ))}
        </div>
      </section>
    </>
  );
}
