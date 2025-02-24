import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import styles from '../../styles/RecordAndTranslate/RecordAndTranslateStyles';

const RecordAndTranslateScreen = () => {
  const [isRecording, setIsRecording] = useState(false);

  const handleRecordPress = () => {
    setIsRecording(prev => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {isRecording ? '음성 인식 중 ...' : '음성 녹음을 시작해주세요'}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={
              isRecording
                ? require('../../img/RecordAndTranslate/DeleteButton.png')
                : require('../../img/RecordAndTranslate/TutorialButton.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecordPress}>
          <Image
            source={
              isRecording
                ? require('../../img/RecordAndTranslate/RecordinProgressButton.png')
                : require('../../img/RecordAndTranslate/RecordButton.png')
            }
            style={styles.recordIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={
              isRecording
                ? require('../../img/RecordAndTranslate/DoneButton.png')
                : require('../../img/RecordAndTranslate/FileButton.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecordAndTranslateScreen;
