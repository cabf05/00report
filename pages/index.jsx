// pages/index.jsx
import dynamic from 'next/dynamic'
import React, { useState, useRef } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

// constantes de estilo
const financeBlue = '#0A3161'
const financeGold = '#C4A962'
const financeLight = '#F3F6F9'
const financeNavy = '#012169'

// dados iniciais
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

// gráficos
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

// componente principal — roda só no cliente
function Home() {
  const [data, setData] = useState(defaultData)
  const [logo, setLogo] = useState(null)
  const [tpl, setTpl] = useState('goldman')
  const previewRef = useRef()

  // upload de logo
  const onLogo = e => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result)
    reader.readAsDataURL(file)
  }

  // geradores de download
  const downloadPDF = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current, { scale: 2 })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    const props = pdf.getImageProperties(img)
    const w = pdf.internal.pageSize.getWidth()
    const h = (props.height * w) / props.width
    pdf.addImage(img, 'PNG', 0, 0, w, h)
    pdf.save('teaser.pdf')
  }
  const downloadPNG = async () => {
    if (!previewRef.current) return
    const canvas = await html2canvas(previewRef.current, { scale: 2 })
    const link = document.createElement('a')
    link.download = 'teaser.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  // wrapper para o layout A4
  const TemplateWrapper = ({ children }) => (
    <div style={{
      width:'210mm', height:'297mm', padding:16, boxSizing:'border-box',
      backgroundColor:'white', transformOrigin:'top center'
    }}>
      {children}
    </div>
  )

  // template “Goldman” inline
  const Goldman = () => (
    <TemplateWrapper>
      {/* ... todo o JSX do GoldmanTemplate que vimos antes, usando data e logo ... */}
      {/* Para encurtar: include os headers, seções e charts conforme o exemplo anterior */}
    </TemplateWrapper>
  )

  // mapa de templates
  const templates = {
    goldman: Goldman,
    // se quiser, adicione aqui mais funções de template (JPMorgan, Santander, etc.)
  }
  const Template = templates[tpl]

  return (
    <div style={{ padding:20, fontFamily:'sans-serif' }}>
      <h1>Blind Teaser Builder</h1>

      {/* selector */}
      <div style={{ display:'flex', gap:10, margin:'16px 0' }}>
        {Object.keys(templates).map(key => (
          <button
            key={key}
            onClick={()=>setTpl(key)}
            style={{
              padding:8,
              border: tpl===key ? `2px solid ${financeGold}` : '1px solid #ccc',
              background: tpl===key ? financeLight : 'white'
            }}
          >{key}</button>
        ))}
      </div>

      {/* editor de texto */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div>
          <label>Company Name:</label>
          <input
            value={data.companyName}
            onChange={e=>setData({...data, companyName:e.target.value})}
            style={{ width:'100%' }}
          />
        </div>
        {/* repita para outros campos… */}
        <div>
          <label>Logo:</label>
          <input type="file" accept="image/*" onChange={onLogo}/>
        </div>
      </div>

      {/* botões */}
      <div style={{ marginBottom:16 }}>
        <button onClick={downloadPDF}>Baixar PDF</button>
        <button onClick={downloadPNG} style={{ marginLeft:8 }}>Baixar PNG</button>
      </div>

      {/* preview */}
      <div style={{
        border:'1px solid #ccc', overflow:'auto', width:'100%', textAlign:'center'
      }}>
        <div ref={previewRef} style={{ transform:'scale(0.7)', transformOrigin:'top center' }}>
          <Template data={data} logo={logo}/>
        </div>
      </div>
    </div>
  )
}

// exporta desabilitando SSR
export default dynamic(() => Promise.resolve(Home), { ssr: false })
