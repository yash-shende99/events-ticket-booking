const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const domFile = path.join(__dirname, 'events_dom.html');
const cssFile = path.join(__dirname, 'events_styles.css');
const clientComponentFile = path.join(__dirname, '../src/components/events/EventsExploreClient.tsx');

const html = fs.readFileSync(domFile, 'utf8');
const css = fs.readFileSync(cssFile, 'utf8');

const dom = new JSDOM(html);
const document = dom.window.document;

// Remove scripts and noscripts just in case
document.querySelectorAll('script, noscript, iframe').forEach(el => el.remove());

const eventGrid = document.querySelector('.sc-133848s-2.sc-10xx5v3-2.irZrCs.hWzCgR > div:nth-child(2)');
if (eventGrid) {
  eventGrid.innerHTML = `
    {filteredEvents.map((event: any) => (
      <div key={event._id} className="sc-133848s-2 sc-1j2rhyo-1 irZrCs cRXXqU" style={{ width: 'calc(25% - 20px)' }}>
        <Link href={"/events/" + event._id} style={{ textDecoration: 'none' }}>
          <div className="sc-133848s-3 sc-133848s-4 sc-116h1p7-0 gMFRkd iXgYfH igKivO" style={{ borderRadius: '8px', overflow: 'hidden', position: 'relative', width: '100%', aspectRatio: '2/3', backgroundColor: '#e5e5e5' }}>
            <img src={event.poster} alt={event.title} className="sc-eyvjnt-1 fXzYyH" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
          </div>
          <div className="sc-116h1p7-3 crEouQ" style={{ marginTop: '10px' }}>
            <div className="sc-7o7nez-0 iHsoLV" style={{ fontSize: '16px', fontWeight: 500, color: '#333333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
            <div className="sc-7o7nez-0 hBfHlX" style={{ fontSize: '14px', color: '#666666', marginTop: '5px' }}>{event.location || "Pune"}</div>
            <div className="sc-7o7nez-0 hBfHlX" style={{ fontSize: '14px', color: '#666666', marginTop: '2px' }}>{event.date || "Multiple Dates"}</div>
            <div className="sc-7o7nez-0 hBfHlX" style={{ fontSize: '14px', color: '#333333', marginTop: '2px', fontWeight: 500 }}>{event.price || "₹500 onwards"}</div>
          </div>
        </Link>
      </div>
    ))}
  `;
}

function convertNodeToJSX(node) {
  if (node.nodeType === 3) { 
    return node.textContent.replace(/{/g, '{"{"}').replace(/}/g, '{"}"}');
  }
  if (node.nodeType !== 1) return ''; 

  if (node.innerHTML && node.innerHTML.includes('{filteredEvents.map(')) {
    return node.innerHTML; 
  }

  const tagName = node.tagName.toLowerCase();
  
  if (tagName === 'script' || tagName === 'noscript' || tagName === 'style' || tagName === 'iframe') return '';

  const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link'];
  const isSelfClosing = selfClosingTags.includes(tagName);

  let jsx = `<${tagName}`;

  for (let i = 0; i < node.attributes.length; i++) {
    const attr = node.attributes[i];
    let name = attr.name;
    let value = attr.value;

    if (name === 'class') name = 'className';
    if (name === 'for') name = 'htmlFor';
    if (name === 'style') continue; 
    
    // Fix TS errors
    if (name === 'tabindex') name = 'tabIndex';
    if (name === 'fetchpriority') name = 'fetchPriority';
    if (name === 'direction') name = 'data-direction';
    if (name.includes('-') && !name.startsWith('data-') && !name.startsWith('aria-')) {
       name = 'data-' + name;
    }
    if (name === 'width' && tagName === 'div') name = 'data-width';
    if (name === 'height' && (tagName === 'div' || tagName === 'hr')) name = 'data-height';

    value = value.replace(/"/g, '&quot;');
    jsx += ` ${name}="${value}"`;
  }

  if (isSelfClosing) {
    jsx += ' />';
  } else {
    jsx += '>';
    for (let i = 0; i < node.childNodes.length; i++) {
      jsx += convertNodeToJSX(node.childNodes[i]);
    }
    jsx += `</${tagName}>`;
  }

  return jsx;
}

// Find the main container that holds the content
const container = document.querySelector('#super-container') || document.querySelector('.wrapper-main') || document.body;
let jsxStr = convertNodeToJSX(container);

const finalComponent = `"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

export default function EventsExploreClient({ initialEvents }: { initialEvents: any[] }) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);

  const filteredEvents = useMemo(() => {
    return initialEvents;
  }, [initialEvents, selectedCategories, selectedLanguages, selectedPrices]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`` + css.replace(/`/g, '\\`').replace(/\$/g, '\\$') + `\` }} />
      ` + jsxStr + `
    </>
  );
}`;

fs.writeFileSync(clientComponentFile, finalComponent);
console.log('Successfully generated EventsExploreClient.tsx with all UI elements');
