import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw } from 'lucide-react';

interface CaptchaChallengeProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export function CaptchaChallenge({ onSuccess, onError }: CaptchaChallengeProps) {
  const [challenge, setChallenge] = useState({ question: '', answer: '', token: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateChallenge = () => {
    // Generate simple math problems
    const operations = [
      { type: 'add', symbol: '+', generate: () => {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        return { question: `${a} ${'+'}  ${b}`, answer: (a + b).toString() };
      }},
      { type: 'subtract', symbol: '-', generate: () => {
        const a = Math.floor(Math.random() * 30) + 10;
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        return { question: `${a} ${'-'} ${b}`, answer: (a - b).toString() };
      }},
      { type: 'multiply', symbol: '×', generate: () => {
        const a = Math.floor(Math.random() * 12) + 1;
        const b = Math.floor(Math.random() * 12) + 1;
        return { question: `${a} ${'×'} ${b}`, answer: (a * b).toString() };
      }}
    ];

    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const result = randomOp.generate();
    const token = Math.random().toString(36).substring(2, 15);
    
    setChallenge({
      question: result.question,
      answer: result.answer,
      token: token
    });
    setUserAnswer('');
    setError('');
  };

  useEffect(() => {
    generateChallenge();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    if (userAnswer.trim() === challenge.answer) {
      onSuccess(challenge.token);
    } else {
      setError('Incorrect answer. Please try again.');
      generateChallenge(); // Generate new challenge on failure
      onError?.();
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Security Verification
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={generateChallenge}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-3 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Please solve this math problem:
        </p>
        <div className="text-2xl font-mono font-bold text-gray-800 dark:text-gray-200 mb-3">
          {challenge.question} = ?
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer"
            className="text-center text-lg"
            required
            autoComplete="off"
          />
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          
          <Button
            type="submit"
            disabled={loading || !userAnswer.trim()}
            className="w-full"
            size="sm"
          >
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
        This helps us prevent automated registrations and keep JournOwl secure.
      </p>
    </div>
  );
}