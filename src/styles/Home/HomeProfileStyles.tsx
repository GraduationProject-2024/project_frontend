import {StyleSheet} from 'react-native';

const HomeProfileStyles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
  },
  profileCard: {
    width: '90%',
    height: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    position: 'absolute',
  },
  profileBack: {
    position: 'absolute',
  },
  arrowRightButton: {
    position: 'absolute',
    right: 20,
    top: 50,
  },
  arrowLeftButton: {
    position: 'absolute',
    left: 20,
    top: 50,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSubText: {
    fontSize: 14,
    color: '#666',
  },
  healthInfo: {
    marginTop: 10,
    marginLeft: 40,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  healthLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  healthValue: {
    fontSize: 14,
    color: '#2527BF',
    marginRight: 10,
  },
});

export default HomeProfileStyles;
