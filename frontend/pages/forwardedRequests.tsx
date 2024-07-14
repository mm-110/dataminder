import { NextPage } from 'next'
import Link from 'next/link'
import Navbar from '../components/Navbar';
import GetMyForwardedRequests from '../components/GetMyForwaredRequests';

const ForwardedRequests: NextPage = () => {
  return (
    
    <div>
      <Navbar />
      <h1>My Forwarded Requests</h1>
      <GetMyForwardedRequests />
    </div>
  );
}

export default ForwardedRequests;
