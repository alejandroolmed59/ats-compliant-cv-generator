#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const HTMLToPDF = require('puppeteer-html-pdf');

const htmlPath = path.join(__dirname, 'index.html');
const outputPath = path.join(__dirname, 'resume.pdf');

if (!fs.existsSync(htmlPath)) {
  console.error('Error: index.html not found. Run "node build.js" first.');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf-8');

const options = {
  //format: 'A4',
  printBackground: true,
  scale: 1,
  width: "219mm",
  height: "465mm",
};

HTMLToPDF.create(html, options)
  .then(buffer => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`✓ resume.pdf generated`);
  })
  .catch(err => {
    console.error('PDF generation failed:', err.message);
    process.exit(1);
  });
