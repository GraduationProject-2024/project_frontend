import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/AdditionalInformationStyles';

const AdditionalInformationScreen = () => {
  const [additionalInfo, setAdditionalInfo] = useState('');
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        증상에 대해 추가적으로{'\n'}전달하고 싶은 사항을 알려주세요
      </Text>

      <Text style={styles.labelText}>증상 관련 이미지 추가</Text>
      <TouchableOpacity style={styles.imageUploadButton}>
        <Image
          source={require('C:/project_frontend/src/img/AdditionalInformation/AddImage.png')}
          style={styles.imageIcon}
        />
      </TouchableOpacity>

      <Text style={styles.labelText}>증상 관련 추가 사항 작성</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="증상에 대해 추가적으로 전달하고 싶은 사항을 작성해주세요"
        value={additionalInfo}
        onChangeText={setAdditionalInfo}
        maxLength={200}
      />
      <Text style={styles.characterCount}>{additionalInfo.length}/200</Text>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.skipButtonText}>건너뛰기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdditionalInformationScreen;
