// services/quizService.js
const API_URL = 'https://opentdb.com/api.php';

export const fetchQuizQuestions = async (amount = 10, difficulty = 'medium') => {
  try {
    const response = await fetch(
      `${API_URL}?amount=${amount}&difficulty=${difficulty}&type=multiple`
    );
    const data = await response.json();
    
    if (data.response_code === 0) {
      // Format questions to match our app's structure
      return data.results.map(question => ({
        question: decodeHtmlEntities(question.question),
        options: shuffleArray([
          ...question.incorrect_answers.map(ans => decodeHtmlEntities(ans)),
          decodeHtmlEntities(question.correct_answer)
        ]),
        answer: decodeHtmlEntities(question.correct_answer)
      }));
    } else {
      throw new Error('Could not load questions');
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

// React Native compatible HTML entity decoder
const decodeHtmlEntities = (text) => {
  if (!text) return text;
  
  // Common HTML entities
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&hellip;': '...',
    '&nbsp;': ' ',
  };

  return text.replace(/&[^;]+;/g, match => entities[match] || match);
};

// Helper function to shuffle array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};