const defaultJobDescription =
  "Looking for a Machine Learning Engineer with strong NLP, Python, feature engineering, scikit-learn, and experience building recruiter-facing dashboards.";

const resumes = [
  {
    name: "Asha Patel",
    title: "Machine Learning Engineer",
    experience: 6,
    skills: ["Python", "NLP", "scikit-learn", "feature engineering", "data visualization"],
    summary: "Delivered resume ranking and candidate shortlisting tools for HR technology products."
  },
  {
    name: "Rohan Singh",
    title: "Data Scientist",
    experience: 4,
    skills: ["SQL", "Python", "dashboarding", "statistics", "business analysis"],
    summary: "Built recruiter dashboards and data-driven candidate selection workflows."
  },
  {
    name: "Neha Gupta",
    title: "NLP Researcher",
    experience: 3,
    skills: ["Python", "NLP", "transformers", "text classification", "feature engineering"],
    summary: "Worked on natural language processing models to improve resume parsing and keyword matching."
  },
  {
    name: "Arjun Kumar",
    title: "Software Engineer",
    experience: 8,
    skills: ["Java", "cloud platforms", "product analytics", "stakeholder management"],
    summary: "Designed enterprise hiring tools and recruiter analytics platforms."
  },
  {
    name: "Meera Nair",
    title: "HR Analytics Specialist",
    experience: 5,
    skills: ["HR analytics", "Excel", "Power BI", "candidate screening", "reporting"],
    summary: "Created hiring dashboards and recruiter productivity reports for talent teams."
  },
  {
    name: "Kabir Mehta",
    title: "Frontend Developer",
    experience: 2,
    skills: ["HTML", "CSS", "JavaScript", "React", "UI development"],
    summary: "Built responsive dashboards and internal workflow tools for business users."
  }
];

let currentShortlist = [];

const jobDescription = document.getElementById("jobDescription");
const scoreThreshold = document.getElementById("scoreThreshold");
const thresholdValue = document.getElementById("thresholdValue");
const maxCandidates = document.getElementById("maxCandidates");
const resultsBody = document.getElementById("resultsBody");
const totalCandidates = document.getElementById("totalCandidates");
const shortlistedCount = document.getElementById("shortlistedCount");
const topScore = document.getElementById("topScore");
const rankBtn = document.getElementById("rankBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function uniqueWords(text) {
  return [...new Set(normalizeText(text))];
}

function calculateScore(resume, jobText) {
  const jobWords = uniqueWords(jobText);
  const resumeText = `${resume.title} ${resume.skills.join(" ")} ${resume.summary}`;
  const resumeWords = uniqueWords(resumeText);
  const resumeBlob = resumeText.toLowerCase();

  const keywordMatches = jobWords.filter((word) => resumeWords.includes(word)).length;
  const keywordScore = jobWords.length ? keywordMatches / jobWords.length : 0;

  const skillMatches = resume.skills.filter((skill) =>
    jobText.toLowerCase().includes(skill.toLowerCase())
  ).length;
  const skillScore = resume.skills.length ? skillMatches / resume.skills.length : 0;

  const experienceScore = Math.min(resume.experience / 8, 1);
  const relevanceBoost = ["resume", "shortlisting", "recruiter", "dashboard", "hiring"].filter((word) =>
    resumeBlob.includes(word) && jobText.toLowerCase().includes(word)
  ).length * 0.03;

  const finalScore =
    keywordScore * 0.45 + skillScore * 0.35 + experienceScore * 0.17 + relevanceBoost;

  return Math.min(Math.round(finalScore * 100), 100);
}

function getScoreClass(score) {
  if (score >= 70) return "high";
  if (score >= 45) return "medium";
  return "low";
}

function rankCandidates() {
  const threshold = Number(scoreThreshold.value);
  const limit = Number(maxCandidates.value);

  currentShortlist = resumes
    .map((resume) => ({
      ...resume,
      score: calculateScore(resume, jobDescription.value)
    }))
    .filter((resume) => resume.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  renderResults();
}

function renderResults() {
  resultsBody.innerHTML = "";

  totalCandidates.textContent = resumes.length;
  shortlistedCount.textContent = currentShortlist.length;
  topScore.textContent = currentShortlist.length ? `${currentShortlist[0].score}%` : "0%";

  if (!currentShortlist.length) {
    resultsBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          No candidates meet the selected score. Lower the threshold or adjust the job description.
        </td>
      </tr>
    `;
    return;
  }

  currentShortlist.forEach((resume, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><strong>${resume.name}</strong><br>${resume.summary}</td>
      <td>${resume.title}</td>
      <td>${resume.experience} years</td>
      <td>${resume.skills.join(", ")}</td>
      <td><span class="score ${getScoreClass(resume.score)}">${resume.score}%</span></td>
    `;
    resultsBody.appendChild(row);
  });
}

function downloadCSV() {
  if (!currentShortlist.length) {
    alert("No shortlisted candidates to download.");
    return;
  }

  const header = ["Rank", "Name", "Title", "Experience", "Skills", "Score"];
  const rows = currentShortlist.map((resume, index) => [
    index + 1,
    resume.name,
    resume.title,
    `${resume.experience} years`,
    resume.skills.join("; "),
    `${resume.score}%`
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "resume_shortlist.csv";
  link.click();
  URL.revokeObjectURL(url);
}

scoreThreshold.addEventListener("input", () => {
  thresholdValue.textContent = `${scoreThreshold.value}%`;
  rankCandidates();
});

maxCandidates.addEventListener("change", rankCandidates);
rankBtn.addEventListener("click", rankCandidates);
downloadBtn.addEventListener("click", downloadCSV);

resetBtn.addEventListener("click", () => {
  jobDescription.value = defaultJobDescription;
  scoreThreshold.value = 35;
  maxCandidates.value = 8;
  thresholdValue.textContent = "35%";
  rankCandidates();
});

rankCandidates();
