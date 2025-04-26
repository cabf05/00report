import React, { useState, useRef } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const defaultData = {
  // ... coloque aqui seu objeto documentData completo ...
}

const templates = {
  goldman: {/* componente ou função que retorna JSX do GoldmanTemplate */},
  // ... os outros 5 templates, inclusive o Santander ...
}

export default function Home() {
  const [data, setData] = useState(defaultData)
  const [tpl, setTpl] = useState('goldman')
  const ref = useRef()

  const downloadPDF = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2 })
    const img = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    const props = pdf.getImageProperties(img)
    const w = pdf.internal.pageSize.getWidth()
    const h = (props.height * w) / props.width
    pdf.addImage(img, 'PNG', 0, 0, w, h)
    pdf.save('teaser.pdf')
  }

  const downloadPNG = async () => {
    const canvas = await html2canvas(ref.current, { scale: 2 })
    const link = document.createElement('a')
    link.download = 'teaser.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const Template = templates[tpl]

  return (
    <div style={{ padding: 20 }}>
      <h1>Blind Teaser Builder</h1>

      {/* Seletor de templates */}
      <div style={{ display: 'flex', gap: 10, margin: '20px 0' }}>
        {Object.keys(templates).map(key => (
          <button
            key={key}
            onClick={() => setTpl(key)}
            style={{
              padding: 10,
              border: tpl === key ? '2px solid #000' : '1px solid #ccc'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Editor simplificado (exemplo p/ um campo) */}
      <div>
        <label>Company Name:</label>
        <input
          value={data.companyName}
          onChange={e => setData({ ...data, companyName: e.target.value })}
        />
      </div>

      {/* Botões de download */}
      <div style={{ margin: '20px 0' }}>
        <button onClick={downloadPDF}>Baixar PDF</button>
        <button onClick={downloadPNG} style={{ marginLeft: 10 }}>Baixar PNG</button>
      </div>

      {/* Preview A4 */}
      <div
        ref={ref}
        style={{
          width: '210mm',
          height: '297mm',
          transform: 'scale(0.7)',
          transformOrigin: 'top center',
          border: '1px solid #ccc',
          overflow: 'hidden'
        }}
      >
        <Template data={data} />
      </div>
    </div>
  )
}
