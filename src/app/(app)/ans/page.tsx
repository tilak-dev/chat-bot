"use client"
import axios from 'axios';
// pages/generate-questions.tsx
import { useState } from 'react';

export  const GenerateQuestions = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [questions, setQuestions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setQuestions(null);

    try {
      const response = await axios.post("api/gemini")

      if (response) {
        const data = await response.data;
        setQuestions(data.questions);
        console.log('Generated questions:', data.questions);
      } else {
        console.error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Generate Engaging Questions</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="userPrompt" className="block text-gray-700 font-semibold">Provide Your Input:</label>
        <textarea
          id="userPrompt"
          rows={4}
          className="w-full text-black p-2 border border-gray-300 rounded-lg"
          placeholder="Enter details here..."
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
      </form>
      {questions && (
        <div className="mt-6 text-gray-800">
          <h2 className="text-xl font-bold mb-2">Generated Questions:</h2>
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 border border-gray-300 rounded-lg">
            {questions}
          </pre>
        </div>
      )}
    </div>
  );
};

export default GenerateQuestions;
