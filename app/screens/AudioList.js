import { Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av'
import { pause, play, resume, another } from '../misc/audioController';

export default class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
        this.currentItem = {}
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        switch (type) {
            case 'audio':
                dim.width = Dimensions.get("window").width
                dim.height = 70
                break;
            default:
                dim.height = 0
                dim.width = 0
        }
    })

    onPlaybackStatusUpdate = (status) => {
        if (status.isLoaded && status.isPlaying) {
            this.context.updateState(this.context, {
                playbackPosition: status.positionMillis,
                playbackDuration: status.durationMillis
            })
        }
    }

    handleAudioPress = async (audio) => {
        const { soundObj, playbackObj, currentAudio, updateState, audioFiles } = this.context
        if (soundObj === null) {
            const playbackObj = new Audio.Sound()
            let status = await play(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            updateState(this.context, { currentAudio: audio, playbackObj: playbackObj, soundObj: status, isPlaying: true, currentAudioIndex: index })
            playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate)
        } else if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            let status = await pause(playbackObj)
            updateState(this.context, { soundObj: status, isPlaying: false })
        } else if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
            let status = await resume(playbackObj)
            updateState(this.context, { soundObj: status, isPlaying: true })
        } else if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await another(playbackObj, audio.uri)
            const index = audioFiles.indexOf(audio)
            updateState(this.context, { currentAudio: audio, soundObj: status, isPlaying: true, currentAudioIndex: index })
        }
    }

    rowRender = (type, item, index, extendedState) => {
        return <AudioListItem title={item.filename} activeListItem={this.context.currentAudioIndex === index} duration={item.duration} isPlaying={extendedState.isPlaying} onAudioPress={() => this.handleAudioPress(item)} onOptionPress={() => {
            this.currentItem = item
            this.setState({ ...this.state, modal: true })
        }} />
    }

    render() {
        return <AudioContext.Consumer>
            {({ dataProvider, isPlaying }) => {
                return (
                    <Screen>
                        <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRender} extendedState={{ isPlaying }} />
                        <OptionModal onPlayPress={() => console.log("Playing Audio")} onPlayListPress={() => console.log("Added to PlayList")} item={this.currentItem} closeModal={() => this.setState({ ...this.props, modal: false })} visible={this.state.modal} />
                    </Screen>
                )
            }}
        </AudioContext.Consumer>
    }
}