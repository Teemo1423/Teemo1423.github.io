import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const icons={index:['home','home-outline'],word:['book','book-outline'],news:['newspaper','newspaper-outline'],church:['ellipsis-horizontal-circle','ellipsis-horizontal-circle-outline']};

export default function Layout(){
  return <>
    <StatusBar style="dark"/>
    <Tabs screenOptions={({route})=>({
      headerShown:false,
      tabBarActiveTintColor:'#4F82F7',
      tabBarInactiveTintColor:'#8A8F98',
      tabBarLabelStyle:{fontSize:10,fontWeight:'700',marginTop:2},
      tabBarStyle:{height:78,paddingTop:8,paddingBottom:12,backgroundColor:'#fff',borderTopColor:'#ECEEF2',borderTopWidth:1},
      tabBarIcon:({color,focused})=><Ionicons name={(icons[route.name]||['ellipse','ellipse-outline'])[focused?0:1]} size={22} color={color}/>
    })}>
      <Tabs.Screen name="index" options={{title:'홈'}}/>
      <Tabs.Screen name="word" options={{title:'말씀'}}/>
      <Tabs.Screen name="news" options={{title:'소식'}}/>
      <Tabs.Screen name="church" options={{title:'더보기'}}/>
    </Tabs>
  </>;
}