import pandas as pd
import streamlit as st
from smart_resume_shortlisting.data import load_sample_resumes
from smart_resume_shortlisting.model import build_shortlisting_pipeline, score_resumes

st.set_page_config(page_title="Smart Resume Shortlisting", layout="wide")

st.title("Smart Resume Shortlisting System")
st.write(
    "A demo platform that scans resumes against a job description and ranks candidates by skills, experience, and relevance."
)

job_description = st.text_area(
    "Job Description",
    value=(
        "Looking for a Machine Learning Engineer with strong NLP, Python, feature engineering, "
        "scikit-learn, and experience building recruiter-facing dashboards."
    ),
    height=220,
)

resumes_df = load_sample_resumes()

with st.sidebar:
    st.header("Controls")
    score_threshold = st.slider("Minimum shortlist score", 0.0, 1.0, 0.35, 0.05)
    max_results = st.number_input("Max candidates to show", min_value=1, max_value=20, value=8)
    show_resume_table = st.checkbox("Show resume dataset", value=True)

if show_resume_table:
    st.subheader("Sample Resumes")
    st.dataframe(resumes_df[['name', 'title', 'experience_years', 'skills']])

pipeline = build_shortlisting_pipeline()
shortlist_df = score_resumes(pipeline, job_description, resumes_df)
shortlist_df = shortlist_df[shortlist_df['shortlist_score'] >= score_threshold].head(max_results)

st.subheader("Shortlisted Candidates")
if shortlist_df.empty:
    st.warning("No candidates meet the selected minimum score. Try lowering the threshold or changing the job description.")
else:
    st.dataframe(shortlist_df[['name', 'title', 'experience_years', 'skills', 'shortlist_score']])

csv = shortlist_df.to_csv(index=False).encode('utf-8')

st.download_button(
    label="Download shortlist as CSV",
    data=csv,
    file_name='resume_shortlist.csv',
    mime='text/csv',
)
