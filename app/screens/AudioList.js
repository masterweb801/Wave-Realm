import { Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av'
import { pause, play, resume, another } from '../misc/audioController';
import { storeAudio } from '../misc/helper';

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

    handleAudioPress = async (audio) => {
        const { soundObj, playbackObj, currentAudio, updateState, audioFiles } = this.context
        if (soundObj === null) {
            const playbackObj = new Audio.Sound()
            let status = await play(playbackObj, audio.uri)
            await this.context.notify("Now Playing ...", audio.filename)
            const index = audioFiles.indexOf(audio)
            updateState(this.context, { currentAudio: audio, playbackObj: playbackObj, soundObj: status, isPlaying: true, currentAudioIndex: index })
            playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate)
            await storeAudio(audio, index)
        } else if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            let status = await pause(playbackObj)
            updateState(this.context, { soundObj: status, isPlaying: false })
        } else if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
            let status = await resume(playbackObj)
            updateState(this.context, { soundObj: status, isPlaying: true })
        } else if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await another(playbackObj, audio.uri)
            await this.context.denotify()
            await this.context.notify("Now Playing ...", audio.filename)
            const index = audioFiles.indexOf(audio)
            updateState(this.context, { currentAudio: audio, soundObj: status, isPlaying: true, currentAudioIndex: index })
            await storeAudio(audio, index)
        }
    }

    rowRender = (type, item, index, extendedState) => {
        return <AudioListItem title={item.filename} activeListItem={this.context.currentAudioIndex === index} duration={item.duration} isPlaying={extendedState.isPlaying} onAudioPress={() => this.handleAudioPress(item)} onOptionPress={() => {
            this.currentItem = item
            this.setState({ ...this.state, modal: true })
        }} />
    }

    componentDidMount() {
        this.context.loadPreviousAudio()
    }

    render() {
        return <AudioContext.Consumer>
            {({ dataProvider, isPlaying }) => {
                if (dataProvider._data.length) {
                    return (
                        <Screen>
                            <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRender} extendedState={{ isPlaying }} />
                            <OptionModal
                                onPlayPress={() => {
                                    this.handleAudioPress(this.currentItem)
                                    this.setState({ ...this.props, modal: false })
                                }}
                                item={this.currentItem}
                                closeModal={() => this.setState({ ...this.props, modal: false })}
                                visible={this.state.modal}
                                PP={this.currentItem.id === this.context.currentAudio.id ? !isPlaying : true}
                            />
                        </Screen>
                    )
                } else return null
            }}
        </AudioContext.Consumer>
    }
}