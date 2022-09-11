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
  TextInput
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { Button,Header } from '../../../../../Components';
import { COLORS,FONTS } from '../../../../../Utils';
import {useNavigation} from '@react-navigation/native';
import { rupiah,getOrderSellerPendingSpesific,acceptOrder,inputReceipt } from '../../../../../Redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {ms} from 'react-native-size-matters';
import { ImageProduct, ImageUser } from '../../../../../../api/url';

const OrderPendingSeller = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loginUser = useSelector(state => state.appData.loginUser);
  const data = useSelector(state => state.appData.orderSellerPendingSpecific);


  const [receipt, setReceipt] = useState('');
  const receiptHandler = (value) => {
    setReceipt(value)
  };
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
            >
            <View
              style={{
                flexDirection: 'row',
                marginTop: 25,
                width: window.width * 0.5,
                alignSelf: 'center',

              }}>
              <View style={{flexDirection: 'row'}}>
                <Image style={styles.imageUser}   source={{uri: ImageUser+ data.Orders.User.image}} />
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.Text}>{data.Orders.User.full_name}</Text>
                  <Text style={styles.Text}>{data.Orders.User.city}</Text>
                </View>
              </View>
            </View>
            <View style={{margin: 25, flexDirection: 'column'}}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={[styles.Text, {fontSize: 20}]}>
                    List of products
                </Text>
                {data.Orders.status=='pending'&&
                <Text style={[styles.Text, {color:'orange',fontSize:13}]}>
                    Pending
                </Text>
                }
                {data.Orders.status=='accepted'&&
                <Text style={[styles.Text, {color:COLORS.green,fontSize:13}]}>
                    Accepted
                </Text>
                }
                {data.Orders.status=='inDelivery'&&
                <Text style={[styles.Text, {color:COLORS.green,fontSize:13}]}>
                    inDelivery
                </Text>
                }
                
              </View>
              {data.Orders.Product &&
                data.Orders.Product.map(item => {
                 return (
                    <View  style={{flexDirection: 'row', marginTop: 24}}>
                        <View>
                        <Image
                            style={styles.image}
                            source={{uri: ImageProduct+ item.image_name}}
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
                            item.price,
                        )}`}</Text>
                        <Text style={styles.textGrey}>Qty :{item.qty}</Text>

                        </View>
                    </View>
                 );
               })}
            {data.Orders.status=='inDelivery'&&
              <>
              <Text style={[styles.Text, {fontSize:20,paddingTop:ms(25)}]}>
                  Delivery Info
              </Text>
              <Text style={[styles.textBlack, {fontSize:15}]}>
                  Courier  :  {data.Orders.courier}
              </Text>
              <Text style={[styles.textBlack, {fontSize:15}]}>
                  No Receipt  :  {data.Orders.no_resi}
              </Text>
              </>
            }
            </View>
          </ScrollView>

          {data.Orders.status=='accepted' &&
            <>
                
            <TextInput  style={styles.Input}  placeholder="Delivery Receipt" placeholderTextColor={'#818181'} value={receipt} onChangeText={receiptHandler}   />
            <Button
              caption={'Upload Delivery receipt'}
              style={{
                width: window.width * 0.8,
                height: 50,
                backgroundColor: receipt.length<11?COLORS.disabled:COLORS.green,
                position:'absolute',
                bottom:25
              }}
              onPress={() => {
                dispatch(inputReceipt(data.Orders.id,receipt)).then(()=>{navigation.navigate("MainApp")})
              }}
              disabled={receipt.length<11?true:false}
            />
            </>
          }
          {data.Orders.status=='pending' &&
            <Button
              caption={'Accept this order'}
              style={{
                width: window.width * 0.8,
                height: 50,
                backgroundColor: COLORS.green,
                position:'absolute',
                bottom:25
              }}
              onPress={() => {
                dispatch(acceptOrder(data.Orders.id)).then(()=>{navigation.navigate("MainApp")})
              }}
            />
          }

        </SafeAreaView>
      )}
    </>
  );
};

export default OrderPendingSeller;
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
  Input: {
    width: window.width * 0.8,
    paddingVertical: ms(6),
    fontFamily: FONTS.Regular,
    fontSize: ms(12),
    color: COLORS.black,
    position:'absolute',
    bottom:85,
    alignSelf:'center',
    height: ms(45),
    borderWidth: ms(1),
    borderRadius: ms(10),
    paddingHorizontal: ms(15),
    backgroundColor:COLORS.white
  },
});
