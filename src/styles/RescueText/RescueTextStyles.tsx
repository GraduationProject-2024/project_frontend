import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  titleText: {
    fontSize: 16,
    color: '#2527BF',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  textInput: {
    height: 50,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000000',
  },
  toggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: '#B5B5B5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  selectedToggleButton: {
    borderColor: '#2527BF',
    backgroundColor: '#2527BF',
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
  },
  selectedToggleText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  addressContainer: {
    marginBottom: 10,
  },
  addressInput: {
    height: 50,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  detailedAddressInput: {
    height: 50,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  additionalInfoContainer: {
    marginBottom: 20,
  },
  textInputWithIconAndCounter: {
    height: 200,
    padding: 10,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
  },
  inputWithIconAndCounterContainer: {
    position: 'relative',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingBottom: 30,
  },
  microphoneIconInside: {
    position: 'absolute',
    left: 10,
    top: 180,
    width: 40,
    height: 40,
  },
  characterCountInside: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    fontSize: 16,
    color: '#B5B5B5',
  },
  submitButton: {
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
  submitButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
