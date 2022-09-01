import {
  View,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Platform,
  NativeModules,
  StatusBar,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Carousel from 'react-native-reanimated-carousel';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';
import {
  getBanner,
  getProduct,
  clearProduct,
  addWishlist,
  connectionChecker,
  getSpesificProductBuyer,
  getStatusOrderProduct,
  getWishlist,
  getStatusOrder,
} from '../../Redux/actions';
import {
  CategoryButton,
  HomeShimmer,
  Input,
  ProductCard,
} from '../../Components';
import {COLORS} from '../../Utils';
import {GET_STATUS_ORDER_PRODUCT} from '../../Redux/types';
import {useIsFocused} from '@react-navigation/native';
import { ImageBanner } from '../../../api/url';

const Home = ({navigation}) => {
  const CATEGORY = [
    {
      name: 'All Product',
      icon: 'feature-search',
      onclick: () => {
        onCategory('')
      },
    },
    {
      name: 'Adidas',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(1)
      },
    },
    {
      name: 'Air Jordan',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(2)
      },
    },
    {
      name: 'Converse',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(3)
      },
    },
    {
      name: 'New Balance',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(4)
      },
    },
    {
      name: 'Nike',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(5)
      },
    },
    {
      name: 'Vans',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(6)
      },
    },
    {
      name: 'Other',
      icon: 'shoe-sneaker',
      onclick: () => {
        onCategory(7)
      },
    },
  ];
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [currentCategory, setCurrentCategory] = useState('');
  const [isSearch, setIsSearch] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);

  // const statusOrder = useSelector(state => state.appData.statusOrder);

  const loginUser = useSelector(state => state.appData.loginUser);

  let banner = useSelector(state => state.appData.banner);
  const product = useSelector(state => state.appData.product);
  const connection = useSelector(state => state.appData.connection);
  let wishlist = useSelector(state => state.appData.wishlist);
  banner = banner?.map(({image_url}) => image_url);


  const onCategory = (category) =>{
    setCurrentCategory('');
    setIsSearch('');
    setDefault();
    loginUser && dispatch(getWishlist(loginUser.id));
    dispatch(getProduct(category, '')).then(() => {
      setLoading(false);
    });
  }
  const onSearch = () => {
    setDefault();
    dispatch(getProduct(currentCategory, isSearch)).then(() => {
      setLoading(false);
    });
  };

  const setDefault = () => {
    setLoading(true);
    dispatch(clearProduct());
    dispatch(getBanner());
  };

  const getData = () => {
    setIsSearch('');
    setDefault();
    dispatch(getProduct(currentCategory, '')).then(() => {
      setLoading(false);
    });
    if(loginUser){
      dispatch(getWishlist(loginUser.id));
    }
    // loginUser &&
    //   dispatch(getStatusOrder(loginUser.access_token)).then(() => {
    //     setLoading(false);
    //   });
  };

  const onRefresh = useCallback(() => {
    getData();
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(connectionChecker()).then(() => {
        dispatch(getBanner()).then(()=>{ getData();setLoading(false);})
      });
    }
  }, [connection]);

  const headerComponent = (
    <View style={styles.Layer}>
      <View style={styles.Headers}>
      {loginUser&&(
          <TouchableOpacity
            style={styles.Wishlist}
            onPress={() =>
              navigation.navigate('Wishlist')
            }>
            <Icon name={'heart'} size={ms(30)} color={COLORS.white} />
          </TouchableOpacity>
        )}
        <Input
          placeholder="Search"
          onChangeText={val => setIsSearch(val)}
          onPress={() => onSearch()}
        />
        {loginUser&&(
          <TouchableOpacity
            style={styles.Wishlist}
            onPress={() =>
              navigation.navigate('Cart')
            }>
            <Icon name={'cart-outline'} size={ms(30)} color={COLORS.white} />
          </TouchableOpacity>
        )}
      </View>
      <Carousel
        loop
        autoPlay={true}
        autoPlayInterval={5000}
        width={window.width * 0.9}
        height={ms(120)}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
        data={banner}
        renderItem={({item}) => (
          <Image style={styles.Banner} source={{uri:ImageBanner+ item}} />
        )}
      />
      <View style={styles.CategoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORY}
          renderItem={({item}) => (
            <CategoryButton
              name={item.name}
              icon={item.icon}
              onPress={item.onclick}
            />
          )}
          keyExtractor={item => item.name}
        />
      </View>
    </View>
  );

  const renderItem = ({item}) => (
    <ProductCard
      onPress={() => {
        if (loginUser) {
          // dispatch({
          //   type: GET_STATUS_ORDER_PRODUCT,
          //   statusOrderProduct: null,
          // });
          dispatch(
            getSpesificProductBuyer(item.id),
          ).then(() => {
            // if (statusOrder != null) {
            //   var order = statusOrder.filter(itemS => {
            //     return itemS.product_id == item.id;
            //   });
            //   var orderArray = order.map(o => {
            //     return o.id;
            //   });
            //   const orderId = orderArray.toString();
            //   if (orderId == '') {
            //     navigation.navigate('Detail', {
            //       user: 'buyer',
            //       order_id: null,
            //     });
              // } else {
              //   dispatch(
              //     getStatusOrderProduct(loginUser.access_token, orderId),
              //   ).then(
                  navigation.navigate('Detail', {
                    user: 'buyer',
                    order_id: 1,
                  })
                // );
              // }
            // }
          });
        } else {
          navigation.navigate('Auth');
        }
      }}
      data={item}
      onPressWishlist={() =>
        dispatch(addWishlist(item.id, loginUser?.id)).then(() =>
          dispatch(getWishlist(loginUser?.id)),
        )
      }
      wishlist={wishlist}
    />
  );

  return (
    <View style={styles.Container}>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent
      />
      {loading || !connection ? (
        <HomeShimmer />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          numColumns={2}
          data={product}
          renderItem={renderItem}
          refreshing={true}
          onRefresh={() => onRefresh()}
          ListHeaderComponent={headerComponent}
          contentContainerStyle={styles.FlatlistContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => getData()}
              tintColor={COLORS.softDark}
              colors={['green']}
            />
          }
        />
      )}
    </View>
  );
};

export default Home;

const {StatusBarManager} = NativeModules;
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: Platform.OS === 'ios' ? ms(75) : ms(60),
  },
  FlatlistContainer: {
    alignItems: 'center',
  },
  Layer: {
    width: window.width * 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    borderBottomRightRadius: ms(10),
    borderBottomLeftRadius: ms(10),
    paddingTop: StatusBarManager.HEIGHT + ms(10),
    paddingBottom: ms(18),
  },
  Headers: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Wishlist: {
    marginBottom: ms(20),
    marginHorizontal: ms(10),
  },
  Banner: {
    backgroundColor: COLORS.lightGrey,
    height: ms(120),
    borderRadius: ms(10),
  },
  CategoryContainer: {
    width: window.width * 0.9,
    flexDirection: 'row',
    marginTop: ms(10),
  },
});
