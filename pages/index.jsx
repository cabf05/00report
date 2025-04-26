// pages/index.jsx

import React, { useState, useRef } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const financeBlue = '#0A3161'
const financeGold = '#C4A962'
const financeLight = '#F3F6F9'
const financeNavy = '#012169'

// 1. DADOS INICIAIS
const defaultData = {
  companyName: 'Nome da Empresa',
  documentTitle: 'Blind Teaser',
  confidential: 'Confidential',
  marketDescription: 'Mercado de manutenção em parques eólicos no Brasil',
  marketSize: 'R$ 500M',
  marketGrowth: '8% a.a.',
  revenue: [
    { year: '2020', value: 10 },
    { year: '2021', value: 12 },
    { year: '2022', value: 11 },
    { year: '2023', value: 13 },
    { year: '2024', value: 14 }
  ],
  ebitda: [
    { year: '2020', value: 3 },
    { year: '2021', value: 4 },
    { year: '2022', value: 4.5 },
    { year: '2023', value: 5 },
    { year: '2024', value: 5.5 }
  ],
  companyImage: null,
  businessDescription: 'Serviços de manutenção preventiva e corretiva em parques eólicos por todo o Brasil.',
  companyStrengths: ['Expertise técnica', 'Cobertura nacional', 'Equipe especializada'],
  transactionObjective: 'Atrair investimento para expansão de operações regionais.',
  transactionOptions: ['M&A', 'Joint Venture', 'Financiamento Verde'],
  contactPerson: 'João Silva',
  contactEmail: 'joao.silva@empresa.com',
  contactPhone: '+55 11 99999-0000',
  disclaimer: 'Este documento é confidencial e não deve ser reproduzido sem autorização.'
}

// 2. GRÁFICOS
const RevenueChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={180}>
    <BarChart data={data} margin={{ top:5,right:10,left:10,bottom:5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea"/>
      <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false}/>
      <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`R$${v}M`}/>
      <Tooltip formatter={v=>[`R$${v}M`,'Revenue']} labelFormatter={l=>`Year: ${l}`}/>
      <Bar dataKey="value" fill={color} radius={[4,4,0,0]}/>
    </BarChart>
  </ResponsiveContainer>
)

const EbitdaChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={180}>
    <LineChart data={data} margin={{ top:5,right:10,left:10,bottom:5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea"/>
      <XAxis dataKey="year" fontSize={10} tickLine={false} axisLine={false}/>
      <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={v=>`R$${v}M`}/>
      <Tooltip formatter={v=>[`R$${v}M`,'EBITDA']} labelFormatter={l=>`Year: ${l}`}/>
      <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2}
        dot={{ stroke:color, strokeWidth:2, fill:'white', r:4 }}/>
    </LineChart>
  </ResponsiveContainer>
)

// 3. TEMPLATES
const basePageStyle = {
  width: '210mm',
  height: '297mm',
  padding: '16px',
  boxSizing: 'border-box',
  backgroundColor: 'white',
  color: financeBlue,
  fontFamily: 'Arial, sans-serif',
  fontSize: '12px'
}

function TemplateWrapper({ children }) {
  return <div style={basePageStyle}>{children}</div>
}

