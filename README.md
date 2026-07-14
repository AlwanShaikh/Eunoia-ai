# Eunoia

Eunoia is an AI mental wellness companion designed to support reflection, emotional growth, and calm conversation. This repository contains the initial production-ready scaffold for a Next.js frontend and FastAPI backend.

## Architecture

- Frontend: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion
- Backend: FastAPI, Python
- AI: Google Gemini API
- Data: SQLite (initial version)

## Structure

- app/: Next.js application entry points and global styles
- components/: reusable UI components
- backend/app/: FastAPI application modules
- backend/requirements.txt: Python dependencies

## Environment Setup

1. Copy backend/.env.example to backend/.env
2. Populate the required environment variables
3. Install frontend dependencies with npm install
4. Install backend dependencies with pip install -r backend/requirements.txt

## Run Locally

Frontend:
- npm run dev

Backend:
- uvicorn backend.app.main:app --reload --port 8000

## Notes

The AI companion is intentionally framed as an AI support companion and does not claim to be a licensed therapist or mental health professional.
