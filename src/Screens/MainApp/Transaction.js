import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  NativeModules,
  Platform,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import {ms} from 'react-native-size-matters';
import {
  connectionChecker,
  TransactionScreen,
  getOrderBuyerPending
} from '../../Redux/actions';
import {
  CategoryButton,
  DaftarJualShimmer,
  Header,
  Blank,
} from '../../Components';
import {COLORS, FONTS} from '../../Utils';
import { ImageUser } from '../../../api/url';
import Pending from '../../Components/Transaction/Pending';

const Transaction = ({navigation}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const connection = useSelector(state => state.appData.connection);
  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);
  const orderBuyerPending = useSelector(state => state.appData.orderBuyerPending);
  const transactionScreen = useSelector(state => state.appData.transactionScreen);
  const category = useSelector(state => state.appData.category);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      dispatch(connectionChecker());
      dispatch(TransactionScreen('Pending'));
      if(loginUser){
        getData();
      }
    }
  }, [isFocused]);

  const getData = () => {
    dispatch(getOrderBuyerPending(loginUser.id))
    setLoading(true);
   
    setLoading(false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.Container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
      <Header title={'My Transaction'} />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: ms(5),
          marginBottom: ms(15),
          marginHorizontal: ms(15),
        }}>
        <CategoryButton
          name={'Pending'}
          icon={'account-clock-outline'}
          style={{backgroundColor: transactionScreen == 'Pending'? COLORS.black:COLORS.grey }}
          onPress={() => dispatch(TransactionScreen('Pending'))}/>
        <CategoryButton
          name={'Delivered'}
          icon={'truck-delivery-outline'}
          style={{backgroundColor: transactionScreen == 'Delivered'? COLORS.black:COLORS.grey }}
          />
        <CategoryButton
          name={'Done'}
          icon={'check-outline'}
          style={{backgroundColor: transactionScreen == 'Done'? COLORS.black:COLORS.grey }}
          />
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="green"
            colors={['green']}
          />
        }>
        {loading || !connection ? (
          <DaftarJualShimmer />
        ) : (
          <>
            {transactionScreen == 'Pending' && (
              <Pending data={orderBuyerPending} />
            )}
            {transactionScreen == 'Delivered' &&
              <Blank caption={'No Interested!'} onRefresh={onRefresh} />
             }
            {transactionScreen == 'Done' &&
              <Blank caption={'No Product Sold!'} onRefresh={onRefresh} />
            }
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Transaction;

const {StatusBarManager} = NativeModules;
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + ms(20),
    paddingBottom: Platform.OS === 'ios' ? ms(75) : ms(60),
  },
  Name: {
    fontSize: ms(12),
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
  },
  Location: {
    fontSize: ms(10),
    fontFamily: FONTS.Regular,
    color: COLORS.black,
  },
  Text: {
    fontSize: ms(12),
    fontFamily: FONTS.Regular,
    color: COLORS.black,
  },
});
