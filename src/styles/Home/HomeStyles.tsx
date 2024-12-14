import {StyleSheet} from 'react-native';

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
<<<<<<< HEAD
    backgroundColor: '#ECEDFC',
=======
    backgroundColor: '#F8F9FA',
>>>>>>> 3e0f130 (feat: Home 개발발)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
<<<<<<< HEAD
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ECEDFC',
    borderBottomWidth: 1,
    borderBottomColor: '#ECEDFC',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 20,
  },
  diagnosisSection: {
    width: '90%',
    marginTop: 120,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
=======
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
  },
  logo: {
    width: 90,
    height: 30,
    resizeMode: 'contain',
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  profileSection: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    margin: 10,
    borderRadius: 10,
>>>>>>> 3e0f130 (feat: Home 개발발)
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
<<<<<<< HEAD
=======
  backButton: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
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
  },
  healthInfoText: {
    fontSize: 14,
    color: '#666',
  },
  healthInfoValue: {
    fontSize: 14,
    color: '#000',
    marginBottom: 5,
  },
  section: {
    marginTop: 15,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
>>>>>>> 3e0f130 (feat: Home 개발발)
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diagnosisButton: {
    width: '30%',
<<<<<<< HEAD
    paddingVertical: 14,
    backgroundColor: '#EDEDED',
    borderRadius: 15,
=======
    paddingVertical: 12,
    backgroundColor: '#E7F1FF',
    borderRadius: 8,
>>>>>>> 3e0f130 (feat: Home 개발발)
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  diagnosisButtonText: {
<<<<<<< HEAD
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedButton: {
    backgroundColor: '#2527BF',
  },
  selectedButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  startButton: {
    marginTop: 10,
    paddingVertical: 14,
    backgroundColor: '#2527BF',
    borderRadius: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuSection: {
    width: '90%',
    marginTop: 20,
    marginBottom: 30,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
=======
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  selectedButton: {
    backgroundColor: '#4F74E3',
  },
  selectedButtonText: {
    color: '#FFFFFF',
>>>>>>> 3e0f130 (feat: Home 개발발)
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    width: 45,
    height: 45,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  menuText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeStyles;
