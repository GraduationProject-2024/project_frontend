import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  hospitalList: {
    flex: 1,
    marginBottom: 16,
  },
  hospitalContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginHorizontal: 4,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  hospitalInfo: {
    fontSize: 15,
    color: '#666666',
    marginTop: 4,
    marginBottom: 4,
  },
});

export default styles;
