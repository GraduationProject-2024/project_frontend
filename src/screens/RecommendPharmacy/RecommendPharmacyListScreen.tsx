import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RecommendPharmacyListStyles from '../../styles/RecommendPharmacy/RecommendPharmacyListStyles';

const pharmacies = [
  {
    name: '숙명온누리약국',
    distance: '100m',
    address: '서울 용산구 청파로47길 66 중앙빌딩 1층 (청파동 2가)',
    time: '3분',
  },
  {
    name: '해란약국',
    distance: '150m',
    address: '서울 용산구 청파로47길 53 1층 (청파동 3가)',
    time: '5분',
  },
  {
    name: '메디팜미래로약국',
    distance: '200m',
    address: '서울 용산구 청파로47길 40 (청파동 2가)',
    time: '7분',
  },
  {
    name: '건강한약국',
    distance: '250m',
    address: '서울 용산구 효창원로93길 2 1층 (청파동 2가)',
    time: '9분',
  },
  {
    name: '호정약국',
    distance: '300m',
    address: '서울 용산구 효창원로93길 9 한빛빌딩 2층 201호 (효창동 288)',
    time: '11분',
  },
];

const RecommendPharmacyListScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={RecommendPharmacyListStyles.container}>
      <ScrollView>
        {pharmacies.map((pharmacy, index) => (
          <View
            key={index}
            style={RecommendPharmacyListStyles.pharmacyContainer}>
            <Text style={RecommendPharmacyListStyles.pharmacyName}>
              {pharmacy.name}
            </Text>
            <Text style={RecommendPharmacyListStyles.pharmacyInfo}>
              {pharmacy.time} | {pharmacy.distance}
            </Text>
            <Text style={RecommendPharmacyListStyles.pharmacyAddress}>
              {pharmacy.address}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Map Button */}
      <TouchableOpacity
        style={RecommendPharmacyListStyles.mapButton}
        onPress={() => navigation.navigate('RecommendPharmacyMap')}>
        <Text style={RecommendPharmacyListStyles.mapButtonText}>
          지도로 보기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendPharmacyListScreen;
