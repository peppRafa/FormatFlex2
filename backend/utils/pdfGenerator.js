const puppeteer = require('puppeteer');
const htmlPdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

// Function to load HTML template
function loadTemplate() {
  const templatePath = path.join(__dirname, '../templates/base.html');
  return fs.readFileSync(templatePath, 'utf8');
}

// Function to process content and add chapter headings
function processContent(content) {
  // Split content into paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
  
  let processedContent = '';
  
  paragraphs.forEach(paragraph => {
    const trimmed = paragraph.trim();
    
    // Check if paragraph looks like a chapter heading (starts with "Chapter" or is all caps and short)
    if (trimmed.match(/^Chapter\s+\d+/i) || 
        (trimmed.length < 50 && trimmed === trimmed.toUpperCase() && trimmed.split(' ').length <= 5)) {
      processedContent += `<h1 class="chapter-heading">${trimmed}</h1>\n`;
    } 
    // Check if it looks like a section heading (shorter paragraphs that might be headings)
    else if (trimmed.length < 100 && !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?')) {
      processedContent += `<h2 class="section-heading">${trimmed}</h2>\n`;
    } 
    // Regular paragraph
    else {
      processedContent += `<p class="body-text">${trimmed}</p>\n`;
    }
  });
  
  return processedContent;
}

// Fallback PDF generation using html-pdf
function generatePDFWithHtmlPdf(html) {
  return new Promise((resolve, reject) => {
    const options = {
      format: 'A4',
      orientation: 'portrait',
      border: {
        top: '1in',
        right: '0.75in',
        bottom: '1in',
        left: '0.75in'
      },
      type: 'pdf',
      quality: '75',
      renderDelay: 1000,
      zoomFactor: 1
    };

    htmlPdf.create(html, options).toBuffer((err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer);
      }
    });
  });
}

// Generate dynamic CSS based on configuration
function generateDynamicCSS(config) {
  const fontImports = `
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap');
  `;

  // Theme colors
  const themes = {
    light: { background: '#ffffff', text: '#2c2c2c', headings: '#1a1a1a' },
    dark: { background: '#1a1a1a', text: '#e0e0e0', headings: '#ffffff' },
    sepia: { background: '#f4f3e8', text: '#5c4b37', headings: '#3d2f1f' }
  };

  const theme = themes[config.theme] || themes.light;
  
  // Font size calculations
  const baseFontSize = config.fontSize || 12;
  const titleFontSize = Math.round(baseFontSize * 2);
  const chapterFontSize = Math.round(baseFontSize * 1.5);
  const sectionFontSize = Math.round(baseFontSize * 1.2);
  
  // Text indent based on alignment
  const textIndent = config.textAlign === 'justify' ? '1.5rem' : '0';

  // Header/Footer CSS
  const headerCSS = config.headerEnabled ? `
    @page {
      @top-center {
        content: "${config.headerText || ''}";
        font-size: ${baseFontSize - 2}pt;
        color: ${theme.text};
      }
    }
  ` : '';

  const footerCSS = config.footerEnabled ? `
    @page {
      @bottom-center {
        content: "${config.footerText || ''} " counter(page);
        font-size: ${baseFontSize - 2}pt;
        color: ${theme.text};
      }
    }
  ` : '';

  return {
    fontImports,
    fontFamily: `'${config.fontFamily}', serif`,
    fontSize: baseFontSize,
    lineSpacing: config.lineSpacing || 1.6,
    textAlign: config.textAlign || 'justify',
    textIndent,
    backgroundColor: theme.background,
    textColor: theme.text,
    headingColor: theme.headings,
    titleFontSize,
    chapterFontSize,
    sectionFontSize,
    authorFontSize: Math.round(baseFontSize * 1.1),
    printFontSize: baseFontSize - 1,
    printChapterFontSize: chapterFontSize - 2,
    printSectionFontSize: sectionFontSize - 1,
    headerCSS,
    footerCSS,
    headerHTML: config.headerEnabled ? `<div class="page-header">${config.headerText || ''}</div>` : '',
    footerHTML: config.footerEnabled ? `<div class="page-footer">${config.footerText || ''}</div>` : ''
  };
}

