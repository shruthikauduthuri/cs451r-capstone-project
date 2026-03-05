import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from "react";

function App() {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/workers")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend data:", data);
        setWorkers(data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h1>Workers</h1>

      {workers.length === 0 ? (
        <p>No workers yet.</p>
      ) : (
        workers.map((worker) => (
          <div key={worker.id}>
            <h3>{worker.name}</h3>
            <p>Skill: {worker.skill}</p>
            <p>Rate: ${worker.rate}/hr</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
