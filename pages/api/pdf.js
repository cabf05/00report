// pages/api/pdf.js
import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { rawHtml } = req.body;
  let html;

  if (rawHtml) {
    // Use the user‐provided HTML directly
    html = rawHtml;
  } else {
    // Build from template fields
    const {
      companyName, documentTitle, confidential,
      marketDescription, marketSize, marketGrowth,
      revenueData, ebitdaData, kpis,
      businessDescription, strengths,
      transactionObjective, potentialStructures,
      contactPerson, disclaimer
    } = req.body;

    // Prepare arrays
    const rev = revenueData;
    const ebt = ebitdaData;
    const kpiList = kpis;
    const strengthsList = Array.isArray(strengths) ? strengths : strengths.split('\n');
    const structuresList = Array.isArray(potentialStructures)
      ? potentialStructures
      : potentialStructures.split('\n');

    html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${documentTitle}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1A1A1A; line-height: 1.4; margin:0; padding:0;}
    header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;}
    header h1 { font-size:24px; font-weight:700; margin:0; color:#003366;}
    header .date { font-size:14px; color:#666;}
    header .confidential { font-size:10px; color:#666;}
    section { margin-bottom:20px; }
    h2 { font-size:18px; font-weight:600; border-bottom:2px solid #003366; padding-bottom:4px; margin-bottom:12px;}
    .kpi-grid { display:flex; gap:20px; flex-wrap:wrap; }
    .kpi { flex:1 1 120px; background:#F5F7FA; border-radius:8px; padding:10px; text-align:center; }
    .kpi .value { font-size:20px; font-weight:700; color:#003366; }
    .kpi .label { font-size:12px; color:#555; margin-top:4px; }
    .charts { display:flex; gap:20px; }
    .charts > div { flex:1; position:relative; }
    .charts canvas { width:100% !important; height:auto !important; background:#fff; border:1px solid #DDD; border-radius:4px; }
    footer { font-size:10px; color:#999; text-align:center; border-top:1px solid #DDD; padding-top:8px; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>
</head>
<body>
  <header>
    <div>
      <h1>${companyName}</h1>
      <div class="date">${documentTitle}</div>
    </div>
    <div class="confidential">${confidential}</div>
  </header>

  <section>
    <h2>MERCADO</h2>
    <p>${marketDescription}</p>
    <div class="kpi-grid">
      <div class="kpi"><div class="value">${marketSize}</div><div class="label">Market Size</div></div>
      <div class="kpi"><div class="value">${marketGrowth}</div><div class="label">Growth Rate</div></div>
    </div>
  </section>

  <section>
    <h2>DESTAQUES FINANCEIROS</h2>
    <div class="charts">
      <div><canvas id="revenueChart"></canvas></div>
      <div><canvas id="ebitdaChart"></canvas></div>
    </div>
  </section>

  <section>
    <h2>KPIs</h2>
    <div class="kpi-grid">
      ${kpiList.map(k => `
        <div class="kpi">
          <div class="value">${k.value}</div>
          <div class="label">${k.label}</div>
          <div style="font-size:10px;color:${k.positive ? 'green' : 'red'};margin-top:4px;">${k.change}</div>
        </div>
      `).join('')}
    </div>
  </section>

  <section>
    <h2>VISÃO GERAL DA EMPRESA</h2>
    <p>${businessDescription}</p>
    <ul>
      ${strengthsList.map(s => `<li style="font-size:12px; margin-bottom:4px;">${s}</li>`).join('')}
    </ul>
  </section>

  <section>
    <h2>TRANSAÇÃO</h2>
    <p>${transactionObjective}</p>
    <ul>
      ${structuresList.map(s => `<li style="font-size:12px; margin-bottom:4px;">${s}</li>`).join('')}
    </ul>
  </section>

  <footer>
    ${contactPerson} — ${disclaimer}
  </footer>

  <script>
    Chart.register(ChartDataLabels);

    const revData = ${JSON.stringify(rev.map(r => ({ x: r.year, y: r.value })))};
    const ebtData = ${JSON.stringify(ebt.map(r => ({ x: r.year, y: r.value })))};
    const labels  = revData.map(d => d.x);
    const stepSize = 10;

    function calcMax(data) {
      const m = Math.max(...data.map(d => d.y));
      return (Math.floor(m / stepSize) + 1) * stepSize;
    }

    const revMax = calcMax(revData);
    const ebtMax = calcMax(ebtData);

    const commonOpts = max => ({
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize },
          suggestedMax: max
        }
      },
      plugins: {
        legend: { display: false },
        datalabels: {
          color: '#000',
          anchor: 'end',
          align: 'end',
          offset: 4,
          formatter: v => v,
          font: { weight: 'bold' }
        }
      }
    });

    // Receita
    new Chart(document.getElementById('revenueChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Receita (R$ M)',
          data: revData.map(d => d.y),
          backgroundColor: labels.map(l =>
            l === '2025E' ? 'rgba(0,51,102,0.3)' : 'rgba(0,51,102,0.8)'
          )
        }]
      },
      options: {
        ...commonOpts(revMax),
        plugins: {
          ...commonOpts(revMax).plugins,
          title: {
            display: true,
            text: 'Evolução da Receita (R$ milhões)',
            font: { size: 16, weight: '600' }
          }
        }
      }
    });

    // EBITDA
    new Chart(document.getElementById('ebitdaChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'EBITDA (R$ M)',
          data: ebtData.map(d => d.y),
          backgroundColor: labels.map(l =>
            l === '2025E' ? 'rgba(0,51,102,0.3)' : 'rgba(0,51,102,0.8)'
          )
        }]
      },
      options: {
        ...commonOpts(ebtMax),
        plugins: {
          ...commonOpts(ebtMax).plugins,
          title: {
            display: true,
            text: 'Evolução do EBITDA (R$ milhões)',
            font: { size: 16, weight: '600' }
          }
        }
      }
    });
  </script>
</body>
</html>`;
  }

  // Launch headless browser with larger viewport
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: chromium.headless,
    defaultViewport: { width: 1200, height: 800, deviceScaleFactor: 2 }
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
  });
  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdfBuffer);
}
