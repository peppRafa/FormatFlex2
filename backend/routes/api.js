const express = require('express');
const { generatePDF } = require('../utils/pdfGenerator');

const router = express.Router();

// POST /api/export-pdf
router.post('/export-pdf', async (req, res) => {
  try {
    const { content, title = 'Formatted Manuscript' } = req.body;

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Content is required and cannot be empty' 
      });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(content, title);

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send PDF buffer
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate PDF', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
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
