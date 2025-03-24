import {StyleSheet} from 'react-native';

const RecommendPharmacyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  pharmacyList: {
    flex: 1,
    marginBottom: 16,
  },
  pharmacyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  pharmacyInfo: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 4,
  },
  pharmacyHours: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: 'bold',
    color: '#000000',
  },
  hoursText: {
    fontSize: 15,
    color: '#666666',
    paddingLeft: 8,
  },
  noPharmaciesText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default RecommendPharmacyListStyles;
