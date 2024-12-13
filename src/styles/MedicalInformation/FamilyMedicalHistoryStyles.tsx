import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  conditionButton: {
    borderWidth: 1,
    borderColor: '#B5B5B5',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 4,
    backgroundColor: '#FFFFFF',
  },
  conditionButtonSelected: {
    borderColor: '#2527BF',
    backgroundColor: '#2527BF',
  },
  conditionText: {
    fontSize: 16,
    color: '#000000',
  },
  conditionTextSelected: {
    color: '#FFFFFF',
  },
  actionButton: {
    height: 50,
    backgroundColor: '#d1d1d1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButtonActive: {
    backgroundColor: '#2527BF',
  },
  actionButtonDisabled: {
    backgroundColor: '#B5B5B5',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
