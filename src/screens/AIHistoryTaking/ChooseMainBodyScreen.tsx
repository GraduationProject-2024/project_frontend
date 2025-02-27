import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/ChooseMainBodyStyles';
import CheckIcon from '../../img/ChooseLanguage/Check.png';

const mainBodyParts = [
  {title: '근골격', description: '뼈, 근육, 관절, 근골격 기타'},
  {title: '피부', description: '피부, 두피, 피부 기타'},
  {title: '머리/정신', description: '머리, 정신, 머리/정신 기타'},
  {
    title: '얼굴',
    description: '눈, 코, 입, 치아, 구강, 혀, 잇몸, 턱, 얼굴 기타',
  },
  {title: '목', description: '목, 식도, 목 기타'},
  {title: '가슴', description: '유방, 가슴, 가슴 기타'},
  {title: '폐/위', description: '폐, 위, 폐/위 기타'},
  {title: '등/허리', description: '척추, 등/허리 기타'},
  {
    title: '복부',
    description: '우측 상복, 우측 하복, 좌측 상복, 좌측 하복, 복부 기타',
  },
  {title: '팔', description: '어깨, 팔, 손, 손목, 손가락, 손 기타'},
  {title: '다리', description: '다리, 무릎, 발, 발가락, 다리 기타'},
  {
    title: '엉덩이/비뇨기',
    description: '엉덩이, 항문, 방광, 생식기, 엉덩이/비뇨기 기타',
  },
  {title: '기타', description: '기타'},
];

const ChooseMainBodyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedParts, setSelectedParts] = useState<string[]>([]);

  const toggleSelection = (part: string) => {
    if (selectedParts.includes(part)) {
      setSelectedParts(selectedParts.filter(item => item !== part));
    } else {
      if (selectedParts.length >= 2) {
        Alert.alert('선택 제한', '최대 2개까지만 선택할 수 있습니다.');
        return;
      }
      setSelectedParts([...selectedParts, part]);
    }
  };

  const handleConfirm = () => {
    if (selectedParts.length === 0) {
      Alert.alert('선택 필요', '최소 1개 이상의 부위를 선택하세요.');
      return;
    }

    const selectedDetails = mainBodyParts
      .filter(part => selectedParts.includes(part.title))
      .map(part => ({
        title: part.title,
        details: part.description.split(', '),
      }));

    console.log('✅ 선택한 부위:', selectedDetails);
    navigation.navigate('ChooseDetailBody', {selectedDetails});
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {mainBodyParts.map((part, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bodyPartContainer}
            onPress={() => toggleSelection(part.title)}>
            <View style={styles.bodyPartRow}>
              <View>
                <Text style={styles.title}>{part.title}</Text>
                <Text style={styles.description}>{part.description}</Text>
              </View>
              {selectedParts.includes(part.title) && (
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
