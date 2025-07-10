// pages/index.jsx
import { useState } from 'react';

export default function Home() {
  const [useRawHtml, setUseRawHtml]       = useState(false);
  const [rawHtml, setRawHtml]             = useState('');
  const [companyName, setCompanyName]     = useState('WindServe Brasil');
  const [documentTitle, setDocumentTitle] = useState('Investment Opportunity');
  const [confidential, setConfidential]   = useState('Strictly Confidential - 2025');
  const [marketDescription, setMarketDescription] = useState(
    `Brazil's renewable energy sector is experiencing rapid growth, with wind energy leading the expansion in the country's northeastern region.`
  );
  const [marketSize, setMarketSize]       = useState('R$4.8 billion');
  const [marketGrowth, setMarketGrowth]   = useState('17.5% CAGR');
  const [revenueData, setRevenueData]     = useState(JSON.stringify([
    { year: '2022', value: 80 },
    { year: '2023', value: 150 },
    { year: '2024', value: 230 },
    { year: '2025E', value: 320 },
    { year: '2026E', value: 450 }
  ], null, 2));
  const [ebitdaData, setEbitdaData]       = useState(JSON.stringify([
    { year: '2022', value: 30 },
    { year: '2023', value: 45 },
    { year: '2024', value: 60 },
    { year: '2025E', value: 80 },
    { year: '2026E', value: 140 }
  ], null, 2));
  const [kpis, setKpis]                   = useState(JSON.stringify([
    { label: 'Contracts', value: '42', change: '+24%', positive: true },
    { label: 'Avg Contract Value', value: 'R$3.2M', change: '+15%', positive: true },
    { label: 'Retention Rate', value: '94%', change: '+2%', positive: true },
    { label: 'Maintenance Time', value: '-35%', change: '-5%', positive: false }
  ], null, 2));
  const [businessDescription, setBusinessDescription] = useState(
    `Leading provider of comprehensive maintenance services for wind farms across Brazil, specializing in predictive maintenance, repair services, and performance optimization for wind turbines and related infrastructure.`
  );
  const [strengths, setStrengths]         = useState(
    `Proprietary AI diagnostic technology reducing turbine downtime by 35%\nService contracts with 8 of the 10 largest wind farms in Brazil\nHighly trained technical team with specialized certifications\nFleet of specialized vehicles and equipment for high-altitude maintenance`
  );
  const [transactionObjective, setTransactionObjective] = useState(
    `WindServe Brasil is seeking a strategic partner to accelerate growth across Latin America and fund technology development to expand service offerings.`
  );
  const [potentialStructures, setPotentialStructures]   = useState(
    `Minority equity investment (25–40%)\nStrategic merger with complementary service provider\nTechnology licensing partnerships\nJoint venture for international expansion`
  );
  const [contactPerson, setContactPerson] = useState('Ana Silva, Investment Relations');
  const [disclaimer, setDisclaimer]       = useState('This teaser document contains confidential and proprietary information.');
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [pdfUrl, setPdfUrl]               = useState('');

  const generatePdf = async () => {
    setLoading(true);
    setError('');
    setPdfUrl('');
    
    let payload;

    if (useRawHtml) {
      if (!rawHtml.trim()) {
        setError('Cole algum HTML antes de gerar.');
        setLoading(false);
        return;
      }
      payload = { rawHtml };
    } else {
      try {
        payload = {
          companyName,
          documentTitle,
          confidential,
          marketDescription,
          marketSize,
          marketGrowth,
          revenueData: JSON.parse(revenueData),
          ebitdaData: JSON.parse(ebitdaData),
          kpis: JSON.parse(kpis),
          businessDescription,
          strengths: strengths.split('\n'),
          transactionObjective,
          potentialStructures: potentialStructures.split('\n'),
          contactPerson,
          disclaimer
        };
      } catch (e) {
        setError('Verifique os campos em JSON: ' + e.message);
        setLoading(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      setPdfUrl(url);
      
      // Abrir em nova aba
      const newWin = window.open(url, '_blank');
      if (!newWin) {
        // Fallback para download se popup foi bloqueado
        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (err) {
      setError('Erro ao gerar PDF: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Blind Teaser Builder</h1>

      <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={useRawHtml}
          onChange={() => setUseRawHtml(v => !v)}
        />
        Usar HTML cru em vez do formulário
      </label>

      {useRawHtml ? (
        <>
          <textarea
            value={rawHtml}
            onChange={e => setRawHtml(e.target.value)}
            placeholder="Cole aqui seu HTML completo…"
            style={{ width: '100%', height: 300, fontFamily: 'monospace', padding: 8 }}
          />
          <div style={{ marginTop: 16, border: '1px solid #DDD', minHeight: 400 }}>
            <iframe
              title="Pré-visualização HTML"
              srcDoc={rawHtml}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <label>
            Company Name
            <input
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Document Title
            <input
              value={documentTitle}
              onChange={e => setDocumentTitle(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Confidentiality Flag
            <input
              value={confidential}
              onChange={e => setConfidential(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Market Overview
            <textarea
              value={marketDescription}
              onChange={e => setMarketDescription(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <label style={{ flex: 1, minWidth: 120 }}>
              Market Size
              <input
                value={marketSize}
                onChange={e => setMarketSize(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
            <label style={{ flex: 1, minWidth: 120 }}>
              Growth Rate
              <input
                value={marketGrowth}
                onChange={e => setMarketGrowth(e.target.value)}
                style={{ width: '100%', padding: 8, marginTop: 4 }}
              />
            </label>
          </div>

          <label>
            Revenue Data (JSON)
            <textarea
              value={revenueData}
              onChange={e => setRevenueData(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            EBITDA Data (JSON)
            <textarea
              value={ebitdaData}
              onChange={e => setEbitdaData(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            KPIs (JSON array)
            <textarea
              value={kpis}
              onChange={e => setKpis(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            Business Description
            <textarea
              value={businessDescription}
              onChange={e => setBusinessDescription(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            Strengths (one per line)
            <textarea
              value={strengths}
              onChange={e => setStrengths(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            Transaction Objective
            <textarea
              value={transactionObjective}
              onChange={e => setTransactionObjective(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            Potential Structures (one per line)
            <textarea
              value={potentialStructures}
              onChange={e => setPotentialStructures(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>

          <label>
            Contact Person & Title
            <input
              value={contactPerson}
              onChange={e => setContactPerson(e.target.value)}
              style={{ width: '100%', padding: 8, marginTop: 4 }}
            />
          </label>

          <label>
            Disclaimer
            <textarea
              value={disclaimer}
              onChange={e => setDisclaimer(e.target.value)}
              rows={2}
              style={{ width: '100%', padding: 8, marginTop: 4, fontFamily: 'monospace' }}
            />
          </label>
        </div>
      )}

      <button
        onClick={generatePdf}
        disabled={loading}
        style={{
          marginTop: 20,
          width: '100%',
          padding: 12,
          background: loading ? '#ccc' : '#0A3161',
          color: 'white',
          fontSize: 16,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Gerando PDF…' : 'Gerar PDF'}
      </button>

      {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

      {pdfUrl && (
        <div style={{ marginTop: 20 }}>
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            Visualizar PDF
          </a>
        </div>
      )}
    </div>
  );
}
