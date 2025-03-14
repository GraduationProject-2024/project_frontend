import {StyleSheet} from 'react-native';

const RecommendPharmacyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  pharmacyList: {
    flex: 1,
    marginBottom: 16,
  },
  pharmacyContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  pharmacyInfo: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 2,
  },
  pharmacyHours: {
    fontSize: 15,
    marginTop: 8,
    color: '#000000',
  },
  hoursText: {
    fontSize: 15,
    color: '#666666',
    paddingLeft: 8,
  },
});

export default RecommendPharmacyListStyles;
