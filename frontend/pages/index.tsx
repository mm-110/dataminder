import { NextPage } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Register from '../components/Register'
import Login from '../components/Login'
import NavbarSignIn from '../components/NavbarSignIn'

const Home: NextPage = (props) => {
  const router = useRouter();

  const handleNavigation = () => {
    router.push('/about');
  }

  return (
    <div >
      <NavbarSignIn />
      <h1>Home</h1>
      <div className='frame'>
        <h3>Register</h3>
        <Register />
        <h3>Login</h3>
        <Login />
      </div>
      
    </div>
  );
}

export default Home;
