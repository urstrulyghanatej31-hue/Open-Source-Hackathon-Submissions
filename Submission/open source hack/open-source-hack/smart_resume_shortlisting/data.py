import pandas as pd

sample_resumes = [
    {
        'name': 'Asha Patel',
        'title': 'Machine Learning Engineer',
        'experience_years': 6,
        'skills': 'Python, NLP, scikit-learn, feature engineering, data visualization',
        'summary': 'Delivered resume ranking and candidate shortlisting tools for HR technology products.',
    },
    {
        'name': 'Rohan Singh',
        'title': 'Data Scientist',
        'experience_years': 4,
        'skills': 'SQL, Python, dashboarding, statistics, business analysis',
        'summary': 'Built recruiter dashboards and data-driven candidate selection workflows.',
    },
    {
        'name': 'Neha Gupta',
        'title': 'NLP Researcher',
        'experience_years': 3,
        'skills': 'Python, NLP, transformers, text classification, feature engineering',
        'summary': 'Worked on natural language processing models to improve resume parsing and keyword matching.',
    },
    {
        'name': 'Arjun Kumar',
        'title': 'Software Engineer',
        'experience_years': 8,
        'skills': 'Java, cloud platforms, product analytics, stakeholder management',
        'summary': 'Designed enterprise hiring tools and recruiter analytics platforms.',
    },
]

sample_job_descriptions = [
    'Hiring a Machine Learning Engineer with strong NLP, Python, feature engineering, scikit-learn, and recruiter dashboard experience.',
]


def load_sample_resumes() -> pd.DataFrame:
    return pd.DataFrame(sample_resumes)
