
# QuizApp - Mobile Trivia Challenge 🧠📱

<img src="/UI/Screenshot_20250509_204237.png" width="30%" alt="Month View">

A beautiful, interactive quiz application built with React Native that tests users' knowledge across various topics with timed questions and instant feedback.

## Features ✨

- 🎮 Multiple-choice quiz interface with API
- ⏱️ Timed questions (15 seconds per question)
- 📊 Score tracking with percentage calculation
- 🎯 Immediate answer feedback (correct/incorrect)
- 🔄 Option to retry the quiz
- 🎨 Responsive design for all screen sizes
- 🌓 Dark/light mode ready
- 📱 Optimized for both iOS and Android

## Screenshots 📱

<div style="display: flex; justify-content: space-between;">
  <img src="/UI/Screenshot_20250509_204420.png" width="30%" alt="Month View">
  <img src="/UI/Screenshot_20250509_204430.png" width="30%" alt="Day View">
  <img src="/UI/Screenshot_20250509_204457.png" width="30%" alt="Event Details">
</div>


## Technologies Used 🛠️

- **Frontend**: React Native
- **Navigation**: React Navigation (Native Stack)
- **UI**: React Native components + Custom Styles
- **Animations**: React Native Animated API
- **Toast Notifications**: react-native-toast-message
- **Icons**: Emoji + React Native Vector Icons
- **SVG**: react-native-svg for progress visualization

## Installation Guide 📲

1. Clone the repository:
   ```bash
   git clone https://github.com/WICKxDEV/QuizApp-ReactNative.git
   cd QuizApp-ReactNative
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. For iOS:
   ```bash
   cd ios && pod install && cd ..
   ```

4. Run the app:
   ```bash
   npx expo start
   # or
   npm start
   ```

## Project Structure 📂

```
quiz-app/
├── src/
│   ├── components/       # Reusable components
│   ├── screens/          # Application screens
│   ├── utils/            # Utilities and helpers
│   └── App.js            # Main application entry
├── assets/               # Static assets
└── README.md             # Project documentation
```

## Screenshots 📸

- Home Screen
- Quiz Screen
- Results Screen

## Customization 🎨

Easily customize the app by modifying:

- **Questions**: Edit `src/utils/quizData.js`

```javascript
{
  question: 'Your new question?',
  options: ['Option 1', 'Option 2', 'Option 3'],
  answer: 'Correct Answer'
}
```

- **Styling**: Modify `src/utils/styles.js`

```javascript
button: {
  backgroundColor: '#yourcolor',
  // other styles
}
```

- **Timer Duration**: Change in `src/screens/QuizScreen.js`

```javascript
<ProgressTimer duration={20} />  // Changed from 15 to 20 seconds
```

## Future Enhancements 🚀

- Add multiple quiz categories
- Implement user authentication
- Add leaderboard functionality
- Include image-based questions
- Add sound effects

## Contributing 🤝

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📜

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact 📧

- Email: isuruwickramasinghe.sliate@gmail.com
- GitHub: [@WICKxDEV](https://github.com/WICKxDEV)
