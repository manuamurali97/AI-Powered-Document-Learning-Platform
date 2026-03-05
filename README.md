# AI-Powered-Document-Learning-Platform
A web application that helps users learn from long documents by automatically generating summaries and questions. The goal is to transform dense reading material into a structured learning experience where users can explore key ideas more easily.

Users can upload documents, and the system analyzes the content to produce summaries and learning prompts. The interface organizes this information so users can navigate through sections instead of reading a long unstructured document.

# Features 
- Upload and process long documents

- AI-generated summaries and questions

- Structured UI for navigating document sections

- Interactive interface for exploring generated insights

- Backend pipeline for document processing and AI analysis

# Tech Stack
Frontend: React, TypeScript, Tailwind CSS, API-based data fetching

Backend: Node.js, Express, Prisma ORM,PostgreSQL

AI Integration: OpenAI API, HuggingFace models

# Project Architecture
The project is structured as a full-stack web application with a clear separation between frontend UI and backend processing services. 

# Data Flow
- User uploads a document from the frontend.
- The frontend sends the file to the backend API.
- The backend processes the document and extracts text.
- AI models generate summaries and questions.
- Processed results are stored in the database.
- The frontend fetches the results and displays them in structured UI sections.
