import { Text, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';

export default class AudioList extends Component {
    static contextType = AudioContext;

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

    rowRender = (type, item) => {
        return <Text>{item.filename}</Text>
    }

    render() {
        return <AudioContext.Consumer>
            {({ dataProvider }) => {
                return <RecyclerListView dataProvider={dataProvider} layoutProvider={this.layoutProvider} rowRenderer={this.rowRender} />
            }}
        </AudioContext.Consumer>
    }
}

const styles = StyleSheet.create({
    text: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: "red"
    }
})