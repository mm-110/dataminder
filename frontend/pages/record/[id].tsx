import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import GetNFTDetail from '../../components/GetNftDetail'
import Navbar from '../../components/Navbar'

const Record = () => {
  const router = useRouter()
  const { id } = router.query
  const [recordData, setRecordData] = useState(null)

  return (
    <div>
      <Navbar />
      <GetNFTDetail id={id} />
    </div>
  )
}

export default Record
