const fs = require('fs');
const path = require('path');

const domFile = path.join(__dirname, '../ref/events_details/PRACTICE - A Standup Comedy Show by Manik Mahna Comedy Shows Event Tickets - BookMyShow.html');
const cssFile = path.join(__dirname, 'event_details_styles.css');
const clientComponentFile = path.join(__dirname, '../src/app/events/[id]/page.tsx');

const { JSDOM } = require('jsdom');
const html = fs.readFileSync(domFile, 'utf8');

const dom = new JSDOM(html);
const document = dom.window.document;

// Remove noscript and scripts
document.querySelectorAll('noscript, script, iframe').forEach(el => el.remove());

const container = document.querySelector('#super-container') || document.body.firstElementChild;

function convertNodeToJSX(node) {
  if (node.nodeType === 3) {
    return node.textContent.replace(/{/g, '{"{"}').replace(/}/g, '{"}"}');
  }
  if (node.nodeType !== 1) return ''; 

  const tagName = node.tagName.toLowerCase();
  if (tagName === 'script' || tagName === 'noscript' || tagName === 'iframe' || tagName === 'style') return '';

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
    
    // Fix TS errors by mapping correctly
    if (name === 'tabindex') name = 'tabIndex';
    if (name === 'fetchpriority') name = 'fetchPriority';
    if (name === 'direction') name = 'data-direction';

    if (name.includes('-') && !name.startsWith('data-') && !name.startsWith('aria-')) {
       // just map invalid attributes to data-* 
       name = 'data-' + name;
    }

    if (name === 'width' && tagName === 'div') name = 'data-width';
    if (name === 'height' && (tagName === 'div' || tagName === 'hr')) name = 'data-height';
    if (name === 'type' && value === 'default') value = 'button';

    // Fix image paths directly here
    if (name === 'src' && value.includes('PRACTICE - A Standup Comedy Show by Manik Mahna')) {
        const parts = value.split('/');
        value = '/assets/events/' + parts[parts.length - 1];
    } else if (name === 'src' && value.endsWith('.jpg') && !value.startsWith('http') && !value.startsWith('/')) {
        const parts = value.split('/');
        value = '/assets/events/' + parts[parts.length - 1];
    }

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

let jsxStr = convertNodeToJSX(container);
const css = fs.readFileSync(cssFile, 'utf8');

const finalComponent = `import connectDB from "@/lib/db";
import { Event } from "@/models/Event";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  await connectDB();
  let event = null;
  
  try {
    event = await Event.findById(params.id).lean();
  } catch (e) {
    // ignore
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`` + css.replace(/`/g, '\\`').replace(/\$/g, '\\$') + `\` }} />
      ` + jsxStr + `
    </>
  );
}`;

fs.writeFileSync(clientComponentFile, finalComponent);
console.log('Successfully regenerated event details page without broken string replacements.');
