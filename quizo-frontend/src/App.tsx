import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import QuizForm from './components/QuizForm';

export interface User {
  teacherId: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
        <Route path="/quiz/new" element={user ? <QuizForm user={user} /> : <Navigate to="/" />} />
        <Route path="/quiz/edit/:id" element={user ? <QuizForm user={user} editMode={true} /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