// Get page size configuration
function getPageConfig(config) {
  const pageSizes = {
    'A4': { format: 'A4', margin: { top: '1in', right: '0.75in', bottom: '1in', left: '0.75in' } },
    'Letter': { format: 'Letter', margin: { top: '1in', right: '1in', bottom: '1in', left: '1in' } },
    'A5': { format: 'A5', margin: { top: '0.75in', right: '0.6in', bottom: '0.75in', left: '0.6in' } },
    '6x9': { format: [432, 648], margin: { top: '0.75in', right: '0.6in', bottom: '0.75in', left: '0.6in' } },
    '5x8': { format: [360, 576], margin: { top: '0.6in', right: '0.5in', bottom: '0.6in', left: '0.5in' } }
  };

  const marginPresets = {
    narrow: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
    normal: { top: '0.75in', right: '0.75in', bottom: '0.75in', left: '0.75in' },
    wide: { top: '1in', right: '1in', bottom: '1in', left: '1in' }
  };

  const pageSize = pageSizes[config.pageSize] || pageSizes.A4;
  const margins = marginPresets[config.margins] || pageSize.margin;

  return {
    format: pageSize.format,
    margin: margins
  };
}

// Load template based on configuration
function loadConfigurableTemplate(config) {
  const templateName = config.template === 'paperback' ? 'paperback.html' : 'ebook.html';
  const templatePath = path.join(__dirname, `../templates/${templateName}`);
  
  // Fallback to base template if specific template doesn't exist
  try {
    return fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.log(`Template ${templateName} not found, using base template`);
    return loadTemplate();
  }
}

// Main PDF generation function with v1.2 enhancements
async function generatePDF(content, title, formatConfig = {}) {
  let browser = null;
  
  // Default configuration for backward compatibility
  const defaultConfig = {
    fontFamily: 'Crimson Text',
    fontSize: 12,
    template: 'ebook',
    pageSize: 'A4',
    lineSpacing: 1.6,
    margins: 'normal',
    textAlign: 'justify',
    headerEnabled: false,
    footerEnabled: false,
    headerText: '',
    footerText: '',
    theme: 'light',
    colorPalette: 'classic'
  };

  const config = { ...defaultConfig, ...formatConfig };
  
  console.log('Using format configuration:', config);

  // Load appropriate template
  const template = loadConfigurableTemplate(config);
  const processedContent = processContent(content);
  
  // Generate dynamic CSS
  const cssVars = generateDynamicCSS(config);
  
  // Get page configuration
  const pageConfig = getPageConfig(config);
  
  // Replace all placeholders in template
  let html = template
    .replace('{{TITLE}}', title)
    .replace('{{AUTHOR}}', 'Author Name') // Could be made configurable
    .replace('{{CONTENT}}', processedContent);

  // Replace CSS variables
  Object.keys(cssVars).forEach(key => {
    const placeholder = `{{${key.toUpperCase()}}}`;
    html = html.replace(new RegExp(placeholder, 'g'), cssVars[key]);
  });

  // Try Puppeteer first, fallback to html-pdf if it fails
  try {
    console.log('Attempting PDF generation with Puppeteer...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-default-apps',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ],
      timeout: 30000
    });

    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(html, { 
      waitUntil: 'domcontentloaded',
      timeout: 20000
    });

    // Generate PDF with configurable formatting
    const pdfBuffer = await page.pdf({
      format: pageConfig.format,
      margin: pageConfig.margin,
      printBackground: true,
      displayHeaderFooter: config.headerEnabled || config.footerEnabled,
      headerTemplate: config.headerEnabled ? `<div style="font-size: 10px; width: 100%; text-align: center;">${config.headerText}</div>` : '',
      footerTemplate: config.footerEnabled ? `<div style="font-size: 10px; width: 100%; text-align: center;">${config.footerText} <span class="pageNumber"></span></div>` : '',
      timeout: 20000
    });

    console.log('PDF generated successfully with Puppeteer');
    return pdfBuffer;

  } catch (puppeteerError) {
    console.error('Puppeteer failed, trying fallback method:', puppeteerError.message);
    
    try {
      console.log('Attempting PDF generation with html-pdf fallback...');
      const pdfBuffer = await generatePDFWithHtmlPdf(html);
      console.log('PDF generated successfully with html-pdf fallback');
      return pdfBuffer;
    } catch (fallbackError) {
      console.error('Both PDF generation methods failed:', fallbackError.message);
      throw new Error(`PDF generation failed: Puppeteer: ${puppeteerError.message}, Fallback: ${fallbackError.message}`);
    }
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError.message);
      }
    }
  }
}

module.exports = { generatePDF };
