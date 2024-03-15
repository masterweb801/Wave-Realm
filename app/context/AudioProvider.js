import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Alert, View, Text } from 'react-native'
import { DataProvider } from 'recyclerlistview'

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
            currentAudioIndex: null
        }
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

    componentDidMount() {
        this.getPermission()
    }

    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    };

    render() {
        let { audioFiles, dataProvider, permissionError, playbackObj, soundObj, currentAudio, isPlaying, currentAudioIndex } = this.state;
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
            <AudioContext.Provider value={{ audioFiles, dataProvider, playbackObj, soundObj, currentAudio, updateState: this.updateState, isPlaying, currentAudioIndex }}>
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}
