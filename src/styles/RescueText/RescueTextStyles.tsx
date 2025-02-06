import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  labelText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  titleContainer: {
    marginTop: 100,
  },
  titleInput: {
    height: 50,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: '#000000',
    marginTop: 10,
  },
  imageUploadContainer: {
    marginTop: 30,
  },
  imageUploadButton: {
    width: 80,
    height: 80,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  imageIcon: {
    width: 70,
    height: 70,
    tintColor: '#B5B5B5',
  },
  uploadedImageContainer: {
    position: 'relative',
    marginRight: 10,
    marginTop: 5,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#2527BF',
    borderRadius: 50,
    padding: 6,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
    top: -2,
  },
  additionalInfoContainer: {
    marginTop: 50,
  },
  textInput: {
    height: 200,
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    color: '#000000',
    textAlignVertical: 'top',
    marginTop: 10,
    marginBttom: 100,
  },
  characterCount: {
    textAlign: 'right',
    marginTop: 5,
    color: '#B5B5B5',
  },
  skipButton: {
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
  skipButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default styles;
