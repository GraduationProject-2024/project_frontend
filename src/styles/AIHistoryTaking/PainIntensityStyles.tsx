import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#000000',
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 50,
    color: '#000000',
  },
  emoji: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  painLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  painDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  slider: {
    width: '100%',
    height: 50,
    marginBottom: 120,
  },
  nextButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    height: 50,
    backgroundColor: '#2527BF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
