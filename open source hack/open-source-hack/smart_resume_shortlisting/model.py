import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline


class ResumeFeatureTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2), max_features=300)
        self.scaler = StandardScaler()

    def fit(self, X, y=None):
        self.vectorizer.fit(X['text'])
        self.scaler.fit(X[['experience_years', 'skill_count']])
        return self

    def transform(self, X):
        text_matrix = self.vectorizer.transform(X['text']).toarray()
        numeric_matrix = self.scaler.transform(X[['experience_years', 'skill_count']])
        return np.hstack([text_matrix, numeric_matrix])


def build_shortlisting_pipeline() -> Pipeline:
    return Pipeline([
        ('features', ResumeFeatureTransformer()),
        ('classifier', LogisticRegression(max_iter=400, solver='liblinear')),
    ])


def build_training_data(resumes: pd.DataFrame, job_description: str) -> pd.DataFrame:
    job_words = set(job_description.lower().split())
    training_rows = []
    for _, resume in resumes.iterrows():
        text = f"{resume['summary']} {resume['skills']}".lower()
        match_count = sum(1 for word in job_words if word in text)
        experience = resume['experience_years']
        skill_count = len([s for s in resume['skills'].split(',') if s.strip()])
        label = 1 if match_count >= 4 or experience >= 5 else 0
        training_rows.append({
            'text': text + ' ' + job_description.lower(),
            'experience_years': experience,
            'skill_count': skill_count,
            'label': label,
        })
    return pd.DataFrame(training_rows)


def score_resumes(pipeline: Pipeline, job_description: str, resumes: pd.DataFrame) -> pd.DataFrame:
    resumes = resumes.copy()
    resumes['text'] = (
        resumes['summary'].fillna('') + ' ' + resumes['skills'].fillna('') + ' ' + job_description
    )
    resumes['skill_count'] = resumes['skills'].apply(lambda value: len([s for s in value.split(',') if s.strip()]))

    training_data = build_training_data(resumes, job_description)
    pipeline.fit(training_data[['text', 'experience_years', 'skill_count']], training_data['label'])

    probabilities = pipeline.predict_proba(resumes[['text', 'experience_years', 'skill_count']])[:, 1]
    resumes['shortlist_score'] = np.round(probabilities, 3)
    return resumes.sort_values('shortlist_score', ascending=False)
