import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';

export default function Home() {
  return (
    <ScrollView style={s.page} contentContainerStyle={s.content}>
      <Text style={s.eyebrow}>MOHYEON SOMANG CHURCH</Text>
      <Text style={s.title}>모현소망교회</Text>
      <View style={s.hero}>
        <Text style={s.badge}>이번 주 예배</Text>
        <Text style={s.heroTitle}>말씀 안에서 함께 자라고{"\n"}사랑으로 세상을 섬기는 교회</Text>
        <Text style={s.body}>하나님을 예배하고 복음 안에서 서로를 세우는 공동체입니다.</Text>
      </View>
      <Text style={s.section}>바로가기</Text>
      <View style={s.grid}>
        {['예배안내','주일설교','교회소식','주일학교'].map(x => <Pressable key={x} style={s.card}><Text style={s.cardText}>{x}</Text></Pressable>)}
      </View>
      <Text style={s.section}>이번 주 말씀</Text>
      <View style={s.white}><Text style={s.small}>최근 설교</Text><Text style={s.cardTitle}>말씀을 불러오는 중입니다</Text></View>
      <Text style={s.section}>교회 소식</Text>
      <View style={s.white}><Text style={s.small}>새 소식</Text><Text style={s.cardTitle}>모현소망교회 소식을 확인하세요</Text></View>
    </ScrollView>
  );
}
const s=StyleSheet.create({
  page:{flex:1,backgroundColor:'#f7f1e7'},content:{padding:22,paddingTop:60,paddingBottom:40},
  eyebrow:{fontSize:11,letterSpacing:1.4,color:'#5f756a',fontWeight:'700'},title:{fontSize:28,fontWeight:'800',color:'#18382c',marginTop:5,marginBottom:22},
  hero:{backgroundColor:'#18382c',borderRadius:28,padding:24},badge:{alignSelf:'flex-start',backgroundColor:'#fff',paddingHorizontal:12,paddingVertical:7,borderRadius:20,color:'#18382c',fontWeight:'700'},
  heroTitle:{fontSize:25,lineHeight:35,fontWeight:'800',color:'#fff',marginTop:22},body:{fontSize:15,lineHeight:23,color:'#dce7e1',marginTop:12},
  section:{fontSize:20,fontWeight:'800',color:'#18382c',marginTop:30,marginBottom:14},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},
  card:{width:'48%',backgroundColor:'#fff',borderRadius:20,padding:20,minHeight:90,justifyContent:'flex-end'},cardText:{fontSize:17,fontWeight:'700',color:'#18382c'},
  white:{backgroundColor:'#fff',borderRadius:22,padding:20},small:{fontSize:12,color:'#718078',fontWeight:'700'},cardTitle:{fontSize:18,fontWeight:'800',color:'#18382c',marginTop:8}
});