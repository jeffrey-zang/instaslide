export interface SlideContent {
  frontmatter: Record<string, string>;
  content: string;
}

export function parseSlides(markdown: string): SlideContent[] {
  const lines = markdown.split('\n');
  const slides: SlideContent[] = [];
  
  let currentSlide: SlideContent = { frontmatter: {}, content: '' };
  let inFrontmatter = false;
  let frontmatterLines: string[] = [];
  let isFirstSlide = true;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.trim() === '---') {
      if (i === 0 || (isFirstSlide && inFrontmatter)) {
        inFrontmatter = !inFrontmatter;
        if (!inFrontmatter) {
          currentSlide.frontmatter = parseFrontmatter(frontmatterLines.join('\n'));
          frontmatterLines = [];
          isFirstSlide = false;
        }
      } else {
        if (currentSlide.content.trim() || Object.keys(currentSlide.frontmatter).length > 0) {
          slides.push(processSlide(currentSlide));
        }
        currentSlide = { frontmatter: {}, content: '' };
      }
    } else if (inFrontmatter) {
      frontmatterLines.push(line);
    } else {
      currentSlide.content += line + '\n';
    }
  }
  
  if (currentSlide.content.trim()) {
    const processed = processSlide(currentSlide);
    if (processed.content.trim()) {
      slides.push(processed);
    }
  }
  
  return slides.filter(slide => {
    const trimmedContent = slide.content.trim();
    return trimmedContent.length > 0;
  });
}

function processSlide(slide: SlideContent): SlideContent {
  const lines = slide.content.split('\n');
  const inlineDirectives: Record<string, string> = {};
  let contentStartIndex = 0;
  let foundContent = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (!foundContent) {
        contentStartIndex = i + 1;
      }
      continue;
    }
    
    const directiveMatch = line.match(/^(\w+):\s*(.+)$/);
    if (directiveMatch && !foundContent && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('*')) {
      const [, key, value] = directiveMatch;
      inlineDirectives[key] = value.trim();
      contentStartIndex = i + 1;
    } else {
      foundContent = true;
      break;
    }
  }
  
  const processedContent = lines.slice(contentStartIndex).join('\n').trim();
  
  return {
    frontmatter: { ...slide.frontmatter, ...inlineDirectives },
    content: processedContent
  };
}

function parseFrontmatter(yaml: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = yaml.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      result[key] = value.trim();
    }
  }
  
  return result;
}
