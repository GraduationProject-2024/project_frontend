import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 300,
  },
  centeredPickerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 300,
  },
  wheelPickerContainer: {
    height: 250,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    margin: 20,
    marginBottom: 400,
  },
  fixedSelectedIndicator: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -25}],
    height: 50,
    width: '100%',
    borderRadius: 20,
    backgroundColor: '#2527BF',
  },
  wheelPickerItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    width: 120,
  },
  selectedWheelPickerItem: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  unselectedWheelPickerItem: {
    fontSize: 20,
    fontWeight: '600',
    color: '#B5B5B5',
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
