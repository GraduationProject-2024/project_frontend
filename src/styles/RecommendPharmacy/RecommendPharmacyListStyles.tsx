import {StyleSheet} from 'react-native';

const RecommendPharmacyListStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pharmacyContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  pharmacyInfo: {
    fontSize: 15,
    color: '#666666',
    marginTop: 4,
    marginBottom: 4,
  },
  pharmacyAddress: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 4,
  },
  mapButton: {
    height: 50,
    backgroundColor: '#2527BF',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 8,
  },
  mapButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default RecommendPharmacyListStyles;
