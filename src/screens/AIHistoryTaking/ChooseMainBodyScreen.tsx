import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/ChooseMainBodyStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const API_URL = 'http://52.78.79.53:8081/api/v1/main-body/all';

const ChooseMainBodyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [mainBodyParts, setMainBodyParts] = useState<
    {body: string; description: string}[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMainBodyParts = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', '로그인이 필요합니다.');
          return;
        }

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            Accept: 'application/json;charset=UTF-8',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`서버 오류: ${response.status}`);
        }

        const data = await response.json();
        setMainBodyParts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMainBodyParts();
  }, []);

  const toggleSelection = (body: string) => {
    if (selectedParts.includes(body)) {
      setSelectedParts(selectedParts.filter(item => item !== body));
    } else {
      if (selectedParts.length >= 2) {
        Alert.alert('선택 제한', '최대 2개까지만 선택할 수 있습니다.');
        return;
      }
      setSelectedParts([...selectedParts, body]);
    }
  };

  const handleConfirm = () => {
    if (selectedParts.length === 0) {
      Alert.alert('선택 필요', '최소 1개 이상의 부위를 선택하세요.');
      return;
    }

    const selectedDetails = mainBodyParts
      .filter(part => selectedParts.includes(part.body))
      .map(part => ({
        title: part.body,
        details: part.description,
      }));

    console.log('✅ 선택한 부위:', selectedDetails);
    navigation.navigate('ChooseDetailBody', {selectedDetails});
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2527BF" />
        <Text>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>오류 발생: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {mainBodyParts.map((part, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bodyPartContainer}
            onPress={() => toggleSelection(part.body)}>
            <View style={styles.bodyPartRow}>
              <View>
                <Text style={styles.title}>{part.description}</Text>
              </View>
              {selectedParts.includes(part.body) && (
                <Image source={CheckIcon} style={styles.checkIcon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {backgroundColor: selectedParts.length > 0 ? '#2527BF' : '#d1d1d1'},
          ]}
          onPress={handleConfirm}
          disabled={selectedParts.length === 0}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseMainBodyScreen;
