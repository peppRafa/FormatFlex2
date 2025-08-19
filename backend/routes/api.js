const express = require('express');
const { generatePDF } = require('../utils/pdfGenerator');

const router = express.Router();

// POST /api/export-pdf
router.post('/export-pdf', async (req, res) => {
  console.log('PDF export request received');
  
  try {
    const { content, title = 'Formatted Manuscript' } = req.body;
    
    console.log('Request data:', { 
      contentLength: content ? content.length : 0, 
      title: title 
    });

    // Validate input
    if (!content || content.trim().length === 0) {
      console.log('Validation failed: empty content');
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    console.log('Starting PDF generation...');
    
    // Generate PDF
    const pdfBuffer = await generatePDF(content, title);
    
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

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'active', 
    service: 'FormatFlex PDF Generator',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
