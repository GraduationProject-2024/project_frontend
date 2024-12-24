import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  ListButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    height: 50,
    backgroundColor: '#2527BF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ListButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
