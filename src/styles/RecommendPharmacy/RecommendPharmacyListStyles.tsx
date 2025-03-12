import {StyleSheet} from 'react-native';

const RecommendPharmacyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  card: {
    marginBottom: 12,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  pharmacyName: {
    fontSize: 18,
    marginBottom: 4,
    color: '#000000',
  },
  pharmacyAddress: {
    fontSize: 15,
    marginBottom: 4,
    color: '#000000',
  },
  pharmacyInfo: {
    fontSize: 15,
    marginBottom: 2,
    color: '#000000',
  },
  pharmacyHours: {
    fontSize: 15,
    marginTop: 8,
    color: '#000000',
  },
  hoursText: {
    fontSize: 15,
    color: '#000000',
    paddingLeft: 8,
  },
});

export default RecommendPharmacyListStyles;
