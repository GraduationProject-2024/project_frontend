import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import styles from '../../styles/AIHistoryTaking/PainDurationStyles';

const SYMPTOM_DURATION_API_URL =
  'http://52.78.79.53:8081/api/v1/symptom/duration';

const WheelPicker = ({options, selectedIndex, onChange}) => {
  const flatListRef = React.useRef(null);

  const handleScrollEnd = event => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / 50);
    flatListRef.current?.scrollToOffset({
      offset: index * 50,
      animated: true,
    });
    onChange(index);
  };

  return (
    <View style={styles.wheelPickerContainer}>
      <View style={styles.fixedSelectedIndicator} />

      <FlatList
        ref={flatListRef}
        data={options}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={50}
        decelerationRate="fast"
        contentContainerStyle={{paddingVertical: 100}}
        getItemLayout={(_, index) => ({
          length: 50,
          offset: 50 * index,
          index,
        })}
        initialScrollIndex={selectedIndex}
        onScrollEndDrag={handleScrollEnd}
        onMomentumScrollEnd={handleScrollEnd}
        renderItem={({item, index}) => {
          const distanceFromCenter = Math.abs(index - selectedIndex);
          const opacity = 1 - distanceFromCenter * 0.1;
          const scale = 1 - distanceFromCenter * 0.1;
          return (
            <View style={styles.wheelPickerItemContainer}>
              <Text
                style={[
                  styles.wheelPickerItem,
                  {
                    opacity: opacity,
                    transform: [
                      {scale},
                      {rotateX: `${distanceFromCenter * 15}deg`},
                    ],
                  },
                  index === selectedIndex
                    ? styles.selectedWheelPickerItem
                    : styles.unselectedWheelPickerItem,
                ]}>
                {item}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const PainDurationScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const symptomId = route.params?.symptomId;
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [selectedUnit, setSelectedUnit] = useState('분');
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!symptomId) {
    console.error('🚨 symptomId가 undefined입니다.');
    Alert.alert('Error', '증상 ID가 없습니다.');
    return null;
  }

  const numbers = Array.from({length: 11}, (_, i) => (i + 1) * 5).map(String);
  const units = [t('분'), t('시간'), t('일'), t('주'), t('달'), t('년')];

  const TIME_UNIT_MAP = {
    [t('분')]: 'MINUTE',
    [t('시간')]: 'HOUR',
    [t('일')]: 'DAY',
    [t('주')]: 'WEEK',
    [t('달')]: 'MONTH',
    [t('년')]: 'YEAR',
  };

  const handleScrollChange = () => {
    setIsNextButtonActive(true);
  };

  const savePainDuration = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const convertedUnit = TIME_UNIT_MAP[selectedUnit] || 'DEFAULT';
      const requestBody = {
        durationValue: selectedNumber,
        durationUnit: convertedUnit,
      };

      const requestUrl = `${SYMPTOM_DURATION_API_URL}/${symptomId}`;
      console.log('📤 증상 지속시간 저장 요청:', requestUrl);
      console.log('📤 요청 데이터:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Accept: 'application/json;charset=UTF-8',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const statusCode = response.status;
      console.log(
        `🔍 HTTP 응답 상태 코드 (Symptom ID ${symptomId}): ${statusCode}`,
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error(`❌ 서버 오류 (Symptom ID ${symptomId}):`, errorResponse);
        throw new Error(
          `서버 오류: ${statusCode} - ${JSON.stringify(errorResponse)}`,
        );
      }

      const result = await response.json();
      console.log(
        `✅ 서버 응답 (증상 지속시간 저장 - Symptom ID ${symptomId}):`,
        result,
      );

      navigation.navigate('AdditionalInformation', {symptomId});
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      Alert.alert('Error', `저장 중 오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{t('통증은 어느 정도 지속되나요?')}</Text>
      <View style={styles.centeredPickerWrapper}>
        <WheelPicker
          options={numbers}
          selectedIndex={numbers.indexOf(selectedNumber.toString())}
          onChange={index => {
            setSelectedNumber(parseInt(numbers[index], 10));
            handleScrollChange();
          }}
        />
        <WheelPicker
          options={units}
          selectedIndex={units.indexOf(selectedUnit)}
          onChange={index => {
            setSelectedUnit(units[index]);
            handleScrollChange();
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.nextButton,
          {backgroundColor: isNextButtonActive ? '#2527BF' : '#B5B5B5'},
        ]}
        disabled={!isNextButtonActive || loading}
        onPress={savePainDuration}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.nextButtonText}>{t('다음')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PainDurationScreen;
