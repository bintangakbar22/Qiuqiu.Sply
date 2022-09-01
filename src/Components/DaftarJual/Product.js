import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ms} from 'react-native-size-matters';
import {getSpesificProduct} from '../../Redux/actions';
import {COLORS, FONTS} from '../../Utils';
import ProductCard from '../Others/ProductCard';

const Product = ({data}) => {
  const window = Dimensions.get('window');

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loginUser = useSelector(state => state.appData.loginUser);
  
  return (
    <View
      style={{
        width: window.width * 0.95,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
      {data?.length < 20 && (
        <TouchableOpacity
          style={{
            width: window.width * 0.4,
            height: ms(225),
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            marginHorizontal: ms(10),
            marginVertical: ms(10),
            borderRadius: ms(10),
            borderWidth: ms(1),
            borderColor: COLORS.grey,
          }}
          onPress={() => navigation.navigate('Jual')}>
          <Icon name="plus" size={ms(40)} style={{color: COLORS.grey}} />
          <Text
            style={{
              fontSize: ms(12),
              fontFamily: FONTS.SemiBold,
              color: COLORS.grey,
            }}>
            Add Product
          </Text>
        </TouchableOpacity>
      )}
      {data!=[] &&
        data.map(item => (
          <ProductCard
            key={item.id}
            data={item}
            onPress={() =>
              dispatch(
                getSpesificProduct(loginUser?.id, item?.id)
              ).then(
                navigation.navigate('Detail', {
                  user: 'seller',
                }),
              )
            }
          />
        ))}
    </View>
  );
};

export default Product;
