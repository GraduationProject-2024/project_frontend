import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/SymptomOnsetTimeStyles';

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
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [selectedUnit, setSelectedUnit] = useState('분');
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const navigation = useNavigation();

  const numbers = Array.from({length: 11}, (_, i) => ((i + 1) * 5).toString());
  const units = ['분', '시간', '일', '주', '달', '년'];

  const handleScrollChange = () => {
    setIsNextButtonActive(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>언제부터 증상이 발생했나요?</Text>
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
        disabled={!isNextButtonActive}
        onPress={() => navigation.navigate('PainIntensity')}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SymptomOnsetTimeScreen;
