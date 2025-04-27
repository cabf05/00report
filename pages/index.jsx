// pages/index.jsx
import { useState } from 'react';

export default function Home() {
  const [companyName,       setCompanyName]       = useState('Nome da Empresa');
  const [documentTitle,     setDocumentTitle]     = useState('Blind Teaser');
  const [marketDescription, setMarketDescription] = useState('Mercado de manutenção em parques eólicos no Brasil');
  const [marketSize,        setMarketSize]        = useState('R$ 500M');
  const [marketGrowth,      setMarketGrowth]      = useState('8% a.a.');
  const [loading,           setLoading]           = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName,
        documentTitle,
        marketDescription,
        marketSize,
        marketGrowth
      })
    });
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Blind Teaser Builder</h1>

      <label style={{ display: 'block', marginBottom: 8 }}>
        Company Name
        <input
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 8 }}>
        Document Title
        <input
          value={documentTitle}
          onChange={e => setDocumentTitle(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 8 }}>
        Market Overview
        <textarea
          rows={4}
          value={marketDescription}
          onChange={e => setMarketDescription(e.target.value)}
          style={{ width: '100%', padding: 8, marginTop: 4 }}
        />
      </label>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <label style={{ flex: 1 }}>
          Market Size
          <input
            value={marketSize}
            onChange={e => setMarketSize(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
        <label style={{ flex: 1 }}>
          Growth Rate
          <input
            value={marketGrowth}
            onChange={e => setMarketGrowth(e.target.value)}
            style={{ width: '100%', padding: 8, marginTop: 4 }}
          />
        </label>
      </div>

      <button
        onClick={generatePdf}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          background: '#0A3161',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16
        }}
      >
        {loading ? 'Gerando PDF...' : 'Gerar PDF'}
      </button>
    </div>
  );
}
