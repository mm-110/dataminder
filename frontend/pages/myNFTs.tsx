import { NextPage } from 'next'
import Link from 'next/link'
import GetMyNFTs from '../components/GetMyNFTs';
import Navbar from '../components/Navbar';

const MyNFTs: NextPage = () => {
  return (
    
    <div>
      <Navbar />
      <h1>My NFTs</h1>
      <GetMyNFTs />
    </div>
  );
}

export default MyNFTs;
