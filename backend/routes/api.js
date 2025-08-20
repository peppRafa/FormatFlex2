const express = require('express');
const { generatePDF } = require('../utils/pdfGenerator');

const router = express.Router();

// POST /api/export-pdf
router.post('/export-pdf', async (req, res) => {
  console.log('PDF export request received');
  
  try {
    const { content, title = 'Formatted Manuscript', formatConfig } = req.body;
    
    console.log('Request data:', { 
      contentLength: content ? content.length : 0, 
      title: title,
      hasFormatConfig: !!formatConfig
    });

    // Validate input
    if (!content || content.trim().length === 0) {
      console.log('Validation failed: empty content');
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    console.log('Starting PDF generation with format config...');
    
    // Generate PDF with format configuration
    const pdfBuffer = await generatePDF(content, title, formatConfig);
    
    console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// POST /api/preview-pdf - v1.2 Preview functionality
router.post('/preview-pdf', async (req, res) => {
  console.log('PDF preview request received');
  
  try {
    const { content, title = 'Preview', formatConfig } = req.body;
    
    console.log('Preview request data:', { 
      contentLength: content ? content.length : 0, 
      title: title,
      hasFormatConfig: !!formatConfig
    });

    // Validate input
    if (!content || content.trim().length === 0) {
      console.log('Preview validation failed: empty content');
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    console.log('Starting PDF preview generation...');
    
    // Generate PDF preview with format configuration
    const pdfBuffer = await generatePDF(content, title, formatConfig);
    
    console.log('PDF preview generated successfully, size:', pdfBuffer.length, 'bytes');

    // Set headers for PDF preview (inline display)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="preview.pdf"');
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF preview generation error:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to generate PDF preview', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'active', 
    service: 'FormatFlex PDF Generator',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
