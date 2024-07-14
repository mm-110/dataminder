import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Register from '../components/Register'
import Login from '../components/Login'
import Navbar from '../components/Navbar'

const Home: NextPage = (props) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/about');
  }

  return (
    <div>
      <Navbar />
      <h1>Home</h1>
      <h3>Register</h3>
      <Register />
      <h3>Login</h3>
      <Login />
    </div>
  );
}

export default Home;
