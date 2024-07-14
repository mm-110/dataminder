import React, { useState } from 'react';

type User = {
  username: string;
  password: string;
} | null;

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const userData = {
      username,
      password
    };
    setUser(userData);
    setUsername('');
    setPassword('');

    fetch('http://localhost:8000/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())

    console.log(userData.username);
    console.log(userData.password);
  };

  return (
    <div  className="Register container">
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          {/* Qui puoi aggiungere altre pagine o componenti che l'utente può vedere solo dopo il Register */}
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default Register;
