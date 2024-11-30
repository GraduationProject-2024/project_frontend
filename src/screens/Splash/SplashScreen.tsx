import React, {useEffect} from 'react';
import {View, Image} from 'react-native';
import SplashStyles from '../../styles/Splash/SplashStyles';
import Logo from '../../img/Splash/Logo.png';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={SplashStyles.container}>
      <Image source={Logo} style={SplashStyles.logo} />
    </View>
  );
};

export default SplashScreen;
