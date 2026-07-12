const fs = require('fs');

const html = fs.readFileSync('ref/movies section.html', 'utf8');

// The main wrapper class is usually `sc-133848s-0` or something.
// Let's find the `Filters` block.
const filtersStart = html.indexOf('<div class="sc-1y4pbdw-4 gDyBGP">Filters</div>');
const layoutStart = html.lastIndexOf('<div', filtersStart - 100);

// Just create a simplified wrapper that mimics it perfectly.
// We will build `MoviesExploreClient.tsx` manually based on what we observe in the snippet.

const reactComponent = `
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

export default function MoviesExploreClient({ initialMovies }: { initialMovies: any[] }) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

  // Extract unique filters
  const allLanguages = useMemo(() => Array.from(new Set(initialMovies.flatMap(m => m.languages))), [initialMovies]);
  const allGenres = useMemo(() => Array.from(new Set(initialMovies.flatMap(m => m.genres))), [initialMovies]);
  const allFormats = useMemo(() => Array.from(new Set(initialMovies.flatMap(m => m.formats))), [initialMovies]);

  // Filter movies
  const filteredMovies = useMemo(() => {
    return initialMovies.filter(movie => {
      const matchLanguage = selectedLanguages.length === 0 || movie.languages.some((l: string) => selectedLanguages.includes(l));
      const matchGenre = selectedGenres.length === 0 || movie.genres.some((g: string) => selectedGenres.includes(g));
      const matchFormat = selectedFormats.length === 0 || movie.formats.some((f: string) => selectedFormats.includes(f));
      
      return matchLanguage && matchGenre && matchFormat;
    });
  }, [initialMovies, selectedLanguages, selectedGenres, selectedFormats]);

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearFilters = () => {
    setSelectedLanguages([]);
    setSelectedGenres([]);
    setSelectedFormats([]);
  };

  const FilterSection = ({ title, options, selected, setSelected }: any) => (
    <div className="sc-133848s-2 sc-1y4pbdw-7 irZrCs brQHRI" style={{ marginBottom: '15px' }}>
      <div role="button" tabIndex={0} aria-pressed="true" className="sc-133848s-2 sc-1y4pbdw-8 irZrCs cPELwM">
        <div className="sc-133848s-1 sc-1y4pbdw-9 koZWoJ cqdbhc">
          <svg width="20" height="10" color="#333333" style={{ transform: 'rotate(90deg)' }}><use href="/chunks/icons/common-icons-1cef1e0e.svg#icon-chevron-any-color"></use></svg>
        </div>
        {title}
      </div>
      {selected.length > 0 && <div role="button" tabIndex={0} onClick={() => setSelected([])} className="sc-133848s-1 sc-1y4pbdw-10 koZWoJ gHpyFh">Clear</div>}
      
      <div className="sc-133848s-2 sc-1y4pbdw-11 irZrCs wYkTF" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '15px' }}>
        {options.map((opt: string) => {
          const isSelected = selected.includes(opt);
          return (
            <div key={opt} onClick={() => toggleFilter(selected, setSelected, opt)} className="sc-133848s-2 sc-1y4pbdw-12 irZrCs jhFBqU" style={{ cursor: 'pointer' }}>
              <div role="button" tabIndex={0} aria-pressed={isSelected} className={\`sc-133848s-0 sc-1y4pbdw-14 \${isSelected ? 'dnuCRA grDLNv selected' : 'dnuCRA grDLNv'}\`} style={{ border: isSelected ? '1px solid #f84464' : '1px solid #e0e0e0', color: isSelected ? '#f84464' : '#333333', backgroundColor: isSelected ? '#f844641a' : '#fff', padding: '5px 10px', borderRadius: '4px' }}>
                <div className="sc-1y4pbdw-15 fhPyIj">{opt}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div id="super-wrapper" className="wrapper-main touch" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '30px 0' }}>
      <div className="sc-133848s-2 sc-10xx5v3-0 irZrCs jfPjhm" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '30px', padding: '0 15px' }}>
        
        {/* Left Sidebar Filters */}
        <div className="sc-133848s-2 sc-10xx5v3-1 irZrCs eEOMJc" style={{ width: '280px', flexShrink: 0 }}>
          <div className="sc-1y4pbdw-0 bwTYYl">
            <div className="sc-1y4pbdw-1 hWhQvK" style={{ marginBottom: '20px' }}>
              <div className="sc-1y4pbdw-4 gDyBGP" style={{ fontSize: '24px', fontWeight: 700, color: '#333333' }}>Filters</div>
            </div>
            
            <div className="sc-133848s-3 sc-1y4pbdw-5 gMFRkd ihbKiQ" style={{ backgroundColor: '#fff', padding: '15px', borderRadius: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <div className="sc-1y4pbdw-6 iNyBvr">
                
                <FilterSection title="Languages" options={allLanguages} selected={selectedLanguages} setSelected={setSelectedLanguages} />
                <FilterSection title="Genres" options={allGenres} selected={selectedGenres} setSelected={setSelectedGenres} />
                <FilterSection title="Format" options={allFormats} selected={selectedFormats} setSelected={setSelectedFormats} />
                
              </div>
            </div>
          </div>
        </div>

        {/* Right Movie Grid */}
        <div className="sc-133848s-2 sc-10xx5v3-2 irZrCs hWzCgR" style={{ flex: 1 }}>
          <div className="sc-133848s-1 sc-fsvy97-0 koZWoJ dzMylx" style={{ marginBottom: '20px' }}>
            <h1 className="sc-fsvy97-1 kxTjQo" style={{ fontSize: '24px', fontWeight: 700, color: '#333333' }}>Movies In Theatres</h1>
          </div>

          <div className="sc-133848s-2 sc-1j2rhyo-0 irZrCs fJtJkP" style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
            {filteredMovies.map((movie: any) => (
              <div key={movie._id} className="sc-133848s-2 sc-1j2rhyo-1 irZrCs cRXXqU" style={{ width: 'calc(25% - 20px)' }}>
                <Link href={\`/movies/\${movie._id}\`} style={{ textDecoration: 'none' }}>
                  <div className="sc-133848s-3 sc-133848s-4 sc-116h1p7-0 gMFRkd iXgYfH igKivO" style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', width: '100%', aspectRatio: '2/3', backgroundColor: '#e5e5e5' }}>
                    <Image src={movie.poster} alt={movie.title} fill className="sc-eyvjnt-1 fXzYyH" unoptimized style={{ objectFit: 'cover' }} />
                    <div className="sc-116h1p7-1 eBwHkt" style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.6)', color: '#fff', padding: '5px 10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>⭐ {movie.rating}/10</span>
                      <span>{movie.votes} Votes</span>
                    </div>
                  </div>
                  <div className="sc-116h1p7-3 crEouQ" style={{ marginTop: '10px' }}>
                    <div className="sc-7o7nez-0 iHsoLV" style={{ fontSize: '16px', fontWeight: 500, color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{movie.title}</div>
                    <div className="sc-7o7nez-0 hBfHlX" style={{ fontSize: '14px', color: '#666666', marginTop: '5px' }}>{movie.certification} • {movie.languages.join(', ')}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/movies/MoviesExploreClient.tsx', reactComponent);
console.log("Rewrote component.");
