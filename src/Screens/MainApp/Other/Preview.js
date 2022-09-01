import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useEffect} from 'react';
import {noImage} from '../../../Assets';
import {COLORS, FONTS} from '../../../Utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {getCategory, rupiah} from '../../../Redux/actions';
import {useDispatch, useSelector} from 'react-redux';
import Button from '../../../Components/Others/Button';
import {postProduct, updateProduct} from '../../../Redux/actions';

const Preview = ({route}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    data,
    categoryProduct,
    resetForm,
    arrayProduct,
    screen,
    id,
    dataCategory,
  } = route.params;

  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);
  const category = useSelector(state => state.appData.category);

  const goSell = () => {
    dispatch(postProduct(data, loginUser.access_token, categoryProduct)).then(
      () => {
        navigation.navigate('DaftarJual');
      },
    );
    resetForm();
  };

  const goUpdate = () => {
    dispatch(
      updateProduct(data, loginUser.access_token, categoryProduct, id),
    ).then(() => {
      navigation.navigate('DaftarJual');
    });
    resetForm();
  };

  useEffect(() => {
    dispatch(getCategory());
  }, []);

  return (
    <>
      {data != null && (
        <View style={styles.container}>
          <StatusBar
            backgroundColor={'transparent'}
            translucent
            barStyle={'light-content'}
          />
          <ScrollView contentContainerStyle={styles.Box}>
            <ImageBackground
              style={styles.gambar}
              source={data.image != '' ? {uri: data.image} : noImage}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.pop();
                  }}>
                  <Icon
                    style={styles.back}
                    name={'arrow-left'}
                    size={35}
                    color={COLORS.dark}
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.container1, {borderWidth: 0.5}]}>
                <View style={{margin: 20, flexDirection: 'column'}}>
                  {data.name != '' ? (
                    <Text
                      style={{
                        fontFamily: FONTS.Regular,
                        fontSize: 20,
                        color: COLORS.black,
                      }}>
                      {data.name}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: FONTS.Regular,
                        fontSize: 20,
                        color: COLORS.black,
                      }}>
                      Product Name
                    </Text>
                  )}
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {categoryProduct == null ? (
                      <Text
                        style={{
                          fontFamily: FONTS.Regular,
                          color: COLORS.grey,
                          fontSize: 12,
                        }}>
                        Category Product{' '}
                      </Text>
                    ) : (
                      <>
                        {screen == 'edit' &&
                          dataCategory &&
                          dataCategory.map(itemB => {
                            return (
                              <Text
                                style={{
                                  fontFamily: FONTS.Regular,
                                  color: COLORS.grey,
                                  fontSize: 12,
                                }}>
                                {itemB.name},{' '}
                              </Text>
                            );
                          })}

                        {screen == 'jual' &&
                          arrayProduct &&
                          arrayProduct.map(itemA => {
                            return (
                              <>
                                {category &&
                                  category.map(itemB => {
                                    return (
                                      <>
                                        {itemA == itemB.id && (
                                          <Text
                                            style={{
                                              fontFamily: FONTS.Regular,
                                              color: COLORS.grey,
                                              fontSize: 12,
                                            }}>
                                            {itemB.name},{' '}
                                          </Text>
                                        )}
                                      </>
                                    );
                                  })}
                              </>
                            );
                          })}
                      </>
                    )}
                  </View>
                  {data.base_price != '' ? (
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: FONTS.Regular,
                        color: COLORS.black,
                      }}>
                      {`Rp. ${rupiah(data.base_price)}`}{' '}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 20,
                        fontFamily: FONTS.Regular,
                        color: COLORS.black,
                      }}>
                      Rp. 0
                    </Text>
                  )}
                </View>
              </View>
            </ImageBackground>
            <View style={styles.container2}>
              <View style={styles.card}>
                <Image
                  style={styles.image}
                  source={{uri: userData.image_url}}
                />
                <View style={{flexDirection: 'column'}}>
                  <Text style={[styles.Text, {fontSize: 18}]}>
                    {userData.full_name}
                  </Text>
                  <Text
                    style={[
                      styles.Text,
                      {fontFamily: FONTS.Regular, fontSize: 14},
                    ]}>
                    {userData.city}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.container3}>
              <Text
                style={{
                  fontFamily: FONTS.Regular,
                  fontSize: 20,
                  color: COLORS.black,
                }}>
                Description
              </Text>
              <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {data.description != '' ? (
                  <Text
                    style={{
                      fontFamily: FONTS.Regular,
                      fontSize: 16,
                      color: COLORS.black,
                    }}>
                    {data.description}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontFamily: FONTS.Regular,
                      fontSize: 16,
                      color: COLORS.grey,
                    }}>
                    Your Product Description
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                marginBottom: 20,
                flexDirection: 'column',
                position: 'absolute',
                bottom: 1,
                alignSelf: 'center',
              }}>
              {data.image &&
              data.base_price &&
              data.name &&
              data.description &&
              categoryProduct != null ? (
                <>
                  {screen == 'edit' && (
                    <Button
                      caption={'Update'}
                      style={{width: window.width * 0.8}}
                      onPress={() => {
                        goUpdate();
                      }}
                    />
                  )}
                  {screen == 'jual' && (
                    <Button
                      caption={'Posting'}
                      style={{width: window.width * 0.8}}
                      onPress={() => {
                        goSell();
                      }}
                    />
                  )}
                </>
              ) : (
                <>
                  {screen == 'edit' && (
                    <Button
                      caption={'Update'}
                      style={{
                        width: window.width * 0.8,
                        backgroundColor: COLORS.disabled,
                      }}
                      onPress={() => {
                        goUpdate();
                      }}
                      disabled={true}
                    />
                  )}
                  {screen == 'jual' && (
                    <Button
                      caption={'Posting'}
                      style={{
                        width: window.width * 0.8,
                        backgroundColor: COLORS.disabled,
                      }}
                      onPress={() => {
                        goSell();
                      }}
                      disabled={true}
                    />
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Preview;
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  gambar: {
    width: window.width * 1,
    height: 250,
  },
  back: {
    marginTop: 30,
    paddingHorizontal: window.width * 0.05,
  },
  container1: {
    position: 'absolute',
    width: 330,
    backgroundColor: 'white',
    bottom: -80,
    alignSelf: 'center',
    borderRadius: 10,
    borderColor: 'red',
    elevation: 6,
  },
  container2: {
    flexDirection: 'row',
    borderRadius: 10,
    width: window.width * 1.0,
    height: 70,
    backgroundColor: 'white',
    marginTop: 90,
    justifyContent: 'center',
  },
  container3: {
    flexDirection: 'column',
    borderRadius: 10,
    marginTop: 25,
    width: 330,
    height: 150,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginLeft: 25,
  },
  Text: {
    fontSize: 12,
    fontFamily: FONTS.SemiBold,
    color: COLORS.black,
  },
  card: {
    marginVertical: 15,
    flexDirection: 'row',
    width: window.width * 0.8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 20,
    backgroundColor: 'black',
  },
  Box: {
    flexGrow: 1,
    paddingBottom: 25,
    height: window.height * 1,
  },
});
