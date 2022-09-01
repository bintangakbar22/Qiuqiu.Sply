import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  NativeModules,
} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ms} from 'react-native-size-matters';
import {connectionChecker} from '../../../Redux/actions';
import {RegisterForm, Header} from '../../../Components';
import {COLORS} from '../../../Utils';

const EditAccount = ({navigation}) => {
  const dispatch = useDispatch();

  const connection = useSelector(state => state.appData.connection);

  useEffect(() => {
    dispatch(connectionChecker());
  }, [connection]);

  return (
    <View style={styles.Container}>
      <StatusBar
        backgroundColor={'transparent'}
        translucent
        barStyle={'dark-content'}
      />
      <Header title={'Edit Account'} navigation={navigation} />
      <ScrollView contentContainerStyle={styles.Box}>
        <RegisterForm label={'Edit'} connection={connection} />
      </ScrollView>
    </View>
  );
};

export default EditAccount;

const {StatusBarManager} = NativeModules;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: StatusBarManager.HEIGHT + ms(20),
    paddingBottom: Platform.OS === 'ios' ? ms(25) : ms(15),
  },
  Box: {
    flexGrow: 1,
    paddingBottom: ms(25),
  },
});
