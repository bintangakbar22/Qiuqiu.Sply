import { StyleSheet, Text, View,StatusBar,ScrollView,RefreshControl,Dimensions,TouchableOpacity ,NativeModules,Image} from 'react-native'
import React ,{useCallback,useState,useEffect} from 'react'
import { Header } from '../../../Components'
import { useNavigation } from '@react-navigation/native'
import { COLORS,FONTS } from '../../../Utils'
import { getHistory,timeDate,rupiah, getHistoryProduct } from '../../../Redux/actions'
import {useDispatch,useSelector} from 'react-redux';
import BottomModal from '../../../Components/Others/BottomModal'
const History = () => {
    const dispatch = useDispatch();
    const history = useSelector(state => state.appData.history);
    const dataDetail = useSelector(state => state.appData.historyProduct);
    const loginUser = useSelector(state => state.appData.loginUser);
    const [refreshing, setRefreshing] = useState(false);
    const [openModal, setopenModal] = useState(false);
    const [component, setComponent] = useState(null);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(500).then(() => {
            setRefreshing(false);
        });
    }, []);

    useEffect(() => {
        dispatch(getHistory(loginUser.access_token))
    }, []);

    const onDismiss = () => {
        setopenModal(false);
    };
    const onOpenAccepted = (id) => {
        console.log("data ",dataDetail)
        if (dataDetail.id == id) {
            setopenModal(true);
            setComponent(
                <View style={{width: window.width}}>
                {dataDetail.id == id && (
                    <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: window.width * 0.9,
                        alignSelf: 'center',
                    }}>
                    {dataDetail.status == 'accepted' && (
                        <>
                        <Text
                            style={[
                            styles.Text,
                            {
                                alignSelf: 'center',
                                fontSize: 14,
                                paddingTop: 10,
                                fontFamily: FONTS.SemiBold,
                                color: COLORS.green,
                            },
                            ]}>
                            Yeay you managed to get a suitable price :)
                        </Text>
                        <Text
                            style={[
                            styles.Text,
                            {
                                alignSelf: 'center',
                                fontSize: 16,
                                paddingTop: 10,
                                fontFamily: FONTS.SemiBold,
                            },
                            ]}>
                            Product Bid
                        </Text>
                        <View
                            style={{
                            flexDirection: 'row',
                            paddingVertical: 20,
                            width: window.width * 0.9,
                            marginLeft: 20,
                            }}>
                            <Image
                            style={styles.imageUser}
                            source={{uri: dataDetail.Product.image_url}}
                            />
                            <View style={{flexDirection: 'column'}}>
                            <Text style={[styles.Text, {fontSize: 14}]}>
                                {dataDetail.Product.name}
                            </Text>
                            <Text
                                style={[styles.Text, {fontSize: 14}]}>{`Rp. ${rupiah(
                                dataDetail.Product.base_price
                            )}`}</Text>
                            <Text style={[styles.Text, {fontSize: 14}]}>
                                Succesfully Bid {`Rp. ${rupiah(dataDetail.price)}`}
                            </Text>
                            </View>
                        </View>
                        </>
                    )}
                    {dataDetail.status == '' && (
                    <>
                        <Text
                            style={[
                            styles.Text,
                            {
                                alignSelf: 'center',
                                fontSize: 14,
                                paddingTop: 10,
                                fontFamily: FONTS.SemiBold,
                                color: COLORS.grey,
                            },
                            ]}>
                            Wait the seller response your bid :)
                        </Text>
                        <Text
                            style={[
                            styles.Text,
                            {
                                alignSelf: 'center',
                                fontSize: 16,
                                paddingTop: 10,
                                fontFamily: FONTS.SemiBold,
                            },
                            ]}>
                            Product Bid
                        </Text>
                
                        <View
                            style={{
                            flexDirection: 'row',
                            paddingVertical: 20,
                            width: window.width * 0.9,
                            marginLeft: 20,
                            }}>
                            <Image
                            style={styles.imageUser}
                            source={{uri: dataDetail.Product.image_url}}
                            />
                            <View style={{flexDirection: 'column'}}>
                            <Text style={[styles.Text, {fontSize: 14}]}>
                                {dataDetail.Product.name}
                            </Text>
                            <Text
                                style={[styles.Text, {fontSize: 14}]}>{`Rp. ${rupiah(
                                dataDetail.Product.base_price
                            )}`}</Text>
                            <Text style={[styles.Text, {fontSize: 14}]}>
                                Bid {`Rp. ${rupiah(dataDetail.price)}`}
                            </Text>
                            </View>
                        </View>
                    </>
                    )}
                    {dataDetail.status == 'declined' && (
                        <>
                        <Text
                            style={[
                            styles.Text,
                            {
                                alignSelf: 'center',
                                fontSize: 14,
                                paddingTop: 10,
                                fontFamily: FONTS.SemiBold,
                                color: COLORS.red,
                            },
                            ]}>
                            Mehh your order got declined by seller :({' '}
                        </Text>
                        <Text
                            style={[
                            styles.textGrey,
                            {alignSelf: 'center', fontSize: 14},
                            ]}>
                            Hope you get best price in other product!
                        </Text>

                        <View
                            style={{
                            flexDirection: 'row',
                            paddingTop: 20,
                            width: window.width * 0.9,
                            marginLeft: 20,
                            }}>
                            <Image
                            style={{
                                width: 60,
                                height: 60,
                                borderRadius: 10,
                                marginRight: 20,
                            }}
                            source={{uri: dataDetail.image_url}}
                            />
                            <View style={{flexDirection: 'column', marginBottom: 10}}>
                            <Text
                                style={[
                                styles.Text,
                                {fontSize: 16, fontFamily: FONTS.SemiBold},
                                ]}>
                                {dataDetail.product_name}
                            </Text>
                            <Text
                                style={[styles.Text, {fontSize: 14}]}>{`Rp. ${rupiah(
                                dataDetail.base_price,
                            )}`}</Text>
                            <Text style={[styles.textGrey]}>{`${timeDate(
                                dataDetail.updatedAt,
                            )}`}</Text>
                            </View>
                        </View>
                        </>
                    )}
                    </View>
                )}
                </View>,
            );
        }
    };

  return (
    <View style={styles.Container}>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />
      <Header title={'My History'} />
      <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="green"
                colors={['green']}
              />
            }>
        {history &&
          history.map(item => {
            return (
              <TouchableOpacity
                style={{flexDirection: 'row', margin:20,marginTop:0}}
                key={item.id}
                onPress={() => {
                    dispatch(
                        getHistoryProduct(loginUser.access_token, item.id),
                    )
                    .then(() => {
                      onOpenAccepted(item.id);
                    });
                }}>
                <Image source={{uri: item.Product.image_url}} style={styles.image} />
                <View style={{flexDirection: 'column', marginLeft: 15}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingRight: 30,
                    }}>
                    {item.status == 'accepted'||item.status == '' ? (
                      <Text style={[styles.textGrey,{color:item.status=='accepted'?COLORS.green:COLORS.grey}]}>Product Offer</Text>
                    ) : (
                      <Text style={[styles.textGrey, {color: COLORS.red}]}>
                        Offer Declined
                      </Text>
                    )}
                    <View style={{flexDirection: 'row'}}>
                      <Text style={[styles.textGrey]}>{`${timeDate(
                        item.transaction_date,
                      )}`}</Text>
                    </View>
                  </View>
                  <Text style={styles.textBlack}>{item.Product.name}</Text>
                  <Text style={styles.textBlack}>{`Rp. ${rupiah(
                    item.Product.base_price,
                  )}`}</Text>
                  {item.price != null && item.status == 'accepted' ? (
                    <Text style={styles.textBlack}>
                      Successfully Bid {`Rp. ${rupiah(item.price)}`}
                    </Text>
                  ) : (
                    <Text style={styles.textBlack}>
                      Bid {`Rp. ${rupiah(item.price)}`}
                    </Text>
                  )}
                  {item.status == 'accepted' && (
                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        width: window.width * 0.8,
                      }}>
                      <Text style={[styles.textGrey, {fontSize: 14}]}>
                        you will be contacted by the seller via whatsapp
                      </Text>
                    </View>
                  )}

                  <View
                    style={{
                      flexWrap: 'wrap',
                      width: window.width * 0.82,
                      flexDirection: 'row',
                    }}>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}  
       {openModal && (
          <BottomModal onDismiss={onDismiss}>{component}</BottomModal>
        )}
      </ScrollView>
    </View>
  )
}

export default History
const {StatusBarManager} = NativeModules;
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + 20,
  },
  textBold: {
    color: COLORS.black,
    fontFamily: FONTS.Bold,
    fontSize: 24,
  },
  text: {
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    fontSize: 22,
  },
  textGrey: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: 12,
    paddingBottom: 4,
  },
  textBlack: {
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    fontSize: 14,
    paddingBottom: 4,
  },
  image: {
    width: 40,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 12,
  },
  Box: {
    width: window.width * 0.9,
  },

  imageUser: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 20,
    backgroundColor: 'black',
  },
  Text: {
    fontSize: 12,
    fontFamily: FONTS.Regular,
    color: COLORS.black,
  },
})