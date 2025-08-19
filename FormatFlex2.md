# FormatFlex \- App Blueprint (MVP v1.0)

## 1\. Project Overview

**Project Name:** FormatFlex **Version:** MVP 1.0 (Initial Test Deployment) **Core Objective:** A minimal web application that allows users to input text and download a professionally formatted PDF. **Deployment Target:** Render (PaaS \- Platform as a Service)

## 2\. Core User Stories (MVP Scope)

* **As a User,** I want to access a clean, simple web page.  
* **As a User,** I want to input my manuscript text either by typing directly into a text area or by pasting copied text.  
* **As a User,** I want to click a single button (e.g., "Format & Export") to process my text.  
* **As a User,** I want to receive a downloadable PDF file that has basic, clean formatting (proper margins, font, line spacing, chapter headings).

## 3\. Technical Stack (Simplified for Render)

* **Frontend:** React (via Create React App or Vite) \- Simple, component-based, and easy to deploy as a Static Site.  
* **Backend API:** Node.js with Express.js \- Lightweight, perfect for Render's Web Service deployment.  
* **PDF Generation:** `puppeteer` or `html-pdf-node` \- To convert generated HTML into a PDF file on the server.  
* **Storage (Temporary):** Node.js filesystem (`fs` module) \- For MVP, generated files can be created on the server's ephemeral disk and served directly. *Note: This is not persistent; files are lost on server restart. This is acceptable for a first test.*  
* **Deployment & Hosting:** Render.com  
  * **Frontend:** Deployed as a **Static Site**.  
  * **Backend API:** Deployed as a **Web Service**.  
* **Version Control:** GitHub (linked to Render for automatic deploys).

## 4\. Application Architecture & Data Flow

User's Browser (React App)

        |

        | (1) User inputs text, clicks "Export"

        |

        V

Render \- Web Service (Node.js/Express API)

        |

        | (2) API receives text payload

        |

        V

        | (3) Server wraps text in a pre-defined HTML/CSS template

        |

        V

        | (4) Server uses \`puppeteer\` to convert HTML to PDF buffer

        |

        V

        | (5) Server sets headers and sends PDF buffer as response

        |

        V

User's Browser (React App)

        |

        | (6) Browser receives PDF stream, triggers download

        |

        V

\[File Downloaded\]

## 5\. Component Structure

### Frontend (React \- `/src` components)

* `App.js`: Main component, holds state for the input text.  
* `TextEditor.js`: A large `<textarea>` or a simple rich-text editor component for user input.  
* `ExportButton.js`: A button that, when clicked, sends the text to the backend API.  
* `Header.js / Footer.js`: Basic presentational components.

### Backend (Node.js/Express \- File Structure)

* `server.js`: Main server file.  
* `routes/api.js`: Contains the POST route (e.g., `/api/export-pdf`).  
* `utils/pdfGenerator.js`: Module containing the function that uses `puppeteer` to generate the PDF.  
* `templates/base.html`: A simple HTML file with CSS styles for the book (margins, fonts for body and h1/h2, etc.).

## 6\. API Endpoint Specification

* **Endpoint:** `POST /api/export-pdf`  
* **Request Body:**  
    
  {  
    
    "content": "The full text of the user's manuscript...",  
    
    "title": "My Book Title" // Optional for MVP  
    
  }  
    
* **Response:** Direct stream of the PDF file with content headers.  
  * **Headers:** `Content-Type: application/pdf`, `Content-Disposition: attachment; filename="formatted-book.pdf"`

## 7\. Key Dependencies (`package.json` excerpts)

**Backend:**

{

  "dependencies": {

    "express": "^4.18.2",

    "cors": "^2.8.5",

    "puppeteer-core": "^21.0.0", // Use 'puppeteer' for full Chromium, 'puppeteer-core' is lighter.

    "chrome-aws-lambda": "^10.1.0" // Helps with Puppeteer on cloud environments like Render.

  }

}

**Frontend:**

{

  "dependencies": {

    "react": "^18.2.0",

    "react-dom": "^18.2.0",

    "axios": "^1.5.0" // For making the API request to the backend.

  }

}

## 8\. Deployment Configuration (Render Specific)

**Render Configuration File (`render.yaml`):**

\# This file defines services to deploy on Render

services:

  \# Backend API Service

  \- type: web

    name: formatflex-api

    env: node

    plan: free \# Start with free plan

    buildCommand: "cd backend && npm install"

    startCommand: "cd backend && npm start"

    envVars:

      \- key: NODE\_ENV

        value: production

  \# Frontend Static Site

  \- type: static

    name: formatflex-web

    buildCommand: "cd frontend && npm run build"

    staticPublishPath: "./frontend/dist" \# Or './frontend/build' for Create React App

    envVars:

      \- key: REACT\_APP\_API\_URL

        value: https://formatflex-api.onrender.com \# This will be the name of your deployed API service

## 9\. Development & Deployment Steps

1. **Initialize Repo:** Create a GitHub repository with two main folders: `/frontend` and `/backend`.  
2. **Setup Backend:**  
   * Initialize npm in `/backend`.  
   * Install Express, Puppeteer-core, etc.  
   * Write the simple server with the `/api/export-pdf` endpoint.  
   * Create the HTML template and PDF generation logic.  
3. **Setup Frontend:**  
   * Use `create-react-app` or `vite` in the `/frontend` directory.  
   * Build a simple UI with a text area and a button.  
   * Use Axios to POST the text to the backend API URL.  
4. **Test Locally:** Run both frontend and backend locally to ensure the PDF download works.  
5. **Deploy to Render:**  
   * Connect your GitHub repo to Render.  
   * Create a **Web Service** for the backend, pointing to the `/backend` directory.  
   * Create a **Static Site** for the frontend, pointing to the `/frontend` directory.  
   * Update the frontend's environment variable (`REACT_APP_API_URL`) to point to the live backend URL on Render.  
6. **Test Live Deployment:** Open your live frontend URL, input text, and test the PDF generation.

## 10\. Next Steps (Post-MVP v1.0)

* **File Upload:** Add functionality to upload a `.txt` or `.docx` file instead of just pasting text.  
* **Template Selection:** Add a dropdown to choose from 2-3 different formatting templates.  
* **User Sessions:** Implement a simple system to temporarily save a user's work in local storage.  
* **Error Handling:** Robust error handling on the frontend and backend (e.g., for empty input, server errors).  
* **Persistence:** Integrate a proper database (PostgreSQL) and file storage (AWS S3) to save user projects and generated files.