import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {ms} from 'react-native-size-matters';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-picker';
import {postProduct} from '../../Redux/actions';
import Input from '../Others/Input';
import Button from '../Others/Button';
import {COLORS, FONTS} from '../../Utils';

const JualForm = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const jualValidation = yup.object().shape({
    name: yup.string().required('Product Name is Required!'),
    location: yup.string().required('City is Required!'),
    base_price: yup
      .string()
      .required('Price is Required!')
      .matches(/^\d+$/, 'Numbers Only'),
    description: yup.string().required('Description is Required!'),
    image: yup.mixed().required('Image is Required!'),
  });

  const userData = useSelector(state => state.appData.userData);
  const category = useSelector(state => state.appData.category);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [items, setItems] = useState(category);
  const [openConditon, setOpenConditon] = useState(false);
  const [valueConditon, setValueConditon] = useState([]);
  const [itemsConditon, setItemsConditon] = useState([
    {label: 'New', value: "New"},
    {label: 'Second', value: "Second"},
  ]);
  const [dataImage,setDataImage] = useState(null)
  const imagePicker = async handleChange => {
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
        handleChange(response.uri);
        setDataImage(response.data)
      }
    });
  };

  const goSell = (values, resetForm) => {
    const categoryProduct = value.toString();
    dispatch(postProduct(values, userData.id, categoryProduct,valueConditon,dataImage))
    .then(
      () => {
        navigation.navigate('DaftarJual');
        resetForm();
        setValue([]);
      },
    );
  };

  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        base_price: '',
        location: userData?.city,
        image: '',
        stock:0
      }}
      validationSchema={jualValidation}
      onSubmit={(values, {resetForm}) => {
        goSell(values, resetForm);
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
        <ScrollView>
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
            placeholder={'Product Price'}
            error={errors.base_price}
            screen={'jual'}
          />
          <Text style={styles.Text}>Stock</Text>
          <Input
            onChangeText={handleChange('stock')}
            onBlur={handleBlur('stock')}
            value={values.stock}
            placeholder={'Product Stock'}
            error={errors.stock}
            screen={'jual'}
            numeric
          />
          <Text style={styles.Text}>Condition</Text>
          <DropDownPicker
            open={openConditon}
            value={valueConditon}
            items={itemsConditon}
            setOpen={setOpenConditon}
            setValue={setValueConditon}
            setItems={setItemsConditon}
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
            <View>
              {values.image == '' ? (
                <>
                  <TouchableOpacity
                    style={styles.Category}
                    onPress={() => {
                      imagePicker(handleChange('image'));
                    }}>
                    <Icon
                      style={styles.Icon}
                      name={'plus'}
                      size={ms(40)}
                      color={COLORS.grey}
                    />
                  </TouchableOpacity>
                  <Text style={styles.Error}>{errors.image}</Text>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.Category}
                    onPress={() => {
                      setFieldValue('image', '');
                    }}>
                    <ImageBackground
                      style={styles.Image}
                      imageStyle={{borderRadius: ms(10)}}
                      source={{uri: values.image}}>
                      <Icon
                        style={styles.Icon}
                        name={'minus'}
                        size={ms(40)}
                        color={COLORS.grey}
                      />
                    </ImageBackground>
                  </TouchableOpacity>
                  <Text style={styles.Error}>{errors.image}</Text>
                </>
              )}
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Button caption={'Posting'} onPress={handleSubmit} style={{backgroundColor:COLORS.primaryBlue}}/>
          </View>
        </ScrollView>
      )}
    </Formik>
  );
};

export default JualForm;

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  Text: {
    marginLeft: ms(40),
    marginBottom: ms(5),

    color: COLORS.black,
    fontFamily: FONTS.Regular,
  },
  Dropdown: {
    width: window.width * 0.8,
    alignSelf: 'center',
    marginBottom: ms(20),

    borderWidth: ms(1),
    borderRadius: ms(10),
    borderColor: COLORS.grey,
  },
  Icon: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  Category: {
    width: ms(140),
    height: ms(100),
    justifyContent: 'center',
    borderWidth: ms(1),
    borderColor: COLORS.grey,
    borderRadius: ms(10),
  },
  Image: {
    width: ms(130),
    height: ms(90),
    justifyContent: 'center',
  },
  Error: {
    fontFamily: FONTS.Regular,
    fontSize: ms(10),
    color: COLORS.red,
    textAlign: 'justify',

    width: window.width * 0.8,
    marginVertical: ms(5),
  },
});
