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
  Linking,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import {Button, Header} from '../../../Components';
import {COLORS, FONTS} from '../../../Utils';
import {useNavigation} from '@react-navigation/native';
import {
  acceptOrder,
  declineOrder,
  getWishlistSpesific,
  rupiah,
  SoldOrder,
  timeDate,
  sendOnWhatsApp,
} from '../../../Redux/actions';
import BottomModal from '../../../Components/Others/BottomModal';
import {useSelector, useDispatch} from 'react-redux';
import {ms} from 'react-native-size-matters';

const InfoPenawar = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const data = useSelector(state => state.appData.wishlistSpesific);
  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);

  const {dataRoute} = route.params;

  const [openModal, setopenModal] = useState(false);
  const [component, setComponent] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  var url = 'whatsapp://send?text=' + 'Hello this is ' +  userData.full_name + ' who sell ' + data?.product_name +
            ' in SecondApp ' +'&phone=62' + data?.User.phone_number;

  const onOpenAccepted = () => {
    setopenModal(true);
    setComponent(
      <View style={{width: window.width}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: window.width * 0.9,
            alignSelf: 'center',
          }}>
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
          <Text style={[styles.textGrey, {alignSelf: 'center', fontSize: 14}]}>
            Immediately contact the buyer via whatsapp for further transactions
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
            Product Match
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 20,
              width: window.width * 0.9,
              marginLeft: 20,
            }}>
            <Image style={styles.imageUser} />
            <View style={{flexDirection: 'column'}}>
              <Text style={[styles.Text, {fontSize: 14}]}>
                {data.User.full_name}
              </Text>
              <Text style={[styles.Text, {fontSize: 14}]}>
                {data.User.city}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 20,
              width: window.width * 0.9,
              marginLeft: 20,
            }}>
            <Image
              style={styles.imageUser}
              source={{uri: data.Product.image_url}}
            />
            <View style={{flexDirection: 'column', marginBottom: 10}}>
              <Text style={[styles.Text, {fontSize: 14}]}>
                {data.product_name}
              </Text>
              <Text style={[styles.Text, {fontSize: 14}]}>{`Rp. ${rupiah(
                data.base_price,
              )}`}</Text>
              <Text style={[styles.Text, {fontSize: 14}]}>
                Offered {`Rp. ${rupiah(data.price)}`}
              </Text>
            </View>
          </View>
          <Button
            caption={'Contact Buyer via Whatsapp'}
            style={{width: window.width * 0.8, height: 50, marginVertical: 15}}
            onPress={() => {
              sendOnWhatsApp(url);
            }}
          />
        </View>
      </View>,
    );
  };

  const onOpenStatus = status => {
    setopenModal(true);
    setComponent(
      <View style={{width: window.width}}>
        <View
          style={{
            justifyContent: 'center',
            width: window.width * 0.9,
            alignSelf: 'center',
          }}>
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
            Update your product status
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingTop: 20,
              width: window.width * 0.8,
              marginLeft: 20,
            }}
            onPress={() => {
              setopenModal(false);
              onOpenStatus('Sold');
            }}>
            <View
              style={{
                borderRadius: 15,
                width: 20,
                height: 20,
                backgroundColor: status == 'Sold' ? COLORS.green : '#d0d0d0',
              }}
            />
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text style={[styles.Text, {fontSize: 16}]}>Sold Out</Text>
              <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                <Text style={[styles.Text, {color: COLORS.grey}]}>
                  You have agreed to sell this product to the buyer
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              paddingTop: 20,
              width: window.width * 0.8,
              marginLeft: 20,
              marginBottom: 20,
            }}
            onPress={() => {
              setopenModal(false);
              onDismiss();
              onOpenStatus('Cancel');
            }}>
            <View
              style={{
                borderRadius: 15,
                width: 20,
                height: 20,
                backgroundColor: status == 'Cancel' ? COLORS.red : '#d0d0d0',
              }}
            />
            <View style={{flexDirection: 'column', marginLeft: 10}}>
              <Text style={[styles.Text, {fontSize: 16}]}>
                Cancel Transaction
              </Text>
              <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
                <Text style={[styles.Text, {color: COLORS.grey}]}>
                  You cancel this product transaction with the buyer
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {status != 'Sold' && status != 'Cancel' && (
            <Button
              caption={'Send'}
              onPress={() => {}}
              style={{
                width: window.width * 0.8,
                height: 50,
                marginVertical: 15,
                backgroundColor: '#d0d0d0',
              }}
              disabled={true}
            />
          )}
          {status == 'Sold' && (
            <Button
              caption={'Sold'}
              style={{
                width: window.width * 0.8,
                height: 50,
                marginVertical: 15,
              }}
              onPress={() => {
                dispatch(SoldOrder(loginUser.access_token, data.id)).then(
                  () => {
                    setopenModal(false);
                  },
                );
              }}
            />
          )}
          {status == 'Cancel' && (
            <Button
              caption={'Cancel Transaction'}
              style={{
                width: window.width * 0.8,
                height: 50,
                marginVertical: 15,
                backgroundColor: COLORS.red,
              }}
              onPress={() => {
                dispatch(declineOrder(loginUser.access_token, data.id)).then(
                  () => {
                    setopenModal(false);
                  },
                );
              }}
            />
          )}
        </View>
      </View>,
    );
  };

  const onDismiss = () => {
    setopenModal(false);
  };

  useEffect(() => {
    dispatch(getWishlistSpesific(loginUser.access_token, dataRoute.id));
  }, [data]);

  const onRefresh = useCallback(() => {
    dispatch(getWishlistSpesific(loginUser.access_token, dataRoute.id)).then(
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
          <Header title={'Bidder Info'} navigation={navigation} />
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
                marginLeft: 35,
                width: window.width * 0.8,
                alignSelf: 'flex-start',
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image style={styles.imageUser} />
                <View style={{flexDirection: 'column'}}>
                  <Text style={styles.Text}>{data.User.full_name}</Text>
                  <Text style={styles.Text}>{data.User.city}</Text>
                </View>
              </View>
            </View>
            <View style={{margin: 25, flexDirection: 'column'}}>
              <Text style={[styles.Text, {fontSize: 20}]}>
                List of products bid
              </Text>
              <View key={data} style={{flexDirection: 'row', marginTop: 24}}>
                <View>
                  <Image
                    style={styles.image}
                    source={{uri: data.Product.image_url}}
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
                    {data.status == 'declined' && (
                      <Text style={[styles.textGrey, {color: COLORS.red}]}>
                        Declined Product
                      </Text>
                    )}
                    {data.status == 'accepted' && (
                      <Text style={[styles.textGrey, {color: COLORS.green}]}>
                        Sold out
                      </Text>
                    )}
                    {data.status == '' && (
                      <Text style={styles.textGrey}>Product Offer</Text>
                    )}
                    {data.status == 'pending' && (
                      <Text style={styles.textGrey}>Product Offer</Text>
                    )}
                    <Text style={[styles.textGrey, {}]}>{`${timeDate(
                      data.Product.updatedAt,
                    )}`}</Text>
                  </View>
                  <Text style={[styles.textBlack]}>{data.Product.name}</Text>
                  <Text style={styles.textBlack}>{`Rp. ${rupiah(
                    data.Product.base_price,
                  )}`}</Text>
                  <Text style={styles.textBlack}>
                    Offered {`Rp. ${rupiah(data.price)}`}
                  </Text>
                </View>
              </View>
              {data.status == 'pending' && (
                <View style={{flexDirection: 'row'}}>
                  <Button
                    caption={'Decline'}
                    onPress={() => {
                      dispatch(declineOrder(loginUser.access_token, data.id));
                    }}
                    style={{
                      width: window.width * 0.4,
                      height: 50,
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.red,
                      borderWidth: 1,
                    }}
                    styleText={{color: COLORS.black, fontFamily: FONTS.Regular}}
                  />
                  <Button
                    caption={'Accept'}
                    style={{width: window.width * 0.4, height: 50}}
                    onPress={() => {
                      dispatch(
                        acceptOrder(loginUser.access_token, data.id),
                      ).then(() => {
                        onOpenAccepted();
                      });
                    }}
                  />
                </View>
              )}
              {data.status == '' && (
                <View style={{flexDirection: 'row'}}>
                  <Button
                    caption={'Status'}
                    onPress={() => {
                      onOpenStatus();
                    }}
                    style={{
                      width: window.width * 0.4,
                      height: 50,
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.green,
                      borderWidth: 1,
                    }}
                    styleText={{color: COLORS.black, fontFamily: FONTS.Regular}}
                  />
                  <Button
                    caption={'Contact'}
                    onPress={() => {
                      sendOnWhatsApp(url);
                    }}
                    style={{width: window.width * 0.4, height: 50}}
                  />
                </View>
              )}
              {data.status == 'declined' && (
                <View style={{flexDirection: 'row'}}></View>
              )}

              {openModal && (
                <BottomModal onDismiss={onDismiss}>{component}</BottomModal>
              )}
            </View>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default InfoPenawar;
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
