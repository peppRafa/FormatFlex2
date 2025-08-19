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

// Main PDF generation function with fallback
async function generatePDF(content, title) {
  let browser = null;
  
  // Load and prepare HTML template
  const template = loadTemplate();
  const processedContent = processContent(content);
  
  // Replace placeholders in template
  const html = template
    .replace('{{TITLE}}', title)
    .replace('{{CONTENT}}', processedContent);

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

    // Generate PDF with book-like formatting
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '1in',
        right: '0.75in',
        bottom: '1in',
        left: '0.75in'
      },
      printBackground: true,
      displayHeaderFooter: false,
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
