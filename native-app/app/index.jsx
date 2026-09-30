import { useEffect,useState } from 'react';
import { ScrollView,StyleSheet,Text,View,Pressable,ActivityIndicator,ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const BASE='https://mohyeonsomang.org';
async function json(path){const r=await fetch(BASE+path+'?v='+Date.now());if(!r.ok)throw new Error(path);return r.json()}
const quick=[['time-outline','예배안내','church'],['book-outline','주일설교','word'],['newspaper-outline','교회소식','news'],['happy-outline','주일학교','news']];

export default function Home(){
 const [data,setData]=useState(null);
 useEffect(()=>{(async()=>{try{const [site,sermons,news]=await Promise.all([json('/content/site.json'),json('/content/sermons.json'),json('/content/news.json')]);setData({site,sermon:[...(sermons||[])].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0],news:[...(news||[])].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))[0]})}catch{setData({error:true})}})()},[]);
 const site=data?.site||{}, sermon=data?.sermon, news=data?.news;
 return <ScrollView style={s.page} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
   <View style={s.header}><View><Text style={s.eyebrow}>MOHYEON SOMANG</Text><Text style={s.church}>{site.churchName||'모현소망교회'}</Text></View><View style={s.logo}><Ionicons name="leaf-outline" size={24} color="#164536"/></View></View>
   <ImageBackground source={{uri:BASE+'/assets/site/hero.jpg'}} style={s.hero} imageStyle={s.heroImage}>
     <View style={s.overlay}/><View style={s.heroContent}><View style={s.badge}><Text style={s.badgeText}>THIS WEEK</Text></View><Text style={s.heroTitle}>{sermon?.title||site.heroTitle||'말씀 안에서 함께 자라는 교회'}</Text><Text style={s.heroMeta}>{sermon?.date||'주일예배'}  ·  {sermon?.passage||'모현소망교회'}</Text><Pressable style={s.heroButton} onPress={()=>router.push('/word')}><Text style={s.heroButtonText}>말씀 보기</Text><Ionicons name="arrow-forward" size={16} color="#164536"/></Pressable></View>
   </ImageBackground>
   <View style={s.quick}>{quick.map(([icon,label,to])=><Pressable key={label} style={s.quickItem} onPress={()=>router.push('/'+to)}><View style={s.quickIcon}><Ionicons name={icon} size={22} color="#164536"/></View><Text style={s.quickText}>{label}</Text></Pressable>)}</View>
   {!data&&<ActivityIndicator style={{marginTop:26}} color="#164536"/>}
   <View style={s.sectionHead}><Text style={s.section}>이번 주 말씀</Text><Pressable onPress={()=>router.push('/word')}><Text style={s.more}>전체보기</Text></Pressable></View>
   <Pressable style={s.feature} onPress={()=>router.push('/word')}><View style={s.accent}/><View style={{flex:1}}><Text style={s.kicker}>SUNDAY MESSAGE</Text><Text style={s.cardTitle}>{sermon?.title||'주일 말씀을 준비하고 있습니다'}</Text><Text style={s.desc} numberOfLines={2}>{sermon?.text||'하나님의 말씀으로 한 주를 시작하세요.'}</Text><Text style={s.date}>{sermon?.date||''}</Text></View><Ionicons name="chevron-forward" size={20} color="#9aa39f"/></Pressable>
   <View style={s.sectionHead}><Text style={s.section}>교회 소식</Text><Pressable onPress={()=>router.push('/news')}><Text style={s.more}>전체보기</Text></Pressable></View>
   <Pressable style={s.newsCard} onPress={()=>router.push('/news')}><View style={s.newsIcon}><Ionicons name="megaphone-outline" size={24} color="#164536"/></View><View style={{flex:1}}><Text style={s.cardTitle} numberOfLines={2}>{news?.title||'모현소망교회 소식'}</Text><Text style={s.desc} numberOfLines={2}>{news?.text||'새로운 교회 소식을 확인하세요.'}</Text><Text style={s.date}>{news?.date||''}</Text></View></Pressable>
 </ScrollView>
}
const s=StyleSheet.create({
 page:{flex:1,backgroundColor:'#F7F3EA'},content:{paddingHorizontal:20,paddingTop:58,paddingBottom:36},
 header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:20},eyebrow:{fontSize:10,letterSpacing:2.2,color:'#6C7D75',fontWeight:'800'},church:{fontSize:27,fontWeight:'900',color:'#163F32',marginTop:3},logo:{width:46,height:46,borderRadius:16,backgroundColor:'#E6EDE8',alignItems:'center',justifyContent:'center'},
 hero:{height:360,justifyContent:'flex-end',overflow:'hidden',borderRadius:30,backgroundColor:'#164536'},heroImage:{borderRadius:30},overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(15,55,42,0.72)'},heroContent:{padding:25},badge:{alignSelf:'flex-start',backgroundColor:'rgba(255,255,255,.92)',borderRadius:99,paddingHorizontal:12,paddingVertical:7},badgeText:{fontSize:10,fontWeight:'900',letterSpacing:1.2,color:'#164536'},heroTitle:{fontSize:30,lineHeight:39,fontWeight:'900',color:'#fff',marginTop:18},heroMeta:{fontSize:13,color:'#DCE8E1',marginTop:10},heroButton:{marginTop:20,alignSelf:'flex-start',flexDirection:'row',gap:8,alignItems:'center',backgroundColor:'#fff',borderRadius:99,paddingHorizontal:16,paddingVertical:11},heroButtonText:{fontSize:13,fontWeight:'800',color:'#164536'},
 quick:{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#fff',borderRadius:24,paddingVertical:18,paddingHorizontal:8,marginTop:16},quickItem:{width:'25%',alignItems:'center'},quickIcon:{width:46,height:46,borderRadius:16,backgroundColor:'#EEF2EE',alignItems:'center',justifyContent:'center'},quickText:{fontSize:12,fontWeight:'700',color:'#33463E',marginTop:8},
 sectionHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:30,marginBottom:13},section:{fontSize:21,fontWeight:'900',color:'#163F32'},more:{fontSize:12,fontWeight:'700',color:'#718078'},
 feature:{flexDirection:'row',gap:15,backgroundColor:'#fff',borderRadius:24,padding:19},accent:{width:5,borderRadius:5,backgroundColor:'#A9C3B4'},kicker:{fontSize:9,letterSpacing:1.2,fontWeight:'900',color:'#789086'},cardTitle:{fontSize:18,lineHeight:25,fontWeight:'900',color:'#193D32',marginTop:5},desc:{fontSize:13,lineHeight:20,color:'#66746E',marginTop:7},date:{fontSize:11,fontWeight:'700',color:'#98A19D',marginTop:10},
 newsCard:{flexDirection:'row',gap:15,backgroundColor:'#fff',borderRadius:24,padding:19,alignItems:'flex-start'},newsIcon:{width:50,height:50,borderRadius:17,backgroundColor:'#EEF2EE',alignItems:'center',justifyContent:'center'}
});