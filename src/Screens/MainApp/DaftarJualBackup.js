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
  getProductSeller,
  DaftarJualScreen,
  getWishlistSeller,
  getSoldSeller,
  connectionChecker,
} from '../../Redux/actions';
import {
  CategoryButton,
  DaftarJualShimmer,
  Header,
  Product,
  Wishlist,
  Sold,
  Blank,
} from '../../Components';
import {COLORS, FONTS} from '../../Utils';
import { ImageUser } from '../../../api/url';

const DaftarJual1 = ({navigation}) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const connection = useSelector(state => state.appData.connection);
  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);
  const daftarJualScreen = useSelector(state => state.appData.daftarJualScreen);

  const productDataSeller = useSelector(
    state => state.appData.productDataSeller,
  );
  console.log(daftarJualScreen)
  // const wishlistDataSeller = useSelector(
  //   state => state.appData.wishlistDataSeller,
  // );
  // const soldSeller = useSelector(state => state.appData.soldSeller);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      dispatch(connectionChecker());
      dispatch(DaftarJualScreen('Product'));
      getData();
    }
  }, []);

  const getData = () => {
    setLoading(true);
    dispatch(getProductSeller(userData.id)).then(() => {
      setLoading(false);
    });
    // dispatch(getWishlistSeller(loginUser.access_token));
    // dispatch(getSoldSeller(loginUser.access_token)).then(() => {
    //   setLoading(false);
    // });
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
      <Header title={'My Selling List'} />
      <View
        style={{
          backgroundColor: COLORS.white,
          width: window.width * 0.8,
          flexDirection: 'row',
          paddingVertical: ms(15),
          justifyContent: 'space-around',
          alignSelf: 'center',
          borderRadius: ms(10),
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: ms(0.25),
          shadowRadius: ms(12),
          elevation: ms(2),
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            style={{
              backgroundColor: COLORS.black,
              width: ms(40),
              height: ms(40),

              marginRight: ms(20),

              borderRadius: ms(8),
            }}
            source={{uri: ImageUser+ userData?.image_url}}
          />
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text style={styles.Name}>{userData?.full_name}</Text>
            <Text style={styles.Location}>{userData?.city}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{
            borderColor: COLORS.black,
            width: window.width * 0.2,
            justifyContent: 'center',
            alignItems: 'center',

            borderRadius: ms(8),
            borderWidth: ms(1),
          }}
          onPress={() => {
            navigation.navigate('EditAccount');
          }}>
          <Text style={styles.Text}>Edit</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: ms(20),
          marginBottom: ms(15),
          marginHorizontal: ms(15),
        }}>
        <CategoryButton
          name={'Product'}
          icon={'package-variant-closed'}
          onPress={() => dispatch(DaftarJualScreen('Product'))}
        />
        <CategoryButton
          name={'Interested'}
          icon={'heart-outline'}
          onPress={() => dispatch(DaftarJualScreen('Wishlist'))}
        />
        <CategoryButton
          name={'Sold'}
          icon={'currency-usd'}
          onPress={() => dispatch(DaftarJualScreen('Sold'))}
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
            {daftarJualScreen == 'Product' && (
              <Product data={productDataSeller} />
            )}
            {daftarJualScreen == 'Wishlist' &&
              (wishlistDataSeller.length ? (
                <Wishlist data={wishlistDataSeller} />
              ) : (
                <Blank caption={'No Interested!'} onRefresh={onRefresh} />
              ))}
            {daftarJualScreen == 'Sold' &&
              (soldSeller.length ? (
                <Sold data={soldSeller} />
              ) : (
                <Blank caption={'No Product Sold!'} onRefresh={onRefresh} />
              ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default DaftarJual1;

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
