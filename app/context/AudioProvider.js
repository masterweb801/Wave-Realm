import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Alert, View, Text } from 'react-native'
import { DataProvider } from 'recyclerlistview'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
            currentAudio: { filename: "No Music is Playing ..." },
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

    componentDidMount() {
        this.getPermission()
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
                loadPreviousAudio: this.loadPreviousAudio
            }}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}
