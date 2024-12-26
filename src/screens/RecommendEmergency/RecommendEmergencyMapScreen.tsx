import React from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import styles from '../../styles/RecommendEmergency/RecommendEmergencyMapStyles';

const RecommendHospitalMapScreen = ({navigation}: {navigation: any}) => {
  return (
    <View style={styles.container}>
      {/* Map Image */}
      <Image
        source={require('../../img/RecommendEmergency/EmergencyMap.png')}
        style={styles.mapImage}
        resizeMode="cover"
      />

      {/* Overlay Button */}
      <TouchableOpacity
        style={styles.ListButton}
        onPress={() => navigation.navigate('RecommendEmergencyList')}>
        <Text style={styles.ListButtonText}>목록으로 보기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendHospitalMapScreen;
