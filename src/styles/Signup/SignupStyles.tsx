import {StyleSheet} from 'react-native';

const SignupStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#AFB1B6',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: '#AFB1B6',
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
  },
  passwordInput: {
    flex: 1,
    marginRight: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  signupButton: {
    height: 50,
    backgroundColor: '#d1d1d1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  signupButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SignupStyles;
