import { Text, View, StyleSheet, Dimensions } from 'react-native'
import React, { useContext, useEffect } from 'react'
import Screen from '../components/Screen'
import { color } from '../misc/color'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider'
import { play, pause, resume, another } from '../misc/audioController';
import { storeAudio } from '../misc/helper';

const { width } = Dimensions.get('window');

const Player = () => {
    const context = useContext(AudioContext)
    const { playbackPosition, playbackDuration } = context

    const calculateSeekBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration
        } else {
            return 0
        }
    }

    const handelPlayPause = async () => {
        if (context.soundObj === null) {
            let audio = context.currentAudio
            let status = await play(context.playbackObj, audio.uri)
            context.updateState(context, { currentAudio: audio, soundObj: status, isPlaying: true, currentAudioIndex: context.currentAudioIndex })
            context.playbackObj.setOnPlaybackStatusUpdate(context.onPlaybackStatusUpdate)
        } else if (context.soundObj.isLoaded && context.soundObj.isPlaying) {
            let status = await pause(context.playbackObj)
            context.updateState(context, { soundObj: status, isPlaying: false })
        } else if (context.soundObj.isLoaded && !context.soundObj.isPlaying) {
            let status = await resume(context.playbackObj)
            context.updateState(context, { soundObj: status, isPlaying: true })
        }
    }

    const handelNext = async () => {
        let nextAudioIndex = context.currentAudioIndex + 1
        let files = context.audioFiles

        if (context.soundObj !== null) {
            if ((files.length - 1) >= nextAudioIndex) {
                let nextAudio = files[nextAudioIndex]
                let status = await another(context.playbackObj, nextAudio.uri)
                context.updateState(context, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: nextAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, nextAudioIndex)
            } else {
                let nextAudio = files[0]
                let status = await another(context.playbackObj, nextAudio.uri)
                context.updateState(context, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: 0, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, 0)
            }
        } else {
            if ((files.length - 1) >= nextAudioIndex) {
                let nextAudio = files[nextAudioIndex]
                let status = await play(context.playbackObj, nextAudio.uri)
                context.updateState(context, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: nextAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, nextAudioIndex)
            } else {
                let nextAudio = files[0]
                let status = await play(context.playbackObj, nextAudio.uri)
                context.updateState(context, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: 0, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, 0)
            }
        }
    }

    const handelPrevious = async () => {
        let prevAudioIndex = context.currentAudioIndex - 1
        let files = context.audioFiles
        if (context.soundObj !== null) {
            if (0 <= prevAudioIndex) {
                let prevAudio = files[prevAudioIndex]
                let status = await another(context.playbackObj, prevAudio.uri)
                context.updateState(context, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: prevAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, prevAudioIndex)
            } else {
                let index = files.length - 1
                let prevAudio = files[index]
                let status = await another(context.playbackObj, prevAudio.uri)
                context.updateState(context, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: index, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, index)
            }
        } else {
            if (0 <= prevAudioIndex) {
                let prevAudio = files[prevAudioIndex]
                let status = await play(context.playbackObj, prevAudio.uri)
                context.updateState(context, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: prevAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, prevAudioIndex)
            } else {
                let index = files.length - 1
                let prevAudio = files[index]
                let status = await play(context.playbackObj, prevAudio.uri)
                context.updateState(context, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: index, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, index)
            }
        }
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
                <Slider
                    style={{ width: width, height: 40 }}
                    value={calculateSeekBar()}
                    minimumValue={0}
                    maximumValue={1}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                />
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
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioTitle: {
        fontSize: 16,
        color: color.FONT,
        padding: 15,
    },
    audioControllers: {
        width,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
});