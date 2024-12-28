import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import BackButton from '../../components/BackButton';

export default function CheckoutScreen(){
    const navigation = useNavigation();
   
    return(
        <View style={{flex:1,justifyContent:'start',alignItems:'center',paddingTop:100,backgroundColor:'white'}}>
            <BackButton />
            <Text style={{fontSize:40,fontWeight:'600',marginBottom:40}}>Payment Gateway</Text>
            <Text style={{fontSize:16,fontWeight:'400',marginBottom:40}}>Please select the payment method</Text>
            <TouchableOpacity style={styles.paymethod} onPress={()=>navigation.navigate('Success')}>
                <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Pay with Card</Text>
                <Ionicons name="card" size={24} color="white" /> 
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymethod} onPress={()=>navigation.navigate('Success')}>
                <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Pay with UPI</Text>
                <Image source={require('../../../assets/images/gpay.png')} style={{width:24,height:24}} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymethod} onPress={()=>navigation.navigate('Success')}>
                <Text style={{fontSize:16,fontWeight:'600',color:'white'}}>Pay with Cash</Text>
                <FontAwesome5 name="money-check-alt" size={24} color="white" /> 
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    paymethod:{
         fontSize:20,
         fontWeight:'600',
         color:'white',
         backgroundColor:'#F8931F',
         padding:20,
         borderRadius:10,
         flexDirection:'row',
         justifyContent:'space-between',
         alignItems:'center',
         marginBottom:20,
         width:'80%',
    }
})


