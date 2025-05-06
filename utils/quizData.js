export const questions = [
    {
      id: 1,
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      answer: 'Paris'
    },
    {
      id: 2,
      question: 'What is 5 + 3?',
      options: ['5', '8', '9', '7'],
      answer: '8'
    },
    {
      id: 3,
      question: 'Which language is used for Android development?',
      options: ['Swift', 'Kotlin', 'JavaScript', 'Python'],
      answer: 'Kotlin'
    }
  ];
  
  export const getShuffledQuestions = () => {
    return [...questions]
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
  };