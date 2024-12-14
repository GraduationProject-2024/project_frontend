import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import styles from '../../styles/Home/HomeProfileStyles';

const HomeProfileScreen = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  const handleFlip = () => {
    Animated.timing(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(!isFlipped);
    });
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View style={styles.profileContainer}>
      {/* Front Side */}
      <Animated.View
        style={[
          styles.profileCard,
          {
            transform: [{rotateY: frontInterpolate}],
            backfaceVisibility: 'hidden',
          },
          !isFlipped && {zIndex: 1},
        ]}>
        <TouchableOpacity onPress={handleFlip} style={styles.arrowRightButton}>
          <Image
            source={require('../../img/Home/arrowRightIcon.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.profileInfo}>
          <Image
            source={require('../../img/Home/profileImage.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileText}>눈송이 님</Text>
            <Text style={styles.profileSubText}>여성, 만 20세</Text>
          </View>
        </View>
      </Animated.View>

      {/* Back Side */}
      <Animated.View
        style={[
          styles.profileCard,
          styles.profileBack,
          {
            transform: [{rotateY: backInterpolate}],
            backfaceVisibility: 'hidden',
          },
          isFlipped && {zIndex: 1},
        ]}>
        <TouchableOpacity onPress={handleFlip} style={styles.arrowLeftButton}>
          <Image
            source={require('../../img/Home/arrowLeftIcon.png')}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
        <View style={styles.healthInfo}>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>과거병력</Text>
            <Text style={styles.healthValue}>당뇨</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>가족력</Text>
            <Text style={styles.healthValue}>고혈압</Text>
          </View>
          <View style={styles.healthRow}>
            <Text style={styles.healthLabel}>복용하는 약</Text>
            <Text style={styles.healthValue}>당뇨약(혈당 강화제)</Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default HomeProfileScreen;
