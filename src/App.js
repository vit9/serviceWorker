import React from 'react';
import './App.css';

function App() {
 
  const sendNotif = () => {
    fetch('http://localhost:8081/api/trigger-push-msg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message: 'privet'})
    })
    // .then(res => res.json())
    // .then((res) => new Notification('Новое сообщение', { body: 'Success'}))

  }
  
  return (
    <div className="App">
      <button onClick={sendNotif}>send notification</button>
    </div>
  );
}

export default App;
