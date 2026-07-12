const fs = require('fs');
const html = fs.readFileSync('ref/movies section.html', 'utf8');

const headRegex = /<head>([\s\S]*?)<\/head>/i;
const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;

const headMatch = html.match(headRegex);
const bodyMatch = html.match(bodyRegex);

let jsx = `export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`\n`;

// Extract styles
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
while ((match = styleRegex.exec(html)) !== null) {
  jsx += match[1].replace(/`/g, '\\`').replace(/\$/g, '\\$') + '\n';
}

jsx += `\` }} />
      <div id="super-wrapper" className="wrapper-main touch">
        {/* We will let the static HTML layout handle everything for a 1-to-1 match */}
        <div dangerouslySetInnerHTML={{ __html: \`\n`;

if (bodyMatch) {
  let innerBody = bodyMatch[1];
  
  // Clean up any script tags that might break React
  innerBody = innerBody.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Let's replace the actual movie grid content with {children} ? No, they want a 1:1 copy of the overall UI.
  // Actually, we can just render the entire static HTML as the page.
  jsx += innerBody.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '\n';
}

jsx += `\` }} />
      </div>
    </>
  );
}`;

fs.writeFileSync('src/app/movies/layout.tsx', jsx);
console.log("Wrote layout.tsx");
