import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Screen from '../components/Screen'
import { color } from '../misc/color'
import { Feather, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import * as Linking from 'expo-linking'

const Logo = require('../../assets/icon.png')
const App = require('../../app.json');
const Version = App.expo.version

const About = () => {
    const openLogicRealm = () => {
        Linking.openURL("https:www.logicrealm.xyz")
    }

    const openGithub = () => {
        Linking.openURL("https://github.com/masterweb801/Wave-Realm")
    }


    return <Screen>
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <Image source={Logo} style={styles.logo}></Image>
                <Text style={styles.logoText}>Wave Realm</Text>
            </View>
            <View style={styles.bottomContainer}>
                <TouchableOpacity onPress={openLogicRealm}>
                    <View style={styles.option}>
                        <View style={styles.optionIconContainer}>
                            <FontAwesome6 name="building-columns" size={24} color="black" />
                        </View>
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>Made By</Text>
                            <Text style={styles.optionDesc}>Logic Realm</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.option}>
                    <View style={styles.optionIconContainer}>
                        <Feather name="git-pull-request" size={24} color="black" />
                    </View>
                    <View style={styles.optionText}>
                        <Text style={styles.optionTitle}>Version</Text>
                        <Text style={styles.optionDesc}>{Version}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={openGithub}>
                    <View style={styles.option}>
                        <View style={styles.optionIconContainer}>
                            <AntDesign name="github" size={24} color="black" />
                        </View>
                        <View style={styles.optionText}>
                            <Text style={styles.optionTitle}>GitHub Repository</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </Screen>
}

export default About

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.ACTIVE_BG,
        flex: 1,
    },
    topContainer: {
        width: "100%",
        height: "40%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.ACTIVE_BG,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "gray",
    },
    logoText: {
        fontSize: 34,
        color: color.ACTIVE_FONT,
        fontWeight: "bold",
        marginTop: 15
    },
    bottomContainer: {
        borderRadius: 25,
        backgroundColor: "#ccc",
        width: "100%",
        padding: 15,
        paddingVertical: 20,
        marginBottom: 10,
        justifyContent: "center"
    },
    option: {
        backgroundColor: color.ACTIVE_FONT,
        padding: 15,
        marginVertical: 5,
        borderRadius: 25,
        flexDirection: "row"
    },
    optionIconContainer: {
        width: 40,
        height: 40,
        marginRight: 5,
        alignItems: "center",
        justifyContent: "center"
    }, optionText: { justifyContent: "center" },
    optionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: color.FONT
    },
    optionDesc: {
        fontSize: 12,
        fontWeight: "bold",
        marginLeft: 5,
        color: color.FONT_MEDIUM
    }
})