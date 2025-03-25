import {StyleSheet} from 'react-native';

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEDFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  homeprofilesection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  diagnosisSection: {
    width: '90%',
    marginTop: 150,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  diagnosisButton: {
    width: '30%',
    paddingVertical: 14,
    backgroundColor: '#EDEDED',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  diagnosisButtonText: {
    fontSize: 15,
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
    fontSize: 18,
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeStyles;
