import { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar';
import GetMyReceivedRequests from '../components/GetMyReceivedRequests';

const ReceivedRequests: NextPage = () => {
  return (
    
    <div>
      <Navbar />
      <h1>My Received Requests</h1>
        <GetMyReceivedRequests />
    </div>
  );
}

export default ReceivedRequests;
