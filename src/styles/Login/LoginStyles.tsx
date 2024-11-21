import {StyleSheet} from 'react-native';

const LoginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  medikoImage: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#2527BF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  link: {
    color: '#AFB1B6',
    fontSize: 14,
  },
  separator: {
    color: '#AFB1B6',
    fontSize: 14,
    marginHorizontal: 5,
  },
  snsTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    width: '100%',
  },
  horizontalLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#AFB1B6',
    marginHorizontal: 10,
    marginTop: 40,
  },
  snsText: {
    color: '#AFB1B6',
    fontSize: 14,
    marginTop: 40,
  },
  snsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  snsItem: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  snsLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  snsLabel: {
    marginTop: 5,
    fontSize: 14,
    color: '#808080',
  },
});

export default LoginStyles;
