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
  EmergencyList: {
    flex: 1,
    marginBottom: 16,
  },
  emergencyCard: {
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
  emergencyCardContent: {
    flexDirection: 'column',
  },
  emergencyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
  },
  emergencyLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2527BF',
    marginTop: 10,
  },
  emergencyInfo: {
    fontSize: 15,
    color: '#000000',
    marginBottom: 4,
  },
});

export default styles;
