import {
  View,
  StatusBar,
  NativeModules,
  Platform,
  Dimensions,
  StyleSheet,
  Text,
  FlatList,
  ScrollView
} from 'react-native';
import React from 'react';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  rupiah,
  buyProduct
} from '../../Redux/actions';
import {COLORS} from '../../Utils';
import {ms} from 'react-native-size-matters';
import {Button, CartCard, Header} from '../../Components';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import { FONTS } from '../../Utils';
import DropDownPicker from 'react-native-dropdown-picker';
const Checkout = ({route}) => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const loginUser = useSelector(state => state.appData.loginUser);
  const {idProduct,finalPrice} = route.params;
  const cart = useSelector(state => state.appData.cart);
  const qty = cart.map(i=>i.qty)
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState([
    {label: 'JNE      Rp.9.000', value: 9000},
    {label: 'SICEPAT  Rp.10.000', value: 10000},
    {label: 'ANTERAJA  Rp.11.000', value: 11000}
  ]); 
  
  const priceFinal = finalPrice<=1000000?finalPrice+value:finalPrice
  console.log(value)

  const goBuy = () =>{
    const courier = value.toString();
    dispatch(buyProduct(loginUser.id,idProduct,qty,priceFinal,courier)).then(()=>{navigation.navigate("MainApp")})
    navigation.navigate("Checkout",{idBuyer:loginUser.id,idProduct:idProduct})
  }
  const renderItem = ({item}) => (
    <CartCard
      data={item}
      label={'checkout'}
    />
  );

  return (
    <View style={styles.Container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        translucent
      />
      <Header navigation={navigation} title={'Checkout'} />
      <ScrollView>
      <View style={{flexDirection:'column',marginHorizontal:20}} > 
            <Text style={[styles.Text,{fontSize:15}]} >Shipping Address</Text>
            <View style={{width:window.width*0.90,borderColor:COLORS.grey,borderWidth:0.5,marginVertical:8}}/>
            <Text style={[styles.TextPrice]}>{loginUser.full_name}</Text>
            <Text style={[styles.TextPrice]}>{loginUser.phone_number}</Text>
            <Text style={[styles.TextPrice]}>{loginUser.address}</Text>
            <View style={{width:window.width*0.90,borderColor:COLORS.grey,borderWidth:0.5,marginVertical:8}}/>
            <Text style={[styles.Text,{fontSize:18}]}>List Products</Text>
            <FlatList
                  showsVerticalScrollIndicator={false}
                  keyExtractor={item => item.id}
                  numColumns={1}
                  data={cart}
                  renderItem={renderItem}
                  contentContainerStyle={styles.FlatlistContainer}
                />
            <View style={{width:window.width*0.90,borderColor:COLORS.grey,borderWidth:0.5,marginVertical:10,flexDirection:'column'}}/>
            <View style={{marginBottom:ms(80)}} >

            <Text style={[styles.Text,{fontSize:15}]} >Choose Courier</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              style={styles.Dropdown}
              textStyle={{
                fontSize: ms(12),
                color: COLORS.black,
                paddingLeft: ms(10),
              }}
              containerStyle={{
                width: window.width * 0.9,
                alignSelf: 'center',
              }}
              placeholder="Select Courier"
              listMode="SCROLLVIEW"
              multiple={false}
            />
            {finalPrice<1000000 ?
            <>
            <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:15}} >
              <Text style={[styles.Text]}>Shipping Price</Text>
              <Text style={[styles.Text]}>{`Rp. ${rupiah(value)}`}</Text>
            </View>
            </>
            :
            <>
            <View style={{justifyContent:'space-between',flexDirection:'row',marginTop:15}} >
              <Text style={[styles.Text]}>Shipping Price</Text>
              <Text style={[styles.Text]}>Free</Text>
            </View>
            </>
            }            
            </View>
      </View>
        </ScrollView>
        <View style={styles.Bottom}>
            <View style={{flexDirection:'column'}}>
                <Text style={[styles.Text,{fontSize:ms(16)}]}>Total Price</Text>
                <Text style={[styles.TextPrice]}>Rp. {rupiah(priceFinal)}</Text>
            </View>
            {(finalPrice<1000000&&value.length==0)||value.length==0?
                <Button style={{width:window.width*0.35,marginTop:0,height:50,backgroundColor:COLORS.grey}} caption={'Order'} disabled />
                :
                <Button style={{width:window.width*0.35,marginTop:0,height:50,backgroundColor:COLORS.green}} caption={'Order'} onPress={goBuy}/>
            }
        </View>
    </View>
  );
};

export default Checkout;

const {StatusBarManager} = NativeModules;
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + ms(20),
    paddingBottom: Platform.OS === 'ios' ? ms(25) : ms(15),
  },
  FlatlistContainer: {
    alignItems: 'center',
  },
  Text: {
    fontFamily: FONTS.Bold,
    color: COLORS.black,
  },
  TextPrice: {
    fontFamily: FONTS.SemiBold,
    color: COLORS.grey,
    fontSize:ms(14)
  },
  Bottom:{
    width:window.width*1.0,
    position:'absolute',
    bottom:0,
    flexDirection:'row',
    alignSelf:'center',
    backgroundColor:COLORS.white,
    padding:ms(14),
    paddingTop:ms(8),
    elevation: ms(10),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: ms(0.5),
    shadowRadius: ms(4),
    justifyContent:'space-between'
}
});
