// components/Builder.jsx

import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// —————————————————————————————————————————————————————————————————————————————
// 1. ESTILOS E DADOS INICIAIS
// —————————————————————————————————————————————————————————————————————————————

const financeBlue  = '#0A3161';
const financeGold  = '#C4A962';
const financeLight = '#F3F6F9';
const financeNavy  = '#012169';

const defaultData = {
  companyName:         'Nome da Empresa',
  documentTitle:       'Blind Teaser',
  confidential:        'Confidential',
  marketDescription:   'Mercado de manutenção em parques eólicos no Brasil',
  marketSize:          'R$ 500M',
  marketGrowth:        '8% a.a.',
  revenue: [
    { year: '2020', value: 10 },
    { year: '2021', value: 12 },
    { year: '2022', value: 11 },
    { year: '2023', value: 13 },
    { year: '2024', value: 14 },
  ],
  ebitda: [
    { year: '2020', value: 3 },
    { year: '2021', value: 4 },
    { year: '2022', value: 4.5 },
    { year: '2023', value: 5 },
    { year: '2024', value: 5.5 },
  ],
  companyImage:        null,
  businessDescription: 'Serviços de manutenção preventiva e corretiva em parques eólicos por todo o Brasil.',
  companyStrengths:    ['Expertise técnica', 'Cobertura nacional', 'Equipe especializada'],
  transactionObjective:'Atrair investimento para expansão de operações regionais.',
  transactionOptions:  ['M&A', 'Joint Venture', 'Financiamento Verde'],
  contactPerson:       'João Silva',
  contactEmail:        'joao.silva@empresa.com',
  contactPhone:        '+55 11 99999-0000',
  disclaimer:          'Este documento é confidencial e não deve ser reproduzido sem autorização.',
};

// —————————————————————————————————————————————————————————————————————————————
// 2. COMPONENTES DE GRÁFICOS
// —————————————————————————————————————————————————————————————————————————————

const RevenueChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={180}>
    <BarChart data={data} margin={{ top:5, right:10, left:10, bottom:5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
      <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false} />
      <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `R$${v}M`} />
      <Tooltip formatter={v => [`R$${v}M`, 'Revenue']} labelFormatter={l => `Year: ${l}`} />
      <Bar dataKey="value" fill={color} radius={[4,4,0,0]} />
    </BarChart>
  </ResponsiveContainer>
);

const EbitdaChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={180}>
    <LineChart data={data} margin={{ top:5, right:10, left:10, bottom:5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
      <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false} />
      <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `R$${v}M`} />
      <Tooltip formatter={v => [`R$${v}M`, 'EBITDA']} labelFormatter={l => `Year: ${l}`} />
      <Line
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        dot={{ stroke: color, strokeWidth: 2, fill: 'white', r: 4 }}
      />
    </LineChart>
  </ResponsiveContainer>
);

// —————————————————————————————————————————————————————————————————————————————
// 3. TEMPLATE “GOLDMAN”
// —————————————————————————————————————————————————————————————————————————————

