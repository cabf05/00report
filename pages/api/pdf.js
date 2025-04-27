import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { companyName, documentTitle, marketDescription, marketSize, marketGrowth } = req.body;

  // 1) Monte seu HTML A4 inline
  const html = `
  <html><head>
    <meta charset="utf-8"/>
    <style>
      @page { size: A4; margin: 0 }
      body {
        font-family: Arial, sans-serif;
        color: #0A3161;
        padding: 16px;
        box-sizing: border-box;
      }
      .header { display:flex; justify-content:space-between; border-bottom:2px solid #C4A962; padding-bottom:8px; margin-bottom:16px }
      .title { font-size:18px; font-weight:bold; margin:0 }
      .subtitle { font-size:10px; font-weight:500; margin:0 }
      .conf { font-size:10px; background:#C4A962; opacity:0.2; padding:4px 8px }
      h2 { font-size:14px; font-weight:bold; border-left:4px solid #C4A962; padding-left:4px; margin:0 0 8px }
      p { font-size:12px; line-height:1.4; margin:0 0 12px }
      .row { display:flex; gap:8px }
      .card { flex:1; background:#F3F6F9; padding:8px; border-radius:4px }
      .card h3 { margin:0 0 4px; font-size:10px; color:#666 }
      .card p { margin:0; font-size:16px; font-weight:bold }
    </style>
  </head><body>
    <div class="header">
      <div>
        <div class="title">${companyName}</div>
        <div class="subtitle">${documentTitle}</div>
      </div>
      <div class="conf">Confidential</div>
    </div>
    <h2>Market Overview</h2>
    <p>${marketDescription}</p>
    <div class="row">
      <div class="card"><h3>MARKET SIZE</h3><p>${marketSize}</p></div>
      <div class="card"><h3>GROWTH RATE</h3><p>${marketGrowth}</p></div>
    </div>
  </body></html>`;

  // 2) Launch headless Chrome via Sparticuz Chromium
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // 3) Gerar PDF A4
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top:0, bottom:0, left:0, right:0 }
  });
  await browser.close();

  // 4) Entrega
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
}
