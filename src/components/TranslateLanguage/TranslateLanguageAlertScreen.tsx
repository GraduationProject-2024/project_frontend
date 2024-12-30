import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import TranslateLanguageAlertStyles from '../../styles/TranslateLanguage/TranslateLanguageAlertStyles';

const TranslateLanguageAlertScreen = ({
  visible,
  onCancel,
  onConfirm,
  selectedLanguage,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}>
      <View style={TranslateLanguageAlertStyles.overlay}>
        <View style={TranslateLanguageAlertStyles.container}>
          <Text style={TranslateLanguageAlertStyles.message}>
            언어를 {selectedLanguage}로 변경하시겠습니까?
          </Text>
          <View style={TranslateLanguageAlertStyles.buttonRow}>
            <TouchableOpacity
              style={TranslateLanguageAlertStyles.cancelButton}
              onPress={onCancel}>
              <Text style={TranslateLanguageAlertStyles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TranslateLanguageAlertStyles.confirmButton}
              onPress={onConfirm}>
              <Text style={TranslateLanguageAlertStyles.confirmText}>변경</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TranslateLanguageAlertScreen;
