import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar'
import GetPayedNFTDetail from '../../components/GetPayedNFTDetail'


const Record = () => {
  const router = useRouter()
  const { id } = router.query
  const [recordData, setRecordData] = useState(null)

  return (
    <div>
      <Navbar />
    <GetPayedNFTDetail id={id} />
    </div>
  )
}

export default Record
