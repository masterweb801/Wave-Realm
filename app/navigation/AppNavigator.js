import React from 'react'
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import AudioList from '../screens/AudioList'
import Player from '../screens/Player'
import About from '../screens/About'

const Tab = createBottomTabNavigator()

const AppNavigator = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='AudioList' component={AudioList} options={{
                tabBarIcon: ({ color, size }) => <MaterialIcons name="headset" size={size} color={color} />,
                headerShown: false
            }} />
            <Tab.Screen name='Player' component={Player} options={{
                tabBarIcon: ({ color, size }) => < FontAwesome5 name="compact-disc" size={size} color={color} />,
                headerShown: false
            }} />
            <Tab.Screen name='About' component={About} options={{
                tabBarIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} />,
                headerShown: false
            }} />
        </Tab.Navigator>
    )
}

export default AppNavigator