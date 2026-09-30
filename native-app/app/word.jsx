import { View,Text,StyleSheet } from 'react-native';
export default function Word(){return <View style={s.p}><Text style={s.h}>말씀</Text><Text style={s.t}>주일설교와 말씀묵상이 이곳에 연결됩니다.</Text></View>}
const s=StyleSheet.create({p:{flex:1,padding:24,paddingTop:70,backgroundColor:'#f7f1e7'},h:{fontSize:30,fontWeight:'800',color:'#18382c'},t:{marginTop:15,fontSize:16,color:'#5f6f67'}});