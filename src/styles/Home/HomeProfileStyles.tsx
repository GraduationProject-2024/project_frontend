import {StyleSheet} from 'react-native';

const HomeProfileStyles = StyleSheet.create({
  profileContainer: {
    alignItems: 'center',
  },
  profileCard: {
    width: '90%',
    height: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    position: 'absolute',
  },
  profileBack: {
    position: 'absolute',
  },
  arrowRightButton: {
    position: 'absolute',
    right: 15,
    top: 60,
  },
  arrowLeftButton: {
    position: 'absolute',
    left: 15,
    top: 60,
  },
  arrowIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 20,
    marginLeft: 10,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  profileSubText: {
    fontSize: 14,
    color: '#000000',
  },
  healthInfo: {
    marginTop: 5,
    marginLeft: 50,
  },
  healthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  healthLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  healthValue: {
    fontSize: 16,
    color: '#2527BF',
    marginRight: 15,
  },
});

export default HomeProfileStyles;
