# Smart Resume Shortlisting System

A machine learning platform that scans, analyzes, and ranks resumes against predefined job descriptions. The system evaluates skills, keywords, experience, and overall relevance to generate a shortlisting score that helps recruiters prioritize applicants faster.

Recruiters can use the integrated Streamlit dashboard to filter candidates, review ranked matches, and download a structured shortlist as a CSV file. The prototype is designed for corporate, HR-tech, and productivity-focused hackathon use cases where teams want to reduce manual screening effort, support data-driven hiring decisions, and make resume review more consistent.

## Key Features

- Resume matching using text preprocessing and TF-IDF vectorization
- Shortlisting scores based on skills, keywords, experience, and relevance
- Machine learning pipeline with synthetic supervised labels for prototype scoring
- Recruiter dashboard with adjustable score threshold and result limits
- Structured candidate table with CSV shortlist download
- Modular codebase for extending resume parsing, scoring, and dashboard features

## How It Works

1. The recruiter enters or edits a job description in the dashboard.
2. Sample resumes are loaded with candidate names, titles, experience, skills, and summaries.
3. The model builds text and numeric features from the resumes and job description.
4. Candidates are scored and ranked by predicted shortlisting relevance.
5. The recruiter filters applicants and downloads the final shortlist.

## Tech Stack

- Python
- Streamlit
- pandas
- NumPy
- scikit-learn

## Project Files

- `app.py` - Streamlit dashboard and UI controls
- `data.py` - sample resumes and job description data
- `model.py` - resume feature pipeline and scoring logic
- `requirements.txt` - Python dependencies

## Setup

1. Create a Python virtual environment:

   ```bash
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the dashboard from the repository root:

   ```bash
   streamlit run smart_resume_shortlisting/app.py
   ```

## Future Enhancements

- Add PDF and DOCX resume upload with automated text extraction
- Replace synthetic labels with real hiring or shortlisting data
- Improve scoring with named entity extraction, embeddings, and skill taxonomy matching
- Add bias monitoring, anonymized review mode, and audit logs
- Include recruiter notes, candidate status tracking, and role-based shortlists
