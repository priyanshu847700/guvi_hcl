const searchBtn = document.getElementById("searchBtn");
const topicInput = document.getElementById("topicInput");
const loading = document.getElementById("loading");
const results = document.getElementById("results");
const summaryDiv = document.getElementById("summary");
const sourcesList = document.getElementById("sources");
const downloadBtn = document.getElementById("downloadBtn");

// Simulated data for demo
function mockResearchData(topic) {
  return {
    summaryPoints: [
      "A new drug called NeuroCureX has shown 30% improvement in early-stage patients (Source: Science Daily, March 2025).",
      "A novel blood test can detect early biomarkers years in advance (Source: Nature Medicine, Jan 2025)."
    ],
    debate: "Some researchers argue current trials lack diversity in participants.",
    sources: [
      {
        title: "Experimental drug NeuroCureX shows promise",
        url: "https://www.sciencedaily.com/releases/2025/03/2503011234.htm",
        date: "March 2025",
        domain: "sciencedaily.com"
      },
      {
        title: "Blood-based detection of Alzheimer's biomarkers",
        url: "https://www.nature.com/articles/s41591-025-01234-5",
        date: "January 2025",
        domain: "nature.com"
      },
      {
        title: "Clinical trials landscape in 2025",
        url: "https://www.alzforum.org/clinical-trials/2025",
        date: "",
        domain: "alzforum.org"
      }
    ]
  };
}

function displayResults(data) {
  // Build summary text with bullet points and debate
  let summaryText = "";
  data.summaryPoints.forEach((point, i) => {
    summaryText += `• Breakthrough #${i + 1}: ${point}\n`;
  });
  if (data.debate) {
    summaryText += `\nDebate: ${data.debate}`;
  }
  summaryDiv.textContent = summaryText;

  // Build sources list
  sourcesList.innerHTML = "";
  data.sources.forEach(src => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = src.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = src.title;
    li.appendChild(a);
    if (src.date) {
      li.appendChild(document.createTextNode(` (${src.date})`));
    }
    li.appendChild(document.createTextNode(` - `));
    const domainSpan = document.createElement("em");
    domainSpan.textContent = src.domain;
    li.appendChild(domainSpan);
    sourcesList.appendChild(li);
  });
}

function generateMarkdown(topic, data) {
  let md = `# Research Summary: ${topic}\n\n## Summary\n`;
  data.summaryPoints.forEach((point, i) => {
    md += `- **Breakthrough #${i + 1}:** ${point}\n`;
  });
  if (data.debate) {
    md += `\n*Debate:* ${data.debate}\n`;
  }
  md += `\n## Sources\n`;
  data.sources.forEach(src => {
    md += `- [${src.title}](${src.url})${src.date ? ` (${src.date})` : ""} - _${src.domain}_\n`;
  });
  return md;
}

function downloadMarkdown(content, filename) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

searchBtn.addEventListener("click", () => {
  const topic = topicInput.value.trim();
  if (!topic) {
    alert("Please enter a research topic or query.");
    return;
  }

  // Show loading, hide results
  loading.classList.remove("hidden");
  results.classList.add("hidden");

  // Simulate async search + summarization (replace with real API calls)
  setTimeout(() => {
    const data = mockResearchData(topic);
    displayResults(data);
    loading.classList.add("hidden");
    results.classList.remove("hidden");

    // Save current data for download
    downloadBtn.dataset.topic = topic;
    downloadBtn.dataset.summary = JSON.stringify(data);
  }, 1800);
});

downloadBtn.addEventListener("click", () => {
  const topic = downloadBtn.dataset.topic;
  const data = JSON.parse(downloadBtn.dataset.summary);
  if (!topic || !data) return;

  const mdContent = generateMarkdown(topic, data);
  const safeFilename = topic.replace(/\W+/g, "_").toLowerCase();
  downloadMarkdown(mdContent, `Research_Summary_${safeFilename}.md`);
});