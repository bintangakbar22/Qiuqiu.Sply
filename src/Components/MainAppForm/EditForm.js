import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import * as yup from 'yup';
import Input from '../Others/Input';
import Button from '../Others/Button';
import {COLORS, FONTS} from '../../Utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-picker';
import {updateProduct} from '../../Redux/actions';
import {useNavigation} from '@react-navigation/native';
import {ms} from 'react-native-size-matters';
import DropDownPicker from 'react-native-dropdown-picker';
import { ImageProduct } from '../../../api/url';
import RNFetchBlob from 'rn-fetch-blob';
import { URLQ } from '../../../api/url';
const EditValidation = yup.object().shape({
  name: yup.string().required('Product Name is Required!'),
  location: yup.string().required('City is Required!'),
  base_price: yup
    .string()
    .required('Price is Required!')
    .matches(/^\d+$/, 'Numbers Only'),
  description: yup.string().required('Description is Required!'),
});

const EditForm = ({data}) => {
  console.log('data :', data.category);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const loginUser = useSelector(state => state.appData.loginUser);
  const userData = useSelector(state => state.appData.userData);
  const category = useSelector(state => state.appData.category);

  const array = [];
  array.push(Number(data.category_id));
  const arrayCondition = [];
  arrayCondition.push(data.id_condition);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(category);
  const [value, setValue] = useState(array);
  const [dataImage,setDataImage] = useState(null)
  const [openConditon, setOpenConditon] = useState(false);
  const [itemsConditon, setItemsConditon] = useState([
    {label: 'New', value: 1},
    {label: 'Second', value: 2},
  ]);

  const [valueConditon, setValueConditon] = useState(arrayCondition);
  const [ImageSource,setImageSource] = useState(null)

  

  const imagePicker = () => {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
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
        setImageSource(response.uri);
        setDataImage(response.data)
      }
    });
  };

  const uploadImageToServer = () => {

    RNFetchBlob.fetch('POST', URLQ+'seller/product.php?method=uploadPhoto', {
      Authorization: "Bearer access-token",
      otherHeader: "foo",
      'Content-Type': 'multipart/form-data',
    }, [
        { name: 'image', filename: 'image.png', type: 'image/png', data: dataImage },
        { name: 'id_product', data: data.id},
      ]).then((resp) => {
        var tempMSG = resp.data;
        console.log("Upload Berhasil")
        setDataImage(null)

      }).catch((err) => {
        console.log("Upload gagal")
        console.log(err)
      })

  }

  console.log("data image ",dataImage)
  const goUpdate = (values, resetForm) => {
    const condition = valueConditon.toString();
    const categoryy = value.toString();
    if(dataImage==null){
      dispatch(updateProduct(values, loginUser.id, data.id, categoryy,condition))
      .then(() => {navigation.navigate('DaftarJual');resetForm();setValue([]);});
    }else{
      uploadImageToServer()
      dispatch(updateProduct(values, loginUser.id, data.id, categoryy,condition))
      .then(() => {navigation.navigate('DaftarJual');resetForm();setValue([]);});
    }
    
  };

  return (
    <Formik
      initialValues={{
        name: data.name,
        description: data.description,
        base_price: data.base_price.toString(),
        location: userData?.city,
        image: ImageProduct+ data.image_url,
      }}
      validationSchema={EditValidation}
      onSubmit={(values, {resetForm}) => {
        goUpdate(values, resetForm);
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        setFieldValue,
        resetForm,
      }) => (
        <View style={{flexGrow:1}}>
          <Text style={styles.Text}>Product Name</Text>
          <Input
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            placeholder={'Product Name'}
            error={errors.name}
            screen={'jual'}
          />
          <Text style={styles.Text}>Price</Text>
          <Input
            onChangeText={handleChange('base_price')}
            onBlur={handleBlur('base_price')}
            value={values.base_price}
            placeholder={'Rp 0.00'}
            error={errors.base_price}
            screen={'jual'}
          />
          <Text style={styles.Text}>Condition</Text>
          <DropDownPicker
            open={openConditon}
            value={valueConditon}
            items={itemsConditon}
            setOpen={setOpenConditon}
            setValue={setValueConditon}
            setItems={setItemsConditon}
            multiple={true}
            min={0}
            max={1}
            mode="BADGE"
            badgeDotColors={['red', 'green', 'blue', 'yellow']}
            badgeTextStyle={{
              fontFamily: FONTS.Regular,
              color: COLORS.white,
              paddingLeft: ms(-5),
            }}
            badgeColors={COLORS.green}
            style={styles.Dropdown}
            textStyle={{
              fontSize: ms(12),
              color: COLORS.black,
              paddingLeft: ms(10),
            }}
            containerStyle={{
              width: window.width * 0.8,
              alignSelf: 'center',
            }}
            placeholder="Select Condition"
            listMode="SCROLLVIEW"
          />
          <Text style={styles.Text}>Location</Text>
          <Input
            onChangeText={handleChange('location')}
            onBlur={handleBlur('location')}
            value={values.location}
            placeholder={'Location'}
            error={errors.location}
            screen={'jual'}
          />
          <Text style={styles.Text}>Category</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            multiple={true}
            min={0}
            max={1}
            style={styles.Dropdown}
            textStyle={{
              fontSize: ms(12),
              color: COLORS.black,
              paddingLeft: ms(10),
            }}
            containerStyle={{
              width: window.width * 0.8,
              alignSelf: 'center',
            }}
            placeholder="Select Category"
            mode="BADGE"
            badgeDotColors={['red', 'green', 'blue', 'yellow']}
            badgeTextStyle={{
              fontFamily: FONTS.Regular,
              color: COLORS.white,
              paddingLeft: ms(-5),
            }}
            badgeColors={COLORS.green}
            listMode="SCROLLVIEW"
          />
          <Text style={styles.Text}>Description</Text>
          <Input
            onChangeText={handleChange('description')}
            onBlur={handleBlur('description')}
            value={values.description}
            placeholder={'Description'}
            error={errors.description}
            screen={'jual'}
          />
          <Text style={styles.Text}>Product Image</Text>
          <View style={{width: window.width * 0.8, alignSelf: 'center'}}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {ImageSource==null ? (
                <TouchableOpacity
                  style={styles.Category}
                  onPress={() => {
                    imagePicker();
                  }}>
                  <ImageBackground
                    style={styles.Image}
                    imageStyle={{borderRadius: ms(10)}}
                    source={{uri: ImageProduct+ data.image_url}}>
                    <Icon
                      style={styles.Icon}
                      name={'plus'}
                      size={50}
                      color={COLORS.grey}
                    />
                  </ImageBackground>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.Category}
                  onPress={() => {
                    imagePicker();
                  }}>
                  <ImageBackground
                    style={styles.Image}
                    imageStyle={{borderRadius: ms(10)}}
                    source={{uri:  ImageSource}}>
                    <Icon
                      style={styles.Icon}
                      name={'minus'}
                      size={50}
                      color={COLORS.grey}
                    />
                  </ImageBackground>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button caption={'Update'} onPress={handleSubmit} style={{backgroundColor:COLORS.primaryBlue}} />
          </View>
        </View>
      )}
    </Formik>
  );
};

export default EditForm;
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Text: {
    paddingLeft: ms(40),
    color: COLORS.black,
    fontFamily: FONTS.Regular,
    marginBottom: ms(5),
  },
  Dropdown: {
    width: window.width * 0.8,
    alignSelf: 'center',
    borderWidth: ms(1),
    borderRadius: ms(10),
    marginBottom: ms(20),
    borderColor: COLORS.grey,
  },
  Icon: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  Category: {
    width: ms(140),
    height: ms(100),
    borderWidth: ms(1),
    borderColor: COLORS.grey,
    borderRadius: ms(10),
    justifyContent: 'center',
  },
  Image: {
    width: ms(130),
    height: ms(90),
    justifyContent: 'center',
  },
});
