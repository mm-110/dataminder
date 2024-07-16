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
      </div>
      
      <div>
        <LoadNFTs />
        <Link href="/myNFTs">
          <button>MyNFTs</button>
        </Link>
      </div>
      <div>
        <Link href="/explorer">
          <button>Explorer</button>
        </Link>
      </div>
      <div>
        <Link href="/receivedRequests">
          <button>Received Requests</button>
        </Link>
      </div>
      <div>
        <Link href="/forwardedRequests">
          <button>Forwarded Requests</button>
        </Link>
      </div>
      
    </div>
  );
}

export default Profile;
