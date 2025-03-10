import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  bodyPartContainer: {
    marginBottom: 30,
  },
  partTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 12,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2527BF',
    marginBottom: 10,
  },
  conditionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12, // 버튼 간 간격 증가
  },
  conditionButton: {
    minWidth: 80, // 버튼 최소 너비 증가
    paddingVertical: 10, // 버튼 크기 증가
    paddingHorizontal: 18,
    borderRadius: 24, // 둥근 버튼 형태 유지
    borderWidth: 1,
    borderColor: '#B5B5B5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  conditionButtonSelected: {
    borderColor: '#2527BF',
    backgroundColor: '#2527BF',
  },
  conditionText: {
    fontSize: 14,
    color: '#000000',
  },
  conditionTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#2527BF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
