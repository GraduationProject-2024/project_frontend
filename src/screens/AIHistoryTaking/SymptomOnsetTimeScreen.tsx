import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import styles from '../../styles/AIHistoryTaking/SymptomOnsetTimeStyles';

const SymptomOnsetTimeScreen = () => {
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [selectedUnit, setSelectedUnit] = useState('주');

  const numbers = Array.from({length: 10}, (_, i) => (i + 1).toString());
  const units = ['시간', '일', '주', '달', '년'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>언제부터 증상이 발생했나요?</Text>

      <View style={styles.pickerContainer}>
        {/* 숫자 Picker */}
        <Picker
          selectedValue={selectedNumber}
          onValueChange={value => setSelectedNumber(value)}
          style={styles.picker}>
          {numbers.map(num => (
            <Picker.Item key={num} label={num} value={num} />
          ))}
        </Picker>

        {/* 단위 Picker */}
        <Picker
          selectedValue={selectedUnit}
          onValueChange={value => setSelectedUnit(value)}
          style={styles.picker}>
          {units.map(unit => (
            <Picker.Item key={unit} label={unit} value={unit} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SymptomOnsetTimeScreen;
