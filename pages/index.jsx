// pages/index.jsx
import dynamic from 'next/dynamic'

// dynamically load the Builder component only on the client
export default dynamic(() => import('../components/Builder'), {
  ssr: false,
})
