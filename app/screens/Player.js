import { Text, View, StyleSheet, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Screen from '../components/Screen'
import { color } from '../misc/color'
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider'

const { width } = Dimensions.get('window');

const Player = () => {
    const context = useContext(AudioContext)
    // const { playbackPosition, playbackDuration } = context

    // const calculateSeekBar = () => {
    //     if (playbackPosition !== null && playbackDuration !== null) {
    //         return playbackPosition / playbackDuration
    //     } else {
    //         return 0
    //     }
    // }

    const handelPlayPause = async () => {
        await context.handelPlayPause()
    }

    const handelNext = async () => {
        await context.handelNext()
    }

    const handelPrevious = async () => {
        await context.handelPrevious()
    }

    useEffect(() => {
        context.loadPreviousAudio()
    }, [])

    if (context.currentAudio) return <Screen>
        <View style={styles.container}>
            <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}</Text>
            <View style={styles.midBannerContainer}>
                <MaterialCommunityIcons name="music-circle" size={300} color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioTitle}>{context.currentAudio.filename}</Text>
                {/* <Slider
                    style={{ width: width, height: 40 }}
                    value={calculateSeekBar()}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                /> */}
                <View style={styles.audioControllers}>
                    <PlayerButton iconType={"prev"} onPress={handelPrevious} />
                    <PlayerButton iconType={context.isPlaying ? "play" : "pause"} style={{ marginHorizontal: 25 }} onPress={handelPlayPause} />
                    <PlayerButton iconType={"next"} onPress={handelNext} />
                </View>
            </View>
        </View>
    </Screen>
}

export default Player

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    audioCount: {
        textAlign: 'right',
        color: color.FONT_LIGHT,
        fontSize: 14,
        marginRight: 15,
        marginTop: 15
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioTitle: {
        fontSize: 16,
        color: color.FONT,
        padding: 20,
    },
    audioControllers: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 50,
        paddingTop: 20,
    },
});