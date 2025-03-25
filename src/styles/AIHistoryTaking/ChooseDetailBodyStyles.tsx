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
  titleText: {
    fontSize: 18,
    color: '#2527BF',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
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
  noDataText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmButton: {
    width: '100%',
    height: 50,
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
