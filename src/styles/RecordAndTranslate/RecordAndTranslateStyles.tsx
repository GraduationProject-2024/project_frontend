import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 20,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#2527BF',
    marginTop: 20,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#B5B5B5',
    marginTop: 400,
  },
  buttonBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 140,
    backgroundColor: '#FFFFFF',
  },
  messageContainer: {
    flex: 1,
    width: '90%',
    marginBottom: 160,
    paddingBottom: 220,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  speakerA: {
    backgroundColor: '#E5E5FF',
  },
  speakerB: {
    backgroundColor: '#EFEFEF',
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  translationText: {
    color: '#2527BF',
    fontSize: 14,
    marginTop: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    position: 'absolute',
    bottom: 30,
    zIndex: 10,
  },
  iconButton: {
    width: 80,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 70,
    height: 70,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordIcon: {
    width: 90,
    height: 90,
  },
});

export default styles;
