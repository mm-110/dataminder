import { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar';
import GetAllNFTs from '../components/GetAllNFTs';

const Explorer: NextPage = () => {
  return (
    
    <div>
      <Navbar />
      <h1>NFTs Explorer</h1>
      <GetAllNFTs />
    </div>
  );
}

export default Explorer;
