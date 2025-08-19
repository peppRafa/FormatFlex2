# FormatFlex - Professional Manuscript Formatter

FormatFlex is a web application that transforms your manuscript text into professionally formatted PDFs with just one click.

## Features

- **Simple Text Input**: Type or paste your manuscript directly into the web interface
- **Automatic Formatting**: Detects chapter headings and applies professional typography
- **Instant PDF Generation**: One-click conversion to downloadable PDF
- **Professional Layout**: Proper margins, fonts, line spacing, and chapter formatting
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js with modern CSS
- **Backend**: Node.js with Express.js
- **PDF Generation**: Puppeteer for high-quality PDF output
- **Deployment**: Render.com (PaaS)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd FormatFlex2
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Deployment on Render

1. **Connect your GitHub repository to Render**

2. **Deploy using the included `render.yaml` configuration**
   - The file automatically configures both frontend and backend services
   - Backend will be deployed as a Web Service
   - Frontend will be deployed as a Static Site

3. **Environment Variables**
   - `NODE_ENV=production` (automatically set for backend)
   - `REACT_APP_API_URL` (points to your deployed backend URL)

## How to Use

1. **Enter your manuscript title** in the title field
2. **Type or paste your manuscript content** in the text editor
3. **Use formatting conventions**:
   - Type "Chapter 1", "Chapter 2", etc. for chapter headings
   - Use ALL CAPS for special titles (keep them short)
   - Regular paragraphs will be automatically formatted
4. **Click "Format & Export PDF"** to generate your formatted manuscript
5. **Download the generated PDF** file

## API Endpoints

### POST /api/export-pdf
Generates a PDF from manuscript content.

**Request Body:**
```json
{
  "content": "Your manuscript content...",
  "title": "My Book Title"
}
```

**Response:** PDF file stream with appropriate headers

### GET /api/status
Returns API status and health information.

## Project Structure

```
FormatFlex2/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── api.js
│   ├── utils/
│   │   └── pdfGenerator.js
│   └── templates/
│       └── base.html
├── frontend/
│   ├── package.json
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   ├── index.css
│   │   └── components/
│   │       ├── Header.js
│   │       ├── TextEditor.js
│   │       ├── ExportButton.js
│   │       └── Footer.js
├── render.yaml
└── README.md
```

## Next Steps (Future Versions)

- [ ] File upload support (.txt, .docx)
- [ ] Multiple formatting templates
- [ ] User sessions and local storage
- [ ] Enhanced error handling
- [ ] Database integration
- [ ] File storage (AWS S3)

## Contributing

This is an MVP (Minimum Viable Product) designed for initial testing and deployment. Contributions and feedback are welcome!

## License

MIT License - Feel free to use and modify as needed.
