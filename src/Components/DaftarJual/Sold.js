import {View, Text, Dimensions, Image, StyleSheet} from 'react-native';
import React from 'react';
import {ms} from 'react-native-size-matters';
import {COLORS, FONTS} from '../../Utils';
import {rupiah, timeDate} from '../../Redux/actions';

const Sold = ({data}) => {
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
            <View
              key={item.id}
              style={{flexDirection: 'row', marginTop: ms(20)}}>
              <View>
                <Image
                  style={styles.image}
                  source={{uri: item?.Product?.image_url}}
                />
              </View>
              <View style={{flexDirection: 'column', marginLeft: ms(15)}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingRight: ms(30),
                    width: window.width * 0.8,
                  }}>
                  <Text style={[styles.textGrey, {color: COLORS.green}]}>
                    Product Sold
                  </Text>
                  <Text style={[styles.textGrey, {}]}>{`${timeDate(
                    item?.Product?.updatedAt,
                  )}`}</Text>
                </View>
                <Text style={[styles.textBlack, {marginTop: ms(2)}]}>
                  {item?.Product?.name}
                </Text>
                <Text style={styles.textBlack}>{`Rp. ${rupiah(
                  item?.Product?.base_price,
                )}`}</Text>
                <Text style={styles.textBlack}>
                  Sold {`Rp. ${rupiah(item?.price)}`}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default Sold;

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
});
