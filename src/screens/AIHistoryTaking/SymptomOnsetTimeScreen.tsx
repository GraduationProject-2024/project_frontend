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
import styles from '../../styles/AIHistoryTaking/SymptomOnsetTimeStyles';

const SYMPTOM_START_API_URL = 'http://52.78.79.53:8081/api/v1/symptom/start';

const TIME_UNIT_MAP = {
  분: 'MINUTE',
  시간: 'HOUR',
  일: 'DAY',
  주: 'WEEK',
  달: 'MONTH',
  년: 'YEAR',
};

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

const SymptomOnsetTimeScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const selectedSignIds = route.params?.selectedSignIds;
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [selectedUnit, setSelectedUnit] = useState('분');
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!selectedSignIds) {
    console.error('🚨 selectedSignIds가 undefined입니다.');
    Alert.alert('Error', '선택된 증상 ID가 없습니다.');
    return null;
  }

  const numbers = Array.from({length: 11}, (_, i) => ((i + 1) * 5).toString());
  const units = [t('분'), t('시간'), t('일'), t('주'), t('달'), t('년')];

  const handleScrollChange = () => {
    setIsNextButtonActive(true);
  };

  const saveSymptomStartTime = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', '로그인이 필요합니다.');
        return;
      }

      const convertedUnit = TIME_UNIT_MAP[selectedUnit] || 'DEFAULT';
      const requestBody = {
        startValue: selectedNumber,
        startUnit: convertedUnit,
      };

      const requestUrl = `${SYMPTOM_START_API_URL}/${selectedSignIds}`;
      console.log('📤 증상 시작 시간 저장 요청:', requestUrl);
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
        `🔍 HTTP 응답 상태 코드 (Sign ID ${selectedSignIds}): ${statusCode}`,
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error(
          `❌ 서버 오류 (Sign ID ${selectedSignIds}):`,
          errorResponse,
        );
        throw new Error(
          `서버 오류: ${statusCode} - ${JSON.stringify(errorResponse)}`,
        );
      }

      const result = await response.json();
      console.log(
        `✅ 서버 응답 (증상 시작 시간 저장 - Sign ID ${selectedSignIds}):`,
        result,
      );

      const symptomId = result.symptomId;

      if (!symptomId) {
        console.error('🚨 symptomId가 서버 응답에 없습니다:', result);
        Alert.alert('Error', '서버 응답에 symptomId가 없습니다.');
        return;
      }

      Alert.alert('Success', '증상 시작 시간이 저장되었습니다.');

      navigation.navigate('PainIntensity', {symptomId});
    } catch (error) {
      console.error('❌ 저장 오류:', error);
      Alert.alert('Error', `저장 중 오류 발생: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{t('언제부터 증상이 발생했나요?')}</Text>

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
        onPress={saveSymptomStartTime}>
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.nextButtonText}>{t('다음')}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SymptomOnsetTimeScreen;
