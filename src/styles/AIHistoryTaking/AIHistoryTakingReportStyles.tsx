import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    paddingVertical: 9,
    borderRadius: 20,
    margin: 10,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  activeToggle: {
    backgroundColor: '#2527BF',
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 16,
    color: '#7A7A7A',
    fontWeight: '800',
  },
  activeToggleText: {
    color: '#FFFFFF',
  },
  swipeContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#000000',
  },
  labelText: {
    color: '#B5B5B5',
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 10,
    marginVertical: 10,
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
