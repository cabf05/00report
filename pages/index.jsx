// pages/index.jsx
import { useState } from 'react';

export default function Home() {
  const [companyName,       setCompanyName]       = useState('WindServe Brasil');
  const [documentTitle,     setDocumentTitle]     = useState('Investment Opportunity');
  const [confidential,      setConfidential]      = useState('Strictly Confidential - 2025');
  const [marketDescription, setMarketDescription] = useState(
    `Brazil's renewable energy sector is experiencing rapid growth, with wind energy leading the expansion in the country's northeastern region.`
  );
  const [marketSize,        setMarketSize]        = useState('R$4.8 billion');
  const [marketGrowth,      setMarketGrowth]      = useState('17.5 % CAGR');
  const [revenueData,       setRevenueData]       = useState(
    JSON.stringify([
      { year: '2022', value: 80 },
      { year: '2023', value: 150 },
      { year: '2024', value: 230 },
      { year: '2025E', value: 320 },
      { year: '2026E', value: 450 }
    ])
  );
  const [ebitdaData,        setEbitdaData]        = useState(
    JSON.stringify([
      { year: '2022', value: 30 },
      { year: '2023', value: 45 },
      { year: '2024', value: 60 },
      { year: '2025E', value: 80 },
      { year: '2026E', value: 140 }
    ])
  );
  const [kpis,              setKpis]              = useState(
    JSON.stringify([
      { label: 'Contracts',            value: '42',   change: '+24%',  positive: true },
      { label: 'Avg Contract Value',   value: 'R$3.2M', change: '+15%', positive: true },
      { label: 'Retention Rate',       value: '94%',  change: '+2%',   positive: true },
      { label: 'Maintenance Time',     value: '-35%', change: '-5%',   positive: false }
    ])
  );
  const [businessDescription,setBusinessDescription]= useState(
    `Leading provider of comprehensive maintenance services for wind farms across Brazil, specializing in predictive maintenance, repair services, and performance optimization for wind turbines and related infrastructure.`
  );
  const [strengths,         setStrengths]         = useState(
    `Proprietary AI diagnostic technology reducing turbine downtime by 35%\nService contracts with 8 of the 10 largest wind farms in Brazil\nHighly trained technical team with specialized certifications\nFleet of specialized vehicles and equipment for high-altitude maintenance`
  );
  const [transactionObjective,setTransactionObjective] = useState(
    `WindServe Brasil is seeking a strategic partner to accelerate growth across Latin America and fund technology development to expand service offerings.`
  );
  const [potentialStructures,setPotentialStructures]= useState(
    `Minority equity investment (25–40%)\nStrategic merger with complementary service provider\nTechnology licensing partnerships\nJoint venture for international expansion`
  );
  const [contactPerson,     setContactPerson]     = useState('Ana Silva, Investment Relations');
  const [disclaimer,        setDisclaimer]        = useState('This teaser document contains confidential and proprietary information.');

  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    setLoading(true);
    const payload = {
      companyName, documentTitle, confidential, marketDescription,
      marketSize, marketGrowth, revenueData: JSON.parse(revenueData),
      ebitdaData: JSON.parse(ebitdaData),
      kpis: JSON.parse(kpis),
      businessDescription, strengths: strengths.split('\n'),
      transactionObjective,
      potentialStructures: potentialStructures.split('\n'),
      contactPerson, disclaimer
    };
    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setLoading(false);
  };

  const textareaStyle = { width:'100%', padding:8, marginTop:4, fontFamily:'monospace' };

  return (
    <div style={{ padding:20, maxWidth:640, margin:'auto', fontFamily:'Arial, sans-serif' }}>
      <h1 style={{ textAlign:'center' }}>Blind Teaser Builder</h1>

      {/** Single column on mobile, two columns on desktop */}
      <div style={{
        display:'grid',
        gridTemplateColumns: '1fr',
        gap:16,
        '@media(min-width:640px)': { gridTemplateColumns: '1fr 1fr'}
      }}>
        <label>
          Company Name
          <input value={companyName} onChange={e=>setCompanyName(e.target.value)}
                 style={{ width:'100%', padding:8, marginTop:4 }}/>
        </label>
        <label>
          Document Title
          <input value={documentTitle} onChange={e=>setDocumentTitle(e.target.value)}
                 style={{ width:'100%', padding:8, marginTop:4 }}/>
        </label>
        <label>
          Confidentiality Flag
          <input value={confidential} onChange={e=>setConfidential(e.target.value)}
                 style={{ width:'100%', padding:8, marginTop:4 }}/>
        </label>
        <label>
          Market Overview
          <textarea value={marketDescription} onChange={e=>setMarketDescription(e.target.value)}
                    rows={4} style={textareaStyle}/>
        </label>
        <label>
          Market Size
          <input value={marketSize} onChange={e=>setMarketSize(e.target.value)}
                 style={{ width:'100%', padding:8, marginTop:4 }}/>
        </label>
        <label>
          Growth Rate
          <input value={marketGrowth} onChange={e=>setMarketGrowth(e.target.value)}
                 style={{ width:'100%', padding:8, marginTop:4 }}/>
        </label>
        <label>
          Revenue Data (JSON)
          <textarea value={revenueData} onChange={e=>setRevenueData(e.target.value)}
                    rows={3} style={textareaStyle}/>
        </label>
        <label>
          EBITDA Data (JSON)
          <textarea value={ebitdaData} onChange={e=>setEbitdaData(e.target.value)}
                    rows={3} style={textareaStyle}/>
        </label>
        <label>
          KPIs (JSON array)
          <textarea value={kpis} onChange={e=>setKpis(e.target.value)}
                    rows={4} style={textareaStyle}/>
        </label>
        <label>
          Business Description
          <textarea value={businessDescription} onChange={e=>setBusinessDescription(e.target.value)}
                    rows={3} style={textareaStyle}/>
        </label>
        <label>
          Strengths (one per line)
          <textarea value={strengths} onChange={e=>setStrengths(e.target.value)}
                    rows={4} style={textareaStyle}/>
        </label>
        <label>
          Transaction Objective
          <textarea value={transactionObjective} onChange={e=>setTransactionObjective(e.target.value)}
                    rows={3} style={textareaStyle}/>
        </label>
        <label>
          Potential Structures (one per line)
          <textarea value={potentialStructures} onChange={e=>setPotentialStructures(e.target.value)}
                    rows={4} style={textareaStyle}/>
        </label>
        <label>
          Contact Person & Title
          <input value={contactPerson} onChange={e=>setContactPerson(e.target.value)}
                 style={{ width:'100%', padding:8, marginTop:4 }}/>
        </label>
        <label>
          Disclaimer
          <textarea value={disclaimer} onChange={e=>setDisclaimer(e.target.value)}
                    rows={2} style={textareaStyle}/>
        </label>
      </div>

      <button onClick={generatePdf} disabled={loading}
        style={{
          marginTop:20,
          width:'100%',
          padding:12,
          background:'#0A3161',
          color:'white',
          fontSize:16,
          border:'none',
          cursor:'pointer'
        }}>
        {loading ? 'Gerando PDF…' : 'Gerar PDF'}
      </button>
    </div>
  );
}