const GoldmanTemplate = ({ data, logo }) => (
  <div style={{
    width:  '210mm',
    height: '297mm',
    padding: 16,
    boxSizing: 'border-box',
    backgroundColor: 'white',
    color: financeBlue,
    fontFamily: 'Arial, sans-serif',
    fontSize: 12
  }}>
    {/* Header */}
    <header style={{
      display:        'flex',
      justifyContent: 'space-between',
      alignItems:     'flex-start',
      borderBottom:   `2px solid ${financeGold}`,
      paddingBottom:  8,
      marginBottom:   16
    }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {logo
          ? <img src={logo} alt="Logo" style={{ height:48, objectFit:'contain' }} />
          : <div style={{
              width:144, height:48, backgroundColor:financeLight,
              display:'flex', alignItems:'center', justifyContent:'center',
              border:'1px solid #ccc', borderRadius:4
            }}>
              <span style={{ fontSize:10, color:'#888' }}>Company Logo</span>
            </div>
        }
        <div>
          <h1 style={{ margin:0, fontSize:18, fontWeight:'bold' }}>{data.companyName}</h1>
          <p style={{ margin:0, fontSize:10, fontWeight:500 }}>{data.documentTitle}</p>
        </div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div style={{
          display:'inline-block',
          backgroundColor: financeGold,
          opacity: 0.2,
          padding:'4px 8px',
          borderRadius:2,
          fontSize:10,
          fontWeight:500,
          color: financeNavy
        }}>
          {data.confidential}
        </div>
      </div>
    </header>

    <div style={{ display:'flex', gap:16 }}>
      {/* Left Column */}
      <div style={{ flex:2 }}>
        {/* Market Overview */}
        <section style={{ marginBottom:16 }}>
          <h2 style={{
            margin:'0 0 4px 0',
            fontSize:14,
            fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`,
            paddingLeft:4
          }}>Market Overview</h2>
          <p style={{ margin:'4px 0', fontSize:12, lineHeight:1.4 }}>
            {data.marketDescription}
          </p>
          <div style={{ display:'flex', gap:8 }}>
            {[
              ['MARKET SIZE', data.marketSize],
              ['GROWTH RATE', data.marketGrowth]
            ].map(([label, val]) => (
              <div key={label} style={{
                backgroundColor:financeLight,
                padding:8,
                borderRadius:4,
                flex:1
              }}>
                <h3 style={{
                  margin:'0 0 4px 0',
                  fontSize:10,
                  fontWeight:500,
                  color:'#666'
                }}>{label}</h3>
                <p style={{ margin:0, fontSize:16, fontWeight:'bold' }}>{val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Highlights */}
        <section style={{ marginBottom:16 }}>
          <h2 style={{
            margin:'0 0 8px 0',
            fontSize:14,
            fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`,
            paddingLeft:4
          }}>Financial Highlights</h2>
          <div style={{ marginBottom:12 }}>
            <h3 style={{ margin:'0 0 4px 0', fontSize:12, fontWeight:'bold' }}>
              Revenue (R$ millions)
            </h3>
            <div style={{
              backgroundColor:'white',
              border:'1px solid #ccc',
              borderRadius:4,
              padding:8
            }}>
              <RevenueChart data={data.revenue} color={financeBlue} />
            </div>
          </div>
          <div>
            <h3 style={{ margin:'0 0 4px 0', fontSize:12, fontWeight:'bold' }}>
              EBITDA (R$ millions)
            </h3>
            <div style={{
              backgroundColor:'white',
              border:'1px solid #ccc',
              borderRadius:4,
              padding:8
            }}>
              <EbitdaChart data={data.ebitda} color={financeGold} />
            </div>
          </div>
        </section>
      </div>

      {/* Right Column */}
      <div style={{ flex:1 }}>
        {/* Company Overview */}
        <section style={{ marginBottom:16 }}>
          <h2 style={{
            margin:'0 0 4px 0',
            fontSize:14,
            fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`,
            paddingLeft:4
          }}>Company Overview</h2>
          {data.companyImage
            ? <img
                src={data.companyImage}
                alt="Company"
                style={{
                  width:'100%',
                  height:96,
                  objectFit:'cover',
                  borderRadius:4,
                  marginBottom:8
                }}
              />
            : <div style={{
                width:'100%',
                height:96,
                backgroundColor:financeLight,
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                borderRadius:4,
                marginBottom:8
              }}>
                <span style={{ fontSize:10, color:'#888' }}>Company Image</span>
              </div>
          }
          <p style={{ margin:'0 0 8px 0', fontSize:12 }}>
            {data.businessDescription}
          </p>
          <div style={{
            backgroundColor:financeLight,
            padding:8,
            borderRadius:4
          }}>
            <h3 style={{
              margin:'0 0 4px 0',
              fontSize:10,
              fontWeight:500,
              color:'#666'
            }}>KEY STRENGTHS</h3>
            <ul style={{ margin:0, paddingLeft:16, listStyleType:'disc' }}>
              {data.companyStrengths.map((s,i) =>
                <li key={i} style={{ fontSize:10 }}>{s}</li>
              )}
            </ul>
          </div>
        </section>

        {/* Transaction */}
        <section>
          <h2 style={{
            margin:'0 0 4px 0',
            fontSize:14,
            fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`,
            paddingLeft:4
          }}>Transaction</h2>
          <p style={{ margin:'0 0 8px 0', fontSize:12 }}>
            {data.transactionObjective}
          </p>
          <div style={{
            backgroundColor:financeLight,
            padding:8,
            borderRadius:4
          }}>
            <h3 style={{
              margin:'0 0 4px 0',
              fontSize:10,
              fontWeight:500,
              color:'#666'
            }}>POTENTIAL STRUCTURES</h3>
            <ul style={{ margin:0, paddingLeft:16, listStyleType:'disc' }}>
              {data.transactionOptions.map((o,i) =>
                <li key={i} style={{ fontSize:10 }}>{o}</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
);

// —————————————————————————————————————————————————————————————————————————————
// 4. BUILDER PRINCIPAL
// —————————————————————————————————————————————————————————————————————————————

export default function Builder() {
  const [data, setData] = useState(defaultData);
  const [logo, setLogo] = useState(null);
  const previewRef = useRef();

  // input genérico
  const handleChange = field => e => {
    setData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // upload de imagens
  const handleUpload = field => e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setData(prev => ({
      ...prev,
      [field]: reader.result
    }));
    reader.readAsDataURL(file);
  };

  // download PDF
  const downloadPDF = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const img    = canvas.toDataURL('image/png');
    const pdf    = new jsPDF({ unit: 'mm', format: 'a4' });
    const props  = pdf.getImageProperties(img);
    const w      = pdf.internal.pageSize.getWidth();
    const h      = (props.height * w) / props.width;
    pdf.addImage(img, 'PNG', 0, 0, w, h);
    pdf.save('teaser.pdf');
  };

  // download PNG
  const downloadPNG = async () => {
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const link   = document.createElement('a');
    link.download = 'teaser.png';
    link.href     = canvas.toDataURL('image/png');
    link.click();
  };

  // campos editáveis
  const fields = [
    'companyName', 'documentTitle', 'confidential',
    'marketDescription', 'marketSize', 'marketGrowth',
    'businessDescription', 'transactionObjective',
    'contactPerson', 'contactEmail', 'contactPhone', 'disclaimer'
  ];

  return (
    <div style={{ padding:20, fontFamily:'sans-serif' }}>
      <h1>Blind Teaser Builder</h1>

      {/* Editor de campos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        margin: '16px 0'
      }}>
        {fields.map(f => (
          <label key={f} style={{ display:'flex', flexDirection:'column' }}>
            {f.replace(/([A-Z])/g,' $1').replace(/^./, s => s.toUpperCase())}:
            <input
              type="text"
              value={data[f]}
              onChange={handleChange(f)}
              style={{ marginTop:4, padding:4 }}
            />
          </label>
        ))}
        <label style={{ display:'flex', flexDirection:'column' }}>
          Company Logo:
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload('companyImage')}
            style={{ marginTop:4 }}
          />
        </label>
        <label style={{ display:'flex', flexDirection:'column' }}>
          Company Image:
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload('companyImage')}
            style={{ marginTop:4 }}
          />
        </label>
      </div>

      {/* Botões de download */}
      <div style={{ marginBottom:16 }}>
        <button onClick={downloadPDF}>Baixar PDF</button>
        <button onClick={downloadPNG} style={{ marginLeft:8 }}>Baixar PNG</button>
      </div>

      {/* Preview A4 */}
      <div style={{ border:'1px solid #ccc', overflow:'auto', textAlign:'center' }}>
        <div
          ref={previewRef}
          style={{
            display:'inline-block',
            transform:'scale(0.7)',
            transformOrigin:'top center'
          }}
        >
          <GoldmanTemplate data={data} logo={data.companyImage /* use logo field here */} />
        </div>
      </div>
    </div>
  );
}