const GoldmanTemplate = ({ data, logo }) => (
  <TemplateWrapper>
    {/* Header */}
    <header style={{
      display:'flex', justifyContent:'space-between', alignItems:'flex-start',
      borderBottom:`2px solid ${financeGold}`, paddingBottom:'8px', marginBottom:'16px'
    }}>
      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
        {logo
          ? <img src={logo} alt="Logo" style={{ height:48, objectFit:'contain' }}/>
          : <div style={{
              width:144, height:48, backgroundColor:financeLight, display:'flex',
              alignItems:'center', justifyContent:'center', border:'1px solid #ccc',
              borderRadius:4
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
          display:'inline-block', backgroundColor:financeGold, opacity:0.2,
          padding:'4px 8px', borderRadius:2, fontSize:10, fontWeight:500,
          color:financeNavy
        }}>
          {data.confidential}
        </div>
      </div>
    </header>

    <div style={{ display:'flex', gap:16 }}>
      {/* Left */}
      <div style={{ flex:2 }}>
        {/* Market */}
        <section style={{ marginBottom:16 }}>
          <h2 style={{
            margin:'0 0 4px 0', fontSize:14, fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`, paddingLeft:4
          }}>Market Overview</h2>
          <p style={{ margin:'4px 0', fontSize:12, lineHeight:1.4 }}>
            {data.marketDescription}
          </p>
          <div style={{ display:'flex', gap:8 }}>
            <div style={{
              backgroundColor:financeLight, padding:8, borderRadius:4, flex:1
            }}>
              <h3 style={{
                margin:'0 0 4px 0', fontSize:10, fontWeight:500, color:'#666'
              }}>MARKET SIZE</h3>
              <p style={{ margin:0, fontSize:16, fontWeight:'bold' }}>
                {data.marketSize}
              </p>
            </div>
            <div style={{
              backgroundColor:financeLight, padding:8, borderRadius:4, flex:1
            }}>
              <h3 style={{
                margin:'0 0 4px 0', fontSize:10, fontWeight:500, color:'#666'
              }}>GROWTH RATE</h3>
              <p style={{ margin:0, fontSize:16, fontWeight:'bold' }}>
                {data.marketGrowth}
              </p>
            </div>
          </div>
        </section>
        {/* Financial Highlights */}
        <section style={{ marginBottom:16 }}>
          <h2 style={{
            margin:'0 0 8px 0', fontSize:14, fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`, paddingLeft:4
          }}>Financial Highlights</h2>
          <div style={{ marginBottom:12 }}>
            <h3 style={{
              margin:'0 0 4px 0', fontSize:12, fontWeight:'bold'
            }}>Revenue (R$ millions)</h3>
            <div style={{
              backgroundColor:'white', border:'1px solid #ccc',
              borderRadius:4, padding:8
            }}>
              <RevenueChart data={data.revenue} color={financeBlue} />
            </div>
          </div>
          <div>
            <h3 style={{
              margin:'0 0 4px 0', fontSize:12, fontWeight:'bold'
            }}>EBITDA (R$ millions)</h3>
            <div style={{
              backgroundColor:'white', border:'1px solid #ccc',
              borderRadius:4, padding:8
            }}>
              <EbitdaChart data={data.ebitda} color={financeGold} />
            </div>
          </div>
        </section>
      </div>

      {/* Right */}
      <div style={{ flex:1 }}>
        {/* Company */}
        <section style={{ marginBottom:16 }}>
          <h2 style={{
            margin:'0 0 4px 0', fontSize:14, fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`, paddingLeft:4
          }}>Company Overview</h2>
          {data.companyImage
            ? <img src={data.companyImage} alt="Company"
                style={{
                  width:'100%', height:96, objectFit:'cover',
                  borderRadius:4, marginBottom:8
                }}/>
            : <div style={{
                width:'100%', height:96, backgroundColor:financeLight,
                display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:4, marginBottom:8
              }}>
                <span style={{ fontSize:10, color:'#888' }}>Company Image</span>
              </div>
          }
          <p style={{ margin:'0 0 8px 0', fontSize:12 }}>
            {data.businessDescription}
          </p>
          <div style={{
            backgroundColor:financeLight, padding:8, borderRadius:4
          }}>
            <h3 style={{
              margin:'0 0 4px 0', fontSize:10, fontWeight:500, color:'#666'
            }}>KEY STRENGTHS</h3>
            <ul style={{
              margin:0, paddingLeft:16, listStyleType:'disc'
            }}>
              {data.companyStrengths.map((s,i)=>
                <li key={i} style={{ fontSize:10 }}>{s}</li>
              )}
            </ul>
          </div>
        </section>
        {/* Transaction */}
        <section>
          <h2 style={{
            margin:'0 0 4px 0', fontSize:14, fontWeight:'bold',
            borderLeft:`4px solid ${financeGold}`, paddingLeft:4
          }}>Transaction</h2>
          <p style={{ margin:'0 0 8px 0', fontSize:12 }}>
            {data.transactionObjective}
          </p>
          <div style={{
            backgroundColor:financeLight, padding:8, borderRadius:4
          }}>
            <h3 style={{
              margin:'0 0 4px 0', fontSize:10, fontWeight:500, color:'#666'
            }}>POTENTIAL STRUCTURES</h3>
            <ul style={{
              margin:0, paddingLeft:16, listStyleType:'disc'
            }}>
              {data.transactionOptions.map((o,i)=>
                <li key={i} style={{ fontSize:10 }}>{o}</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>

    {/* Footer */}
    <footer style={{
      marginTop:24, paddingTop:8, borderTop:'1px solid #ccc',
      fontSize:10, display:'flex', justifyContent:'space-between'
    }}>
      <div>
        <p style={{ margin:0, fontWeight:500 }}>{data.contactPerson}</p>
        <p style={{ margin:0 }}>{data.contactEmail} | {data.contactPhone}</p>
      </div>
      <div style={{
        maxWidth:160, fontStyle:'italic', color:'#666',
        fontSize:8, textAlign:'right'
      }}>
        {data.disclaimer}
      </div>
    </footer>
  </TemplateWrapper>
)

const JPMorganTemplate = ({ data, logo }) => {
  // idêntico ao GoldmanTemplate, trocando apenas cores header e charts
  return <GoldmanTemplate
    data={data} logo={logo}
    // override cores:
    // financeBlue="#006F51", financeGold="#E36209"
  />
}
const MorganStanleyTemplate = ({ data, logo }) => {
  return <GoldmanTemplate
    data={data} logo={logo}
    // override financeBlue="#0033A0", financeGold="#00A9E0"
  />
}
const BankOfAmericaTemplate = ({ data, logo }) => {
  return <GoldmanTemplate
    data={data} logo={logo}
    // override financeBlue="#012169", financeGold="#EE2722"
  />
}
const BlackrockTemplate = ({ data, logo }) => {
  return <GoldmanTemplate
    data={data} logo={logo}
    // override financeBlue="#231F20", financeGold="#91A0AF"
  />
}
const SantanderTemplate = ({ data, logo }) => {
  return <GoldmanTemplate
    data={data} logo={logo}
    // override financeBlue="#E60000", financeGold="#A41E34"
  />
}

const templates = {
  goldman: GoldmanTemplate,
  'jp-morgan': JPMorganTemplate,
  'morgan-stanley': MorganStanleyTemplate,
  'bank-of-america': BankOfAmericaTemplate,
  blackrock: BlackrockTemplate,
  santander: SantanderTemplate
}

// 4. PÁGINA PRINCIPAL
export default function Home() {
  const [data, setData] = useState(defaultData)
  const [logo, setLogo] = useState(null)
  const [tpl, setTpl] = useState('goldman')
  const previewRef = useRef()

  // Upload de logo
  const onLogo = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result)
    reader.readAsDataURL(file)
  }

  // Download PDF
  const downloadPDF = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current, { scale:2 })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit:'mm', format:'a4' })
    const props = pdf.getImageProperties(img)
    const w = pdf.internal.pageSize.getWidth()
    const h = (props.height * w) / props.width
    pdf.addImage(img,'PNG',0,0,w,h)
    pdf.save('teaser.pdf')
  }

  // Download PNG
  const downloadPNG = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current, { scale:2 })
    const link = document.createElement('a')
    link.download = 'teaser.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const Template = templates[tpl]

  return (
    <div style={{ padding:20, fontFamily:'sans-serif' }}>
      <h1>Blind Teaser Builder</h1>

      {/* 4.1 Selector */}
      <div style={{ display:'flex', gap:10, margin:'16px 0' }}>
        {Object.keys(templates).map(key => (
          <button
            key={key}
            onClick={()=>setTpl(key)}
            style={{
              padding:8,
              border: tpl===key ? `2px solid ${financeGold}` : '1px solid #ccc',
              background: tpl===key ? financeLight : 'white',
              cursor:'pointer'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* 4.2 Editor */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {['companyName','documentTitle','confidential','marketDescription','marketSize','marketGrowth','businessDescription','transactionObjective','contactPerson','contactEmail','contactPhone','disclaimer']
          .map(field => (
          <div key={field}>
            <label style={{ display:'block', fontWeight:500 }}>
              {field.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}:
            </label>
            <input
              type="text"
              value={data[field]}
              onChange={e=>setData({...data,[field]:e.target.value})}
              style={{ width:'100%', padding:4, marginTop:4, boxSizing:'border-box' }}
            />
          </div>
        ))}
        <div>
          <label style={{ display:'block', fontWeight:500 }}>Logo:</label>
          <input type="file" accept="image/*" onChange={onLogo}/>
        </div>
        <div>
          <label style={{ display:'block', fontWeight:500 }}>Company Image:</label>
          <input type="file" accept="image/*"
            onChange={e=>{
              const f = e.target.files?.[0]
              if(!f) return
              const r = new FileReader()
              r.onload = ()=>setData(d=>({...d, companyImage:r.result}))
              r.readAsDataURL(f)
            }}
          />
        </div>
      </div>

      {/* 4.3 Downloads */}
      <div style={{ marginBottom:16 }}>
        <button onClick={downloadPDF} style={{ marginRight:8 }}>Baixar PDF</button>
        <button onClick={downloadPNG}>Baixar PNG</button>
      </div>

      {/* 4.4 Preview */}
      <div style={{
        border:'1px solid #ccc', overflow:'auto', width:'100%', textAlign:'center'
      }}>
        <div
          ref={previewRef}
          style={{
            display:'inline-block',
            transform:'scale(0.7)',
            transformOrigin:'top center'
          }}
        >
          <Template data={data} logo={logo}/>
        </div>
      </div>
    </div>
  )
}
