import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  Image,
  NativeModules,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { Button,Header } from '../../../../../Components';
import { COLORS,FONTS } from '../../../../../Utils';
import {useNavigation} from '@react-navigation/native';
import { 
  getOrderBuyerPendingSpesific,
  acceptOrder,
  declineOrder,
  getWishlistSpesific,
  rupiah,
  timeDate } from '../../../../../Redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {ms} from 'react-native-size-matters';
import { ImageProduct, ImageUser } from '../../../../../../api/url';

const OrderPending = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const data = useSelector(state => state.appData.orderBuyerPendingSpecific);
  const loginUser = useSelector(state => state.appData.loginUser);
  const {dataRoute} = route.params;
    console.log(data)
  const [refreshing, setRefreshing] = useState(false);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  useEffect(() => {
    dispatch(getOrderBuyerPendingSpesific(dataRoute?.id_order))
  }, []);

  const onRefresh = useCallback(() => {
        dispatch(getOrderBuyerPendingSpesific(dataRoute?.id_order)).then(
      () => {
        setRefreshing(true);
      },
    );
    wait(500).then(() => {
      setRefreshing(false);
    });
  }, []);
  return (
    <>
      {data == null ? (
        <></>
      ) : (
        <SafeAreaView style={styles.Container}>
          <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle={'dark-content'}
          />
          <Header title={'Detail Orders'} navigation={navigation} />
          <ScrollView
            contentContainerStyle={styles.Box}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="green"
                colors={['green']}
              />
            }>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 25,
                width: window.width * 0.5,
                alignSelf: 'center',

              }}>
              <View style={{flexDirection: 'row'}}>
                <Image style={styles.imageUser}   source={{uri: ImageUser+ data.User.image}} />
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.Text}>{data.User.full_name}</Text>
                  <Text style={styles.Text}>{data.User.city}</Text>
                </View>
              </View>
            </View>
            <View style={{margin: 25, flexDirection: 'column'}}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={[styles.Text, {fontSize: 20}]}>
                    List of products
                </Text>
                <Text style={[styles.Text, {color:'orange',fontSize:13}]}>
                    Pending
                </Text>
              </View>
              {data.Orders.Product &&
                data.Orders.Product.map(item => {
                 return (
                    <View  style={{flexDirection: 'row', marginTop: 24}}>
                        <View>
                        <Image
                            style={styles.image}
                            source={{uri: ImageProduct+ item.image}}
                        />
                        </View>
                        <View style={{flexDirection: 'column', marginLeft: 16}}>
                        <View
                            style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingRight: 30,
                            width: window.width * 0.8,
                            }}>
                            {data.status == 'pending' && (
                            <Text style={styles.textGrey}>Product Offer</Text>
                            )}
                        </View>
                        <View style={{width:window.width*0.7}} >
                         <Text style={[styles.textBlack]}>{item.name}</Text>
                        </View>
                        <Text style={styles.textBlack}>{`Rp. ${rupiah(
                            item.base_price,
                        )}`}</Text>

                        </View>
                    </View>
                 );
               })}

            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default OrderPending;
const window = Dimensions.get('window');
const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + 20,
    paddingBottom: Platform.OS === 'ios' ? ms(25) : ms(15),
  },
  Box: {
    flexGrow: 1,
    paddingBottom: 25,
  },
  Text: {
    fontSize: 12,
    fontFamily: FONTS.Regular,
    color: COLORS.black,
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 12,
  },
  textBlack: {
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    paddingBottom: 4,
  },
  textGrey: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: 12,
    paddingBottom: 4,
  },
  imageUser: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 20,
    backgroundColor: 'black',
  },
});
