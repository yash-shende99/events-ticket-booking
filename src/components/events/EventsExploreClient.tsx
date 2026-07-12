"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

const FilterSection = ({ title, options, selected, setSelected, toggleFilter }: any) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="sc-133848s-2 sc-1y4pbdw-7 irZrCs brQHRI" style={{ marginBottom: '15px' }}>
      <div 
        role="button" 
        tabIndex={0} 
        aria-pressed={isOpen} 
        className="sc-133848s-2 sc-1y4pbdw-8 irZrCs cPELwM"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 0' }}
      >
        <div className="sc-133848s-1 sc-1y4pbdw-9 koZWoJ cqdbhc" style={{ marginRight: '10px' }}>
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
            <path d="M1 3.5L5 7.5L9 3.5" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '14px', color: '#333333' }}>{title}</span>
      </div>
      {selected.length > 0 && isOpen && (
        <div role="button" tabIndex={0} onClick={() => setSelected([])} className="sc-133848s-1 sc-1y4pbdw-10 koZWoJ gHpyFh" style={{ color: '#f84464', fontSize: '12px', cursor: 'pointer', paddingBottom: '10px' }}>Clear</div>
      )}
      
      {isOpen && (
        <div className="sc-133848s-2 sc-1y4pbdw-11 irZrCs wYkTF" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '5px 0 15px 0' }}>
          {options.map((opt: string) => {
            const isSelected = selected.includes(opt);
            return (
              <div key={opt} onClick={() => toggleFilter(selected, setSelected, opt)} className="sc-133848s-2 sc-1y4pbdw-12 irZrCs jhFBqU" style={{ cursor: 'pointer' }}>
                <div role="button" tabIndex={0} aria-pressed={isSelected} className={`sc-133848s-0 sc-1y4pbdw-14 ${isSelected ? 'dnuCRA grDLNv selected' : 'dnuCRA grDLNv'}`} style={{ border: isSelected ? '1px solid #f84464' : '1px solid #e0e0e0', color: isSelected ? '#f84464' : '#333333', backgroundColor: isSelected ? '#f844641a' : '#fff', padding: '5px 10px', borderRadius: '4px' }}>
                  <div className="sc-1y4pbdw-15 fhPyIj" style={{ fontSize: '14px' }}>{opt}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


export default function EventsExploreClient({ initialEvents }: { initialEvents: any[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  // Extract unique filters
  const allCategories = useMemo(() => Array.from(new Set(initialEvents.map(e => e.category).filter(Boolean))), [initialEvents]);
  const allLanguages = useMemo(() => Array.from(new Set(initialEvents.flatMap(e => e.languages || []).filter(Boolean))), [initialEvents]);
  const allPrices = useMemo(() => Array.from(new Set(initialEvents.map(e => e.price).filter(Boolean))), [initialEvents]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return initialEvents.filter(event => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
      const matchLanguage = selectedLanguages.length === 0 || (event.languages || []).some((l: string) => selectedLanguages.includes(l));
      const matchPrice = selectedPrices.length === 0 || selectedPrices.includes(event.price);
      
      return matchCategory && matchLanguage && matchPrice;
    });
  }, [initialEvents, selectedCategories, selectedLanguages, selectedPrices]);

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLanguages([]);
    setSelectedPrices([]);
  };

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
                
                <FilterSection title="Categories" options={allCategories} selected={selectedCategories} setSelected={setSelectedCategories} toggleFilter={toggleFilter} />
                <FilterSection title="Languages" options={allLanguages} selected={selectedLanguages} setSelected={setSelectedLanguages} toggleFilter={toggleFilter} />
                <FilterSection title="Price" options={allPrices} selected={selectedPrices} setSelected={setSelectedPrices} toggleFilter={toggleFilter} />
                
              </div>
            </div>
          </div>
        </div>

        {/* Right Event Grid */}
        <div className="sc-133848s-2 sc-10xx5v3-2 irZrCs hWzCgR" style={{ flex: 1 }}>
          <div className="sc-133848s-1 sc-fsvy97-0 koZWoJ dzMylx" style={{ marginBottom: '20px' }}>
            <h1 className="sc-fsvy97-1 kxTjQo" style={{ fontSize: '24px', fontWeight: 700, color: '#333333' }}>Events In Pune</h1>
          </div>

          {/* Category Chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '30px', marginTop: '10px' }}>
            {allCategories.map(cat => {
              const isSelected = selectedCategories.includes(cat);
              return (
                <div 
                  key={cat} 
                  onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                  style={{ 
                    cursor: 'pointer',
                    padding: '8px 18px',
                    borderRadius: '25px',
                    border: '1px solid #f84464',
                    backgroundColor: isSelected ? '#f84464' : '#fff',
                    color: isSelected ? '#fff' : '#f84464',
                    fontSize: '14px',
                    fontWeight: 400
                  }}
                >
                  {cat}
                </div>
              );
            })}
          </div>

          <div className="sc-133848s-2 sc-1j2rhyo-0 irZrCs fJtJkP" style={{ display: 'flex', flexWrap: 'wrap', gap: '25px' }}>
            {filteredEvents.map((event: any, idx: number) => (
              <div key={event._id} className="sc-133848s-2 sc-1j2rhyo-1 irZrCs cRXXqU" style={{ width: 'calc(25% - 20px)' }}>
                <Link href={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
                  <div className="sc-133848s-3 sc-133848s-4 sc-116h1p7-0 gMFRkd iXgYfH igKivO" style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', width: '100%', aspectRatio: '2/3', backgroundColor: '#e5e5e5' }}>
                    <Image
                      src={event.poster || '/assets/events/practice.jpg'}
                      alt={event.title}
                      fill
                      className="sc-eyvjnt-1 fXzYyH"
                      unoptimized
                      style={{ objectFit: 'cover' }}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      priority={idx < 4}
                    />
                    <div className="sc-116h1p7-1 eBwHkt" style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#000000', color: '#fff', padding: '6px 10px', fontSize: '13px', display: 'flex', justifyContent: 'flex-start', borderRadius: '0 0 8px 8px' }}>
                      <span>{event.date || 'Multiple Dates'}</span>
                    </div>
                  </div>
                  <div className="sc-116h1p7-3 crEouQ" style={{ marginTop: '10px' }}>
                    <div className="sc-7o7nez-0 iHsoLV" style={{ fontSize: '16px', fontWeight: 500, color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
                    <div className="sc-7o7nez-0 hBfHlX" style={{ fontSize: '14px', color: '#666666', marginTop: '5px' }}>{event.location || 'Pune'}</div>
                    <div className="sc-7o7nez-0 hBfHlX" style={{ fontSize: '14px', color: '#333333', marginTop: '5px' }}>{event.price || '₹500 onwards'}</div>
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