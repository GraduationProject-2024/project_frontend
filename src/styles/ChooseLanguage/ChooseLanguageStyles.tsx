import {StyleSheet} from 'react-native';

const ChooseLanguageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  selectedLanguage: {
    fontSize: 16,
    marginBottom: 30,
    color: '#000000',
  },
  languageList: {
    width: '100%',
    marginBottom: 30,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFF0',
    paddingHorizontal: 10,
  },
  languageText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  languageIcon: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    marginBottom: 40,
    width: '95%',
  },
  button: {
    height: 50,
    backgroundColor: '#d1d1d1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChooseLanguageStyles;
