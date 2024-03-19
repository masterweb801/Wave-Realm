import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Alert, View, Text } from 'react-native'
import { DataProvider } from 'recyclerlistview'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av'
import { storeAudio } from '../misc/helper'
import { play, pause, resume, another } from '../misc/audioController'

export const AudioContext = createContext()

export default class AudioProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            audioFiles: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
            playbackPosition: null,
            playbackDuration: null
        }
        this.totalAudioCount = 0
    }

    getAudioFiles = async () => {
        let { dataProvider, audioFiles } = this.state
        let files = await MediaLibrary.getAssetsAsync({
            mediaType: "audio"
        })
        files = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
            first: files.totalCount
        })
        this.totalAudioCount = files.totalCount
        this.setState({ ...this.state, dataProvider: dataProvider.cloneWithRows([...audioFiles, ...files.assets]), audioFiles: [...audioFiles, ...files.assets] })
    }

    PermissionAlert = () => {
        Alert.alert("Permission Required", "This App needs to read audio files!", [
            {
                text: "I am Ready",
                onPress: () => this.getPermission()
            }, {
                text: "Cancel",
                onPress: () => this.PermissionAlert()
            }
        ])
    }

    getPermission = async () => {
        let perm = await MediaLibrary.getPermissionsAsync()
        if (perm.granted) {
            this.getAudioFiles()
        } else if (!perm.granted && perm.canAskAgain) {
            let { status, canAskAgain } = MediaLibrary.requestPermissionsAsync()
            if (status === 'denied' && canAskAgain) {
                this.PermissionAlert()
            } else if (status === 'granted') {
                this.getAudioFiles()
            } else if (status === 'denied' && !canAskAgain) {
                this.setState({ ...this.state, permissionError: true })
            }
        } else if (!perm.granted && !perm.canAskAgain) {
            this.setState({ ...this.state, permissionError: true })
        }
    }

    loadPreviousAudio = async () => {
        let savedData = await AsyncStorage.getItem("prevAudio");
        let currentAudio;
        let currentAudioIndex;

        if (savedData === null) {
            currentAudio = this.state.audioFiles[0]
            currentAudioIndex = 0
        } else {
            let audio = JSON.parse(savedData)
            currentAudio = audio.audio
            currentAudioIndex = audio.index
        }
        this.setState({ ...this.state, currentAudio, currentAudioIndex })
    }

    onPlaybackStatusUpdate = async (status) => {
        // if (status.isLoaded && status.isPlaying) {
        //     this.updateState(this.context, {
        //         playbackPosition: status.positionMillis,
        //         playbackDuration: status.durationMillis
        //     })
        // } else
        if (status.didJustFinish) {
            await this.handelNext()
        }
    }

    handelPlayPause = async () => {
        if (this.state.soundObj === null) {
            let audio = this.state.currentAudio
            let status = await play(this.state.playbackObj, audio.uri)
            this.updateState(this.state, { currentAudio: audio, soundObj: status, isPlaying: true, currentAudioIndex: this.state.currentAudioIndex })
            this.state.playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
            await this.props.notify("Now Playing ...", audio.filename)
        } else if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying) {
            let status = await pause(this.state.playbackObj)
            this.updateState(this.state, { soundObj: status, isPlaying: false })
        } else if (this.state.soundObj.isLoaded && !this.state.soundObj.isPlaying) {
            let status = await resume(this.state.playbackObj)
            this.updateState(this.state, { soundObj: status, isPlaying: true })
        }
    }

    handelNext = async () => {
        let nextAudioIndex = this.state.currentAudioIndex + 1
        let files = this.state.audioFiles

        if (this.state.soundObj !== null) {
            if ((files.length - 1) >= nextAudioIndex) {
                let nextAudio = files[nextAudioIndex]
                await this.props.denotify()
                await this.props.notify("Now Playing ...", nextAudio.filename)
                let status = await another(this.state.playbackObj, nextAudio.uri)
                this.updateState(this.state, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: nextAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, nextAudioIndex)
            } else {
                let nextAudio = files[0]
                await this.props.denotify()
                await this.props.notify("Now Playing ...", nextAudio.filename)
                let status = await another(this.state.playbackObj, nextAudio.uri)
                this.updateState(this.state, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: 0, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, 0)
            }
        } else {
            if ((files.length - 1) >= nextAudioIndex) {
                let nextAudio = files[nextAudioIndex]
                await this.props.notify("Now Playing ...", nextAudio.filename)
                let status = await play(this.state.playbackObj, nextAudio.uri)
                this.updateState(this.state, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: nextAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, nextAudioIndex)
            } else {
                let nextAudio = files[0]
                await this.props.notify("Now Playing ...", nextAudio.filename)
                let status = await play(this.state.playbackObj, nextAudio.uri)
                this.updateState(this.state, { currentAudio: nextAudio, soundObj: status, isPlaying: true, currentAudioIndex: 0, playbackPosition: null, playbackDuration: null })
                await storeAudio(nextAudio, 0)
            }
        }
    }

    handelPrevious = async () => {
        let prevAudioIndex = this.state.currentAudioIndex - 1
        let files = this.state.audioFiles
        if (this.state.soundObj !== null) {
            if (0 <= prevAudioIndex) {
                let prevAudio = files[prevAudioIndex]
                await this.props.denotify()
                await this.props.notify("Now Playing ...", prevAudio.filename)
                let status = await another(this.state.playbackObj, prevAudio.uri)
                this.updateState(this.state, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: prevAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, prevAudioIndex)
            } else {
                let index = files.length - 1
                let prevAudio = files[index]
                await this.props.denotify()
                await this.props.notify("Now Playing ...", prevAudio.filename)
                let status = await another(this.state.playbackObj, prevAudio.uri)
                this.updateState(this.state, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: index, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, index)
            }
        } else {
            if (0 <= prevAudioIndex) {
                let prevAudio = files[prevAudioIndex]
                await this.props.notify("Now Playing ...", prevAudio.filename)
                let status = await play(this.state.playbackObj, prevAudio.uri)
                this.updateState(this.state, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: prevAudioIndex, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, prevAudioIndex)
            } else {
                let index = files.length - 1
                let prevAudio = files[index]
                await this.props.notify("Now Playing ...", prevAudio.filename)
                let status = await play(this.state.playbackObj, prevAudio.uri)
                this.updateState(this.state, { currentAudio: prevAudio, soundObj: status, isPlaying: true, currentAudioIndex: index, playbackPosition: null, playbackDuration: null })
                await storeAudio(prevAudio, index)
            }
        }
    }

    componentDidMount() {
        this.getPermission()
        if (this.state.playbackObj === null) {
            this.setState({ ...this.state, playbackObj: new Audio.Sound() })
        }
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            interruptionModeIOS: InterruptionModeIOS.DuckOthers,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
            playThroughEarpieceAndroid: false
        });
    }

    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    };

    render() {
        let {
            audioFiles,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration
        } = this.state;
        if (permissionError) {
            return (
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 25, textAlign: "center", textColor: "red" }}>
                        It seems like you haven't accept the permission!
                    </Text>
                </View>
            )
        }
        return (
            <AudioContext.Provider value={{
                audioFiles,
                dataProvider,
                playbackObj,
                soundObj,
                currentAudio,
                updateState: this.updateState,
                isPlaying,
                currentAudioIndex,
                totalAudioCount: this.totalAudioCount,
                playbackPosition,
                playbackDuration,
                loadPreviousAudio: this.loadPreviousAudio,
                onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
                handelPlayPause: this.handelPlayPause,
                handelPrevious: this.handelPrevious,
                handelNext: this.handelNext,
                notify: this.props.notify,
                denotify: this.props.denotify,
            }}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}
