import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tabButtonText: {
    fontSize: 14,
    color: '#fffff',
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
  hospitalAddress: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 4,
  },
  mapButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    height: 50,
    backgroundColor: '#2527BF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
