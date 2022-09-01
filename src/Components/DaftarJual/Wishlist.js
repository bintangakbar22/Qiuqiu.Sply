import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ms} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../Utils';
import {useNavigation} from '@react-navigation/native';
import {getWishlistSpesific, rupiah, timeDate} from '../../Redux/actions';
import moment from 'moment';
import { ImageProduct } from '../../../api/url';
const Wishlist = ({data}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const loginUser = useSelector(state => state.appData.loginUser);

 return (
    <View
      style={{
        width: window.width * 0.9,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {data &&
        data.map(item => {
          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    getWishlistSpesific(loginUser?.id, item?.id),
                  ).then(
                    navigation.navigate('InfoPenawar', {
                      dataRoute: item,
                    }),
                  );
                }}
                key={item.id}
                style={styles.card}>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingHorizontal: ms(5),
                      width: window.width * 0.85,
                    }}>
                    <Text style={[styles.textGrey, {}]}>{`${moment(
                      item?.updatedAt,
                    ).format('D MMMM YYYY hh:mm')}`}</Text>
                    <Text style={[styles.textGrey,{color:'orange',fontFamily:FONTS.Bold}]}>Order Pending</Text>
                  </View>
                    <View style={{width:window.width*0.85,borderColor:COLORS.grey,borderWidth:0.3}}/>
                  <View style={{flexDirection:'row',width:window.width*0.82}}>            
                    <Image
                        style={styles.image}
                        source={{uri:ImageProduct+ item?.Product?.image_url}}
                    />
                    <View style={{flexDirection:'row',width:window.width*0.68,flexWrap:'wrap',alignItems:'center'}}>  
                    <Text style={[styles.textBlack, {marginTop: ms(12),fontSize:ms(13),paddingLeft:ms(1)}]}>
                        {item?.Product?.name}
                    </Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    {item.quantity>0 ?
                    <Text style={[styles.textGrey]}>+{item.quantity} others products</Text>
                    :
                    <Text style={[styles.textGrey]}></Text>
                    }
                    <View style={{flexDirection: 'column'}}>
                        <Text style={[styles.textGrey]}>Final Price</Text>
                        <Text style={styles.textBlack}>{`Rp. ${rupiah(
                            item?.final_price,
                        )}`}</Text>
                    </View>
                </View>
              </TouchableOpacity>
            </>
          );
        })}
    </View>
  );
};

export default Wishlist;

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  image: {
    width: ms(50),
    height: ms(50),
    backgroundColor: COLORS.lightGrey,
    borderRadius: ms(10),
  },
  textBlack: {
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    fontSize: ms(14),
    paddingBottom: ms(2),
  },
  textGrey: {
    color: COLORS.grey,
    fontFamily: FONTS.Regular,
    fontSize: ms(12),
  },
  card:{
    marginBottom:20,
    padding: ms(10),
    borderRadius: ms(10),
    elevation: ms(2),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: ms(0.25),
    shadowRadius: ms(2),

  },
});