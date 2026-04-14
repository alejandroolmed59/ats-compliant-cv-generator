#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const resumePath = path.join(__dirname, 'resume.json');
const outputPath = path.join(__dirname, 'index.html');

if (!fs.existsSync(resumePath)) {
  console.error('Error: resume.json not found.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Contact line builder ──────────────────────────────────────────────────────
function buildContactLine(contact) {
  const parts = [];
  if (contact.location) parts.push(esc(contact.location));
  if (contact.email) parts.push(`<a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a>`);
  if (contact.phone) parts.push(esc(contact.phone));
  // make both links to have a placeholder text
  if (contact.linkedin) parts.push(`<a href="https://${esc(contact.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
  if (contact.github) parts.push(`<a href="https://${esc(contact.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  if (contact.portfolio) parts.push(`<a href="https://${esc(contact.portfolio)}" target="_blank" rel="noopener noreferrer">Portfolio</a>`);
  return parts.join(' &nbsp;|&nbsp; ');
}

// ── Section helpers ───────────────────────────────────────────────────────────
function sectionTitle(label) {
  return `<h2 class="section-title">${esc(label)}</h2>`;
}

function buildSummary(summary) {
  if (!summary) return '';
  return `
  <section aria-label="Summary">
    ${sectionTitle('Professional Summary')}
    <p class="summary-text">${esc(summary)}</p>
  </section>`;
}

function buildExperience(experience) {
  if (!experience || !experience.length) return '';
  const entries = experience.map(job => {
    const bullets = (job.bullets || []).map(b => `<li>${esc(b)}</li>`).join('\n          ');
    return `
    <div class="exp-entry">
      <div class="exp-header">
        <strong class="exp-role">${esc(job.role)}</strong>
        <span class="exp-date">${esc(job.startDate)} &ndash; ${esc(job.endDate)}</span>
      </div>
      <div class="exp-company">${esc(job.company)}${job.location ? `, ${esc(job.location)}` : ''}</div>
      <ul class="exp-bullets">
          ${bullets}
      </ul>
    </div>`;
  }).join('');
  return `
  <section aria-label="Work Experience">
    ${sectionTitle('Work Experience')}
    ${entries}
  </section>`;
}

function buildEducation(education) {
  if (!education || !education.length) return '';
  const entries = education.map(edu => `
    <div class="edu-entry">
      <strong class="edu-degree">${esc(edu.degree)}</strong>
      <div class="edu-school">${esc(edu.institution)}${edu.location ? `, ${esc(edu.location)}` : ''}</div>
      <div class="edu-date">Graduated: ${esc(edu.graduationDate)}</div>
    </div>`).join('');
  return `
  <section aria-label="Education">
    ${sectionTitle('Education')}
    ${entries}
  </section>`;
}

function buildSkills(skills) {
  if (!skills || !skills.length) return '';
  const items = skills.map(s => `<li>${esc(s)}</li>`).join('\n      ');
  return `
  <section aria-label="Skills">
    ${sectionTitle('Skills')}
    <ul class="inline-list">
      ${items}
    </ul>
  </section>`;
}

function buildTechStack(techStack) {
  if (!techStack || !techStack.length) return '';
  const tags = techStack.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('\n      ');
  return `
  <section aria-label="Tech Stack">
    ${sectionTitle('Tech Stack')}
    <div class="tech-grid">
      ${tags}
    </div>
  </section>`;
}

function buildCertifications(certifications) {
  if (!certifications || !certifications.length) return '';
  const items = certifications.map(c => `<li>${esc(c.name)} &mdash; <span class="meta">${esc(c.issuer)}${c.dateIssued ? `, ${esc(c.dateIssued)}` : ''}</span></li>`).join('\n      ');
  return `
  <section aria-label="Certifications">
    ${sectionTitle('Certifications')}
    <ul class="cert-list">
      ${items}
    </ul>
  </section>`;
}

function buildLanguages(languages) {
  if (!languages || !languages.length) return '';
  const items = languages.map(l => `<li><strong>${esc(l.name)}</strong> &ndash; ${esc(l.level)}</li>`).join('\n      ');
  return `
  <section aria-label="Languages">
    ${sectionTitle('Languages')}
    <ul class="lang-list">
      ${items}
    </ul>
  </section>`;
}

// ── Assemble HTML ─────────────────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(data.name)} – CV</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Arial', 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 11pt;
      color: #1a1a1a;
      background: #f4f4f4;
      padding: 32px 16px;
    }

    .page {
      max-width: 760px;
      margin: 0 auto;
      background: #ffffff;
      padding: 48px 52px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
    }

    /* ── Header ── */
    .cv-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .cv-header h1 {
      font-size: 24pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #1a1a1a;
    }

    .cv-header .cv-title {
      font-size: 11pt;
      font-weight: 700;
      color: #1a1a1a;
      margin-top: 6px;
    }

    .cv-header .cv-contact {
      font-size: 9.5pt;
      color: #1a1a1a;
      margin-top: 5px;
      line-height: 1.7;
    }

    .cv-header .cv-contact a {
      color: #1a1a1a;
      text-decoration: none;
    }

    /* ── Section titles ── */
    section {
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 11pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1a1a1a;
      border-bottom: 1.5px solid #1a1a1a;
      padding-bottom: 3px;
      margin-bottom: 10px;
    }

    /* ── Summary ── */
    .summary-text {
      font-size: 10pt;
      line-height: 1.65;
    }

    /* ── Experience ── */
    .exp-entry {
      margin-bottom: 14px;
    }

    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 4px;
    }

    .exp-role {
      font-size: 10.5pt;
      font-weight: 700;
    }

    .exp-date {
      font-size: 9.5pt;
      color: #1a1a1a;
    }

    .exp-company {
      font-size: 9.5pt;
      font-style: italic;
      color: #1a1a1a;
      margin-bottom: 5px;
    }

    .exp-bullets {
      list-style: disc;
      padding-left: 18px;
    }

    .exp-bullets li {
      font-size: 10pt;
      line-height: 1.55;
      margin-bottom: 3px;
    }

    /* ── Education ── */
    .edu-entry {
      margin-bottom: 10px;
    }

    .edu-degree {
      font-size: 10.5pt;
      font-weight: 700;
      display: block;
    }

    .edu-school {
      font-size: 9.5pt;
      font-style: italic;
    }

    .edu-date {
      font-size: 9.5pt;
      color: #1a1a1a;
    }

    /* ── Skills ── */
    .inline-list {
      list-style: disc;
      padding-left: 18px;
      columns: 2;
      column-gap: 32px;
    }

    .inline-list li {
      font-size: 10pt;
      line-height: 1.6;
      break-inside: avoid;
    }

    /* ── Tech Stack ── */
    .tech-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .tech-tag {
      font-size: 9pt;
      color: #1a1a1a;
      border: 1px solid #888;
      padding: 2px 9px;
      border-radius: 2px;
    }

    /* ── Certifications ── */
    .cert-list {
      list-style: disc;
      padding-left: 18px;
    }

    .cert-list li {
      font-size: 10pt;
      line-height: 1.6;
      margin-bottom: 3px;
    }

    .meta {
      color: #444;
      font-style: italic;
    }

    /* ── Languages ── */
    .lang-list {
      list-style: disc;
      padding-left: 18px;
      columns: 2;
      column-gap: 32px;
    }

    .lang-list li {
      font-size: 10pt;
      line-height: 1.6;
    }

    @media print {
      body { background: white; padding: 0; }
      .page { box-shadow: none; padding: 32px 40px; }
    }
  </style>
</head>
<body>
  <div class="page">

    <header class="cv-header">
      <h1>${esc(data.name)}</h1>
      ${data.title ? `<p class="cv-title">${esc(data.title)}</p>` : ''}
      <p class="cv-contact">${buildContactLine(data.contact || {})}</p>
    </header>

    ${buildSummary(data.summary)}
    ${buildExperience(data.experience)}
    ${buildEducation(data.education)}
    ${buildSkills(data.skills)}
    ${buildTechStack(data.techStack)}
    ${buildCertifications(data.certifications)}
    ${buildLanguages(data.languages)}

  </div>
</body>
</html>`;

fs.writeFileSync(outputPath, html, 'utf-8');
console.log(`✓ index.html generated from resume.json`);
