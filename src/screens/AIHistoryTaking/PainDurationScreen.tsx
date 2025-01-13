import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styles from '../../styles/AIHistoryTaking/PainDurationStyles';

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
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('초');
  const [isNextButtonActive, setIsNextButtonActive] = useState(false);
  const navigation = useNavigation();

  const numbers = Array.from({length: 59}, (_, i) => (i + 1).toString());
  const units = ['초', '분', '시간'];

  const handleScrollChange = () => {
    setIsNextButtonActive(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>통증은 어느 정도 지속되나요?</Text>
      <View style={styles.centeredPickerWrapper}>
        <WheelPicker
          options={numbers}
          selectedIndex={selectedNumber - 1}
          onChange={index => {
            setSelectedNumber(index + 1);
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
        onPress={() => navigation.navigate('AdditionalInformation')}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PainDurationScreen;
