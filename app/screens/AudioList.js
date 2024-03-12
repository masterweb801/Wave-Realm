import { Text, ScrollView, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'

export default class AudioList extends Component {
    static contextType = AudioContext
    render() {
        return (
            <ScrollView>
                {this.context.audioFiles.map((item) => <Text key={item.id} style={styles.text}>{item.filename}</Text>)}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: "red"
    }
})