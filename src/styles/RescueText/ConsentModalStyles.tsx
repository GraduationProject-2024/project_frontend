import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'left',
    color: '#000000',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#2527BF',
    marginBottom: 20,
    textAlign: 'left',
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  checkIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  rightIcon: {
    width: 20,
    height: 20,
    tintColor: '#2527BF',
  },
  checkText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#B5B5B5',
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#B5B5B5',
  },
});

export default styles;
