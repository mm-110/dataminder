import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username,
        password
      });
      console.log(response.data); // Qui dovresti salvare il token di autenticazione
      localStorage.setItem('authToken', response.data.token);
      router.push('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container" >
      <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button type="submit">Submit</button>
    </form>
    </div>
    
  );
}

export default Login;
