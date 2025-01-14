import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/PainIntensityStyles';
import PainIntensityFaceEmoji_1 from '../../img/PainIntensity/PainIntensityFaceEmoji_1.png';
import PainIntensityFaceEmoji_2 from '../../img/PainIntensity/PainIntensityFaceEmoji_2.png';
import PainIntensityFaceEmoji_3 from '../../img/PainIntensity/PainIntensityFaceEmoji_3.png';
import PainIntensityFaceEmoji_4 from '../../img/PainIntensity/PainIntensityFaceEmoji_4.png';
import PainIntensityFaceEmoji_5 from '../../img/PainIntensity/PainIntensityFaceEmoji_5.png';
import PainIntensityFaceEmoji_6 from '../../img/PainIntensity/PainIntensityFaceEmoji_6.png';
import PainIntensityFaceEmoji_7 from '../../img/PainIntensity/PainIntensityFaceEmoji_7.png';
import PainIntensityFaceEmoji_8 from '../../img/PainIntensity/PainIntensityFaceEmoji_8.png';
import PainIntensityFaceEmoji_9 from '../../img/PainIntensity/PainIntensityFaceEmoji_9.png';
import PainIntensityFaceEmoji_10 from '../../img/PainIntensity/PainIntensityFaceEmoji_10.png';
import SliderThumb from '../../img/PainIntensity/SliderThumb.png';

const painImages = [
  PainIntensityFaceEmoji_1,
  PainIntensityFaceEmoji_2,
  PainIntensityFaceEmoji_3,
  PainIntensityFaceEmoji_4,
  PainIntensityFaceEmoji_5,
  PainIntensityFaceEmoji_6,
  PainIntensityFaceEmoji_7,
  PainIntensityFaceEmoji_8,
  PainIntensityFaceEmoji_9,
  PainIntensityFaceEmoji_10,
];

const PainIntensityScreen = () => {
  const [painLevel, setPainLevel] = useState(1);
  const [isSliderMoved, setIsSliderMoved] = useState(false);
  const navigation = useNavigation();

  const painDescriptions = [
    {
      label: '통증이 거의 없음',
      description:
        '가벼운 불편함이 느껴질 정도이며, \n일상 생활에는 거의 영향을 주지 않음',
    },
    {
      label: '통증이 약간 있음',
      description:
        '통증이 아주 약하게 느껴지며, \n특정 순간에만 약간 불편함을 느낌',
    },
    {
      label: '통증이 가벼움',
      description:
        '지속적으로 느껴지는 약한 통증이 있지만, \n일상 생활에는 큰 영향을 주지 않음',
    },
    {
      label: '통증이 불편함',
      description:
        '뚜렷한 통증이 느껴지기 시작하며, \n신경이 쓰이기 시작하지만 일상 활동은 가능함',
    },
    {
      label: '통증을 참을 수 있음',
      description:
        '통증을 확실하게 느낄 수 있으며, \n일상 생활에 다소 지장을 줄 정도이나 참을 수 있음',
    },
    {
      label: '통증을 참기 힘듦',
      description:
        '참기 힘든 정도의 통증이며, \n일상 생활에 집중하기 어렵고 활동에 제한이 생김',
    },
    {
      label: '통증이 강함',
      description:
        '활동에 제한이 생길 정도로 강한 통증이며, \n활동을 중단하고 적절한 휴식이나 약물이 필요함',
    },
    {
      label: '통증이 심함',
      description:
        '심하고, 움직이기 어려울 정도의 통증이며, \n활동이 거의 불가능하고 집중력이 심각하게 저하됨',
    },
    {
      label: '통증이 극심함',
      description:
        '긴급한 의료 조치가 필요한 통증이며, \n매우 극심하여 통증 때문에 어떤 활동도 불가능함',
    },
    {
      label: '통증이 매우 극심함',
      description:
        '지금까지 느낀 중 통증 중 가장 극심하며, \n도저히 참을 수 없고 즉각적인 치료가 필요함',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>통증의 강도를 선택해주세요</Text>
      <Text style={styles.instruction}>
        통증의 강도에 가장 가까운 것을 선택해주세요. {'\n'} 숫자가 클수록 통증이
        심한 것을 의미합니다.
      </Text>
      <Image source={painImages[painLevel - 1]} style={styles.emoji} />
      <Text style={styles.painLabel}>
        {painDescriptions[painLevel - 1].label}
      </Text>
      <Text style={styles.painDescription}>
        {painDescriptions[painLevel - 1].description}
      </Text>
      <Slider
        style={[styles.slider, {transform: [{scaleY: 3}]}]}
        minimumValue={1}
        maximumValue={10}
        step={1}
        value={painLevel}
        minimumTrackTintColor="#2527BF"
        maximumTrackTintColor="#E5E5FF"
        thumbImage={SliderThumb}
        onValueChange={value => {
          setPainLevel(value);
          setIsSliderMoved(true);
        }}
      />
      <TouchableOpacity
        style={[
          styles.nextButton,
          {backgroundColor: isSliderMoved ? '#2527BF' : '#B5B5B5'},
        ]}
        disabled={!isSliderMoved}
        onPress={() => navigation.navigate('PainDuration')}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PainIntensityScreen;
