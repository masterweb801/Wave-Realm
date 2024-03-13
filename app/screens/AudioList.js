import { Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av'

export default class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            playbackObj: null,
            soundObj: null,
            currentAudio: {}
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

    handleAudioPress = async (item) => {
        if (this.state.soundObj === null) {
            const playbackObj = new Audio.Sound()
            let status = await playbackObj.loadAsync({ uri: item.uri }, { shouldPlay: true })
            this.setState({ ...this.state, currentAudio: item, playbackObj: playbackObj, soundObj: status })
        } else if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying) {
            let status = await this.state.playbackObj.setStatusAsync({ shouldPlay: false })
            this.setState({ ...this.state, soundObj: status })
        } else if (this.state.soundObj.isLoaded && !this.state.soundObj.isPlaying && this.state.currentAudio.id === item.id) {
            let status = await this.state.playbackObj.playAsync()
            this.setState({ ...this.state, soundObj: status })
        }
    }

    rowRender = (type, item) => {
        return <AudioListItem title={item.filename} duration={item.duration} onAudioPress={() => this.handleAudioPress(item)} onOptionPress={() => {
            this.currentItem = item
            this.setState({ ...this.state, modal: true })
        }} />
    }

    render() {
        return <AudioContext.Consumer>
            {({ dataProvider }) => {
                return (
                    <Screen>
                        <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRender} />
                        <OptionModal onPlayPress={() => console.log("Playing Audio")} onPlayListPress={() => console.log("Added to PlayList")} item={this.currentItem} closeModal={() => this.setState({ ...this.props, modal: false })} visible={this.state.modal} />
                    </Screen>
                )
            }}
        </AudioContext.Consumer>
    }
}