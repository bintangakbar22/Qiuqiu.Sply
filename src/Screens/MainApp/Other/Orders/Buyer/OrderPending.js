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
  rupiah,
  doneOrder} from '../../../../../Redux/actions';
import {useSelector, useDispatch} from 'react-redux';
import {ms} from 'react-native-size-matters';
import { ImageProduct, ImageUser } from '../../../../../../api/url';
import { URLQ } from '../../../../../../api/url';
import ImagePicker from 'react-native-image-picker';

import RNFetchBlob from 'rn-fetch-blob';

const OrderPending = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const data = useSelector(state => state.appData.orderBuyerPendingSpecific);
  const [ImageSource,setImageSource] = useState(null)
  const [dataImage,setDataImage] = useState(null)
  const {dataRoute} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  console.log(ImageSource)
  const imagePicker = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500
    };
    ImagePicker.launchImageLibrary(options, (response) => {
 
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        setImageSource(response.uri)
        setDataImage(response.data)
      }
    });
  };
  console.log(ImageSource)
  const uploadImageToServer = () => {
    const orders_id = data.Orders.id.toString()
    RNFetchBlob.fetch('POST', URLQ+'seller/order.php?method=uploadPhoto', {
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        { name: 'image', filename: 'image.png', type: 'image/png', data: dataImage },
        { name: 'id_order', data:orders_id},
      ]).then((resp) => {
        var tempMSG = resp.data;
        console.log("Upload Berhasil")
        navigation.navigate("MainApp");
      }).catch((err) => {
        console.log("Upload gagal")
        console.log(err)
      })

  }
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
      {data &&  (
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
                 {data.Orders.status=='pending' &&
                <Text style={[styles.Text, {color:'orange',fontSize:13}]}>
                    Pending
                </Text>
                 }
                {data.Orders.status=='accepted' &&
                <Text style={[styles.Text, {color:COLORS.green,fontSize:13}]}>
                    Accepted
                </Text>
                }
                {data.Orders.status=='inDelivery' &&
                <Text style={[styles.Text, {color:COLORS.green,fontSize:13}]}>
                    inDelivery
                </Text>
                }
                {data.Orders.status=='done' &&
                <Text style={[styles.Text, {color:COLORS.green,fontSize:13}]}>
                    Done
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
                            item.order_price,
                        )}`}</Text>
                        <Text style={styles.textGrey}>Qty :{item.qty}</Text>

                        </View>
                    </View>
                 );
               })}
               
                  <Text style={[styles.Text, {fontSize:20,paddingTop:ms(25)}]}>
                      BCA
                  </Text>
                  <Text style={[styles.textBlack, {fontSize:15}]}>
                      0661146647
                  </Text>
                  <Text style={[styles.textBlack, {fontSize:15}]}>
                      a.n Vivaldy Ferdiansyah Nugroho
                  </Text>
               
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
          {data.Orders.status=='inDelivery' &&
          <>
            <Button
              caption={'Orders Done'}
              style={{
                width: window.width * 0.8,
                height: 50,
                backgroundColor: COLORS.green,
                position:'absolute',
                bottom:15
              }}
              onPress={() => {
                dispatch(doneOrder(data.Orders.id)).then(()=>{navigation.navigate("MainApp")})
              }}
            />
          </>
          }
          {data.Orders.status=='confirmed' &&ImageSource!==null &&
          <>
            {/* <Image   uri={ImageSource} style={{width:ms(40),height:ms(40),position:'absolute',bottom:65}}  /> */}
            <Button
              caption={'Confirm Upload'}
              style={{
                width: window.width * 0.8,
                height: 50,
                backgroundColor: COLORS.primaryBlue,
                position:'absolute',
                bottom:5
              }}
              onPress={() => {
                uploadImageToServer()
              }}
            />
          </>
          }
          {data.Orders.status=='confirmed' &&
            <Button
              caption={'Upload Payment Proof'}
              style={{
                width: window.width * 0.8,
                height: 50,
                backgroundColor: COLORS.green,
                position:'absolute',
                bottom:65
              }}
              onPress={() => {
                imagePicker()
              }}
            />
          }
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
