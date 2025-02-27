import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bodyPartContainer: {
    marginBottom: 30,
  },
  partTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 20,
  },
  symptomsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  symptomButton: {
    borderWidth: 1,
    borderColor: '#B5B5B5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  symptomButtonSelected: {
    borderColor: '#2527BF',
    backgroundColor: '#2527BF',
  },
  symptomText: {
    fontSize: 16,
    color: '#000000',
  },
  symptomTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2527BF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
