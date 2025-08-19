const puppeteer = require('puppeteer');
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

// Main PDF generation function
async function generatePDF(content, title) {
  let browser = null;
  
  try {
    // Load and prepare HTML template
    const template = loadTemplate();
    const processedContent = processContent(content);
    
    // Replace placeholders in template
    const html = template
      .replace('{{TITLE}}', title)
      .replace('{{CONTENT}}', processedContent);

    // Launch browser with appropriate configuration
    const isProduction = process.env.NODE_ENV === 'production';
    
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
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set content and wait for it to load
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000
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
      displayHeaderFooter: false
    });

    return pdfBuffer;

  } catch (error) {
    console.error('Error in PDF generation:', error);
    throw new Error(`PDF generation failed: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { generatePDF };
