import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/AIHistoryTaking/ChooseDetailBodyStyles';

const SUB_BODY_API_URL = 'http://52.78.79.53:8081/api/v1/sub-body';

const ChooseDetailBodyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // ✅ 선택한 주요 신체 부위 데이터 (ChooseMainBodyScreen에서 전달됨)
  const selectedDetails = route.params?.selectedDetails || [];

  // ✅ 세부 신체 부위 저장 (API 결과)
  const [subBodyParts, setSubBodyParts] = useState<
    {body: string; description: string; mainBodyPartId: number}[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState({});

  // ✅ 선택된 주요 신체 부위에 해당하는 세부 신체 부위 조회
  useEffect(() => {
    const fetchSubBodyParts = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          Alert.alert('Error', '로그인이 필요합니다.');
          return;
        }

        const bodyParams = selectedDetails
          .map(part => `body=${part.title}`)
          .join('&');
        const requestUrl = `${SUB_BODY_API_URL}?${bodyParams}`;

        console.log('📤 세부 신체 부위 조회 요청:', requestUrl);

        const response = await fetch(requestUrl, {
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
        console.log('✅ 서버 응답 (세부 신체 부위):', data);

        setSubBodyParts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubBodyParts();
  }, [selectedDetails]);

  // ✅ 주요 신체 부위별로 세부 신체 부위 그룹화
  const groupedSubBodyParts = subBodyParts.reduce((acc, part) => {
    if (!acc[part.mainBodyPartId]) {
      acc[part.mainBodyPartId] = {
        title: part.body,
        description: part.description,
        details: [],
      };
    }
    acc[part.mainBodyPartId].details.push(part.description);
    return acc;
  }, {});

  const toggleCondition = (bodyPart, condition) => {
    setSelectedConditions(prev => {
      const currentConditions = prev[bodyPart] || [];
      const updatedConditions = currentConditions.includes(condition)
        ? currentConditions.filter(item => item !== condition)
        : [...currentConditions, condition];

      const newState = {...prev, [bodyPart]: updatedConditions};

      console.log(`🔹 ${bodyPart} 선택됨:`, updatedConditions);

      return newState;
    });
  };

  const handleNext = () => {
    console.log('✅ 선택된 세부 신체 부위 데이터:', selectedConditions);

    const selectedBodyParts = Object.keys(selectedConditions).filter(
      key => selectedConditions[key].length > 0,
    );

    console.log('✅ 최종 전달할 신체 부위:', selectedBodyParts);

    if (selectedBodyParts.length === 0) {
      Alert.alert('선택 필요', '최소 1개 이상의 신체 부위를 선택하세요.');
      return;
    }

    const selectedDetailsWithDescription = selectedDetails.map(part => ({
      title: part.title || '',
      details: selectedConditions[part.title] || [],
    }));

    console.log('📌 최종 전달할 상세 데이터:', selectedDetailsWithDescription);

    navigation.navigate('ChooseDetailSymptom', {
      selectedBodyParts,
      selectedDetails: selectedDetailsWithDescription,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2527BF" />
        ) : error ? (
          <Text style={styles.errorText}>❌ 오류 발생: {error}</Text>
        ) : (
          <>
            {Object.values(groupedSubBodyParts).map((group, index) => {
              // ✅ ChooseMainBodyScreen에서 저장한 주요 신체 부위를 직접 사용
              const selectedMainBodyPart =
                selectedDetails[index]?.title || '주요 신체 부위 미확인';

              return (
                <View key={index} style={styles.groupContainer}>
                  <Text style={styles.groupTitle}>{selectedMainBodyPart}</Text>
                  <View style={styles.conditionsWrapper}>
                    {group.details.map((detail, i) => (
                      <TouchableOpacity
                        key={i}
                        style={[
                          styles.conditionButton,
                          selectedConditions[group.title]?.includes(detail) &&
                            styles.conditionButtonSelected,
                        ]}
                        onPress={() => toggleCondition(group.title, detail)}>
                        <Text
                          style={[
                            styles.conditionText,
                            selectedConditions[group.title]?.includes(detail) &&
                              styles.conditionTextSelected,
                          ]}>
                          {detail}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleNext}>
          <Text style={styles.confirmButtonText}>선택 완료</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChooseDetailBodyScreen;
