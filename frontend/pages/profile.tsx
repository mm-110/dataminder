import { NextPage } from 'next'
import Link from 'next/link'
import CreateOrShowKeypair from '../components/CreateOrShowKeypair';
import RequestAirdrop from '../components/RequestAirdrop';
import LoadNFTs from '../components/LoadNFTs';
import Navbar from '../components/Navbar';

const Profile: NextPage = () => {
  return (
    <div>
      <Navbar />
      <h1>Profile</h1>
      <div className='frame-profile'>
        <CreateOrShowKeypair />
        <RequestAirdrop />
        <LoadNFTs />
      </div>
      
      {/* <div className="dropdown">
        <button className="dropbtn">Menu</button>
        <div className="dropdown-content">
          
          <Link href="/myNFTs">
            <a>MyNFTs</a>
          </Link>
          <Link href="/explorer">
            <a>Explorer</a>
          </Link>
          <Link href="/receivedRequests">
            <a>Received Requests</a>
          </Link>
          <Link href="/forwardedRequests">
            <a>Forwarded Requests</a>
          </Link>
        </div>
      </div> */}
      
    </div>
  );
}

export default Profile;
