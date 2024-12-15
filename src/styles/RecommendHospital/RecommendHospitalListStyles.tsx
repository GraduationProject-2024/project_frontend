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
  activeTabButton: {
    backgroundColor: '#2E6FF2',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  hospitalList: {
    flex: 1,
    marginBottom: 16,
  },
  hospitalItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 8,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  hospitalDistance: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  hospitalAddress: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
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

export default styles;
