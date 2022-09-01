import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import React, {useEffect} from 'react';
import {FONTS} from '../../Utils/Fonts';
import {COLORS} from '../../Utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import {ms} from 'react-native-size-matters';
import {NotificationScreen} from '../../Redux/actions';
import Seller from '../../Components/Notification/Seller';
import Buyer from '../../Components/Notification/Buyer';

const Notifikasi = () => {
  const dispatch = useDispatch();

  const userType = useSelector(state => state.appData.userType);

  useEffect(() => {
    dispatch(NotificationScreen('Seller'));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'dark-content'}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: window.width * 0.9,
          marginBottom: ms(20),
        }}>
        <Text style={[styles.textBold, {fontSize: ms(18)}]}>Notification</Text>
         {userType == 'Seller' ? (
              <Text style={styles.ActivePage}>Seller</Text>
          ) : (
            <Text style={styles.ActivePage}>Buyer</Text>
          )}
      </View>
      {userType == 'Seller' ? <Seller /> : <Buyer />}
    </View>
  );
};

export default Notifikasi;
const window = Dimensions.get('window');

const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + ms(20),
    paddingBottom: Platform.OS === 'ios' ? ms(75) : ms(60),
    alignItems: 'center',
  },
  Box: {
    width: window.width * 0.9,
  },
  textBold: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: ms(20),
  },
  ActivePage: {
    fontFamily: FONTS.Bold,
    fontSize: ms(16),
    color: COLORS.black,
    borderBottomWidth: 2,
    borderColor: COLORS.red,
  },
  PasivePage: {
    fontFamily: FONTS.Regular,
    color: COLORS.grey,
    fontSize: ms(14),
  },
});
