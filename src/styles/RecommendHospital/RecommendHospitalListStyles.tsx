import {StyleSheet} from 'react-native';

export default StyleSheet.create({
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
  hospitalList: {
    flex: 1,
    marginBottom: 16,
  },
  hospitalCard: {
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
  hospitalCardContent: {
    flexDirection: 'column',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  hospitalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2527BF',
    marginTop: 10,
  },
  hospitalInfo: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 4,
  },
});
