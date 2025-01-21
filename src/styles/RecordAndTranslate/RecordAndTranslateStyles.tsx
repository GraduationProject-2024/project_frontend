import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
    marginBottom: 100,
  },
  listContainer: {
    paddingBottom: 80,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 16,
    tintColor: '#0056D2',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  duration: {
    fontSize: 15,
    color: '#B5B5B5',
    flex: 1,
    textAlign: 'left',
  },
  date: {
    fontSize: 15,
    color: '#B5B5B5',
    flex: 4,
    textAlign: 'right',
  },
  menuIcon: {
    width: 30,
    height: 30,
    tintColor: '#000000',
    marginBottom: 20,
  },
  button: {
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
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
