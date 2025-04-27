// pages/api/pdf.js
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const {
    companyName, documentTitle, confidential,
    marketDescription, marketSize, marketGrowth,
    revenueData, ebitdaData, kpis,
    businessDescription, strengths,
    transactionObjective, potentialStructures,
    contactPerson, disclaimer
  } = req.body;

  // 1) HTML + Chart.js via CDN
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <style>
      @page { size: A4; margin: 0 }
      * { box-sizing: border-box; }
      body {
        font-family: Arial, sans-serif;
        color: #0A3161;
        margin: 0; padding: 16px;
        width: 210mm; height: 297mm;
      }
      .header {
        display: flex; justify-content: space-between;
        border-bottom: 2px solid #C4A962; padding-bottom: 8px; margin-bottom: 16px;
      }
      .title { font-size: 18px; font-weight: bold; margin: 0 }
      .subtitle { font-size: 10px; margin: 0 }
      .conf { font-size: 10px; background: #C4A962; opacity: 0.2; padding: 4px 8px; }
      .section { margin-bottom: 16px }
      h2 {
        font-size: 14px; font-weight: bold;
        border-left: 4px solid #C4A962; padding-left:4px; margin:0 0 8px 0;
      }
      p { font-size:12px; line-height:1.4; margin:0 0 8px 0 }
      .row { display:flex; gap:8px; }
      .card {
        flex:1;
        background:#F3F6F9;
        padding:8px;
        border-radius:4px;
      }
      .card h3 { margin:0 0 4px 0; font-size:10px; color:#666 }
      .card p { margin:0; font-size:16px; font-weight:bold }
      .flex { display:flex; gap:8px }
      .kpis { display:flex; gap:8px; flex-wrap:wrap; margin:0 -4px }
      .kpi {
        flex:1; min-width:45mm;
        background:#F3F6F9; padding:8px; border-radius:4px; margin:0 4px 8px;
      }
      .kpi h4 { margin:0; font-size:10px; color:#666 }
      .kpi p { margin:4px 0 0; font-size:16px; font-weight:bold }
      .kpi .chg { font-size:10px; margin-top:4px; display:block }
      .two-cols { display:flex; gap:16px }
      .col { flex:1 }
      .footer {
        position:absolute; bottom:16px; left:16px; right:16px;
        font-size:9px; text-align:center; color:#666;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  </head>
  <body>
    <div class="header">
      <div>
        <div class="title">${companyName}</div>
        <div class="subtitle">${documentTitle}</div>
      </div>
      <div class="conf">${confidential}</div>
    </div>

    <div class="section">
      <h2>Market Overview</h2>
      <p>${marketDescription}</p>
      <div class="row">
        <div class="card"><h3>MARKET SIZE</h3><p>${marketSize}</p></div>
        <div class="card"><h3>GROWTH RATE</h3><p>${marketGrowth}</p></div>
      </div>
    </div>

    <div class="section">
      <h2>Financial Highlights</h2>
      <canvas id="revChart" width="600" height="200"></canvas>
      <p style="margin:16px 0 8px 0; font-weight:bold;">EBITDA (R$ millions)</p>
      <canvas id="ebtChart" width="600" height="200"></canvas>
    </div>

    <div class="section">
      <h2>Key Performance Indicators</h2>
      <div class="kpis">
        ${kpis.map(k=>`
          <div class="kpi">
            <h4>${k.label.toUpperCase()}</h4>
            <p>${k.value}</p>
            <span class="chg" style="color:${k.positive?'green':'red'}">
              ${k.change}
            </span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="two-cols section">
      <div class="col">
        <h2>Company Overview</h2>
        <p>${businessDescription}</p>
        <div class="card">
          <h3>KEY STRENGTHS</h3>
          <ul>
            ${strengths.map(s=>`<li style="font-size:10px">${s}</li>`).join('')}
          </ul>
        </div>
      </div>
      <div class="col">
        <h2>Transaction</h2>
        <p>${transactionObjective}</p>
        <div class="card">
          <h3>POTENTIAL STRUCTURES</h3>
          <ul>
            ${potentialStructures.map(s=>`<li style="font-size:10px">${s}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      ${contactPerson} — ${disclaimer}
    </div>

    <script>
      // aguarde o Chart.js carregar
      setTimeout(()=>{
        const revCtx = document.getElementById('revChart').getContext('2d');
        new Chart(revCtx, {
          type: 'bar',
          data: {
            labels: ${JSON.stringify(revenueData.map(r=>r.year))},
            datasets: [{
              data: ${JSON.stringify(revenueData.map(r=>r.value))},
              backgroundColor: '#0A3161',
              borderRadius: 4
            }]
          },
          options: { responsive:false, scales:{ x:{grid:{display:false}}, y:{beginAtZero:true}}}
        });
        const ebtCtx = document.getElementById('ebtChart').getContext('2d');
        new Chart(ebtCtx, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(ebitdaData.map(r=>r.year))},
            datasets: [{
              data: ${JSON.stringify(ebitdaData.map(r=>r.value))},
              borderColor: '#C4A962',
              fill: false,
              tension:0.4,
              pointBackgroundColor:'white',
              pointBorderColor:'#C4A962',
              pointRadius:4
            }]
          },
          options: { responsive:false, scales:{ x:{grid:{display:false}}, y:{beginAtZero:true}}}
        });
        window.chartRendered = true;
      }, 500);
    </script>
  </body>
  </html>`;

  // 2) Launch headless Chrome
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.chartRendered === true', { timeout: 5000 });

  // 3) Gerar PDF
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top:0, bottom:0, left:0, right:0 }
  });
  await browser.close();

  // 4) Retornar
  res.setHeader('Content-Type','application/pdf');
  res.send(pdf);
}
