import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User } from '../App';
import { useNavigate, useParams } from 'react-router-dom';
interface Quiz {
  id?: number;
  title: string;
  description: string;
}

interface QuizFormProps {
  user: User;
  editMode?: boolean;
}

const QuizForm: React.FC<QuizFormProps> = ({ user, editMode = false }) => {
  const [quiz, setQuiz] = useState<Quiz>({ title: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (editMode && id) {
      // Fetch existing quiz details for editing
      axios.get(`${apiUrl}/quizzes/${id}`)
        .then((response) => {
          if (response.data.success) {
            setQuiz({
              title: response.data.quiz.title,
              description: response.data.quiz.description,
            });
          }
        })
        .catch(err => {
          console.error('Error fetching quiz', err);
        });
    }
  }, [editMode, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz.title || !quiz.description) {
      setError('Both title and description are required');
      return;
    }
    try {
      
      if (editMode && id) {
        await axios.put(`${apiUrl}/quizzes/${id}`, {
          title: quiz.title,
          description: quiz.description,
        });
      } else {
        await axios.post(`${apiUrl}/quizzes`, {
          title: quiz.title,
          description: quiz.description,
          teacherId: user.teacherId,
        });
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Error saving quiz');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{editMode ? 'Edit Quiz' : 'Create Quiz'}</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1">Quiz Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            placeholder="Enter quiz title"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            placeholder="Enter quiz description"
            required
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          {editMode ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default QuizForm;
