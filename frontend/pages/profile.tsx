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
      <CreateOrShowKeypair />
      <RequestAirdrop />
      <LoadNFTs />
      <div>
        <Link href="/myNFTs">
          <button>Vai alla pagina MyNFTs</button>
        </Link>
      </div>
      <div>
        <Link href="/explorer">
          <button>Vai alla pagina Explorer</button>
        </Link>
      </div>
      <div>
        <Link href="/receivedRequests">
          <button>Vai alla pagina Received Requests</button>
        </Link>
      </div>
      <div>
        <Link href="/forwardedRequests">
          <button>Vai alla pagina Forwarded Requests</button>
        </Link>
      </div>
      
    </div>
  );
}

export default Profile;
