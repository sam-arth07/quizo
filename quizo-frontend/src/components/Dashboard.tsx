import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../App';
import { Link, useNavigate } from 'react-router-dom';

interface Quiz {
  id: number;
  title: string;
  description: string;
  created_at: string;
}


interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`/quizzes`, {
        params: { teacherId: user.teacherId },
      });
      if (response.data.success) {
        setQuizzes(response.data.quizzes);
      }
    } catch (err) {
      console.error('Error fetching quizzes', err);
    }
  };

  const deleteQuiz = async (id: number) => {
    try {
      const response = await axios.delete(`/quizzes/${id}`);
      if (response.data.success) {
        fetchQuizzes();
      }
    } catch (err) {
      console.error('Error deleting quiz', err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Link to="/quiz/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Create New Quiz
      </Link>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">{quiz.title}</h2>
            <p className="mt-2">{quiz.description}</p>
            <p className="text-gray-500 text-sm mt-2">Created at: {new Date(quiz.created_at).toLocaleString()}</p>
            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => navigate(`/quiz/edit/${quiz.id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteQuiz(quiz.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
