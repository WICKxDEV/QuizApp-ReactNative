import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  secondaryButton: {
    backgroundColor: '#4caf50'
  }
});

export const quizStyles = StyleSheet.create({
  question: { 
    fontSize: 22, 
    fontWeight: '600', 
    marginBottom: 20,
    textAlign: 'center'
  },
  counter: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center'
  },
  option: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
    elevation: 2
  },
  correctOption: {
    backgroundColor: '#4caf50'
  },
  wrongOption: {
    backgroundColor: '#f44336'
  },
  optionDisabled: {
    backgroundColor: '#e0e0e0'
  },
  optionText: {
    fontSize: 18,
    color: '#000'
  }
});