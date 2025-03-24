import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    color: '#2527BF',
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  pharmacyList: {
    flex: 1,
    marginBottom: 16,
  },
  pharmacyCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
    elevation: 4,
  },
  pharmacyCardContent: {
    flexDirection: 'column',
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  pharmacyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2527BF',
    marginTop: 10,
  },
  pharmacyInfo: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 4,
  },
  hoursText: {
    fontSize: 15,
    color: '#666666',
  },
  noPharmaciesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default styles;
