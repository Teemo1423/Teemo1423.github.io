import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const icons={index:['home','home-outline'],word:['book','book-outline'],news:['newspaper','newspaper-outline'],church:['location','location-outline']};

export default function Layout(){
  return <>
    <StatusBar style="dark"/>
    <Tabs screenOptions={({route})=>({
      headerShown:false,
      tabBarActiveTintColor:'#164536',
      tabBarInactiveTintColor:'#87928d',
      tabBarLabelStyle:{fontSize:11,fontWeight:'700',marginTop:2},
      tabBarStyle:{height:82,paddingTop:9,paddingBottom:14,backgroundColor:'#fff',borderTopWidth:0,elevation:12},
      tabBarIcon:({color,size,focused})=><Ionicons name={(icons[route.name]||['ellipse','ellipse-outline'])[focused?0:1]} size={23} color={color}/>
    })}>
      <Tabs.Screen name="index" options={{title:'홈'}}/>
      <Tabs.Screen name="word" options={{title:'말씀'}}/>
      <Tabs.Screen name="news" options={{title:'소식'}}/>
      <Tabs.Screen name="church" options={{title:'교회'}}/>
    </Tabs>
  </>;
}