import { Text, View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { color } from '../misc/color';
import { FontAwesome } from '@expo/vector-icons';

const getThumbnailText = (filename) => filename[0]

const convertTime = minutes => {
    if (minutes) {
        const hrs = minutes / 60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`;
    }
};

export const AudioListItem = ({ title, duration, onOptionPress, onAudioPress, isPlaying, activeListItem }) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onAudioPress}>
                    <View style={styles.leftContainer}>
                        <View style={!activeListItem ? styles.thumlail : styles.activeThumbnail}>
                            {!activeListItem ? <Text style={styles.thumlailText}>{getThumbnailText(title).toUpperCase()}</Text> :
                                <>{
                                    !isPlaying ? <FontAwesome name="play" style={styles.activeThumbnailIcon} /> :
                                        <FontAwesome name="pause" style={styles.activeThumbnailIcon} />
                                }</>}
                        </View>
                        <View style={styles.titleContainer}>
                            <Text numberOfLines={1} style={styles.title}>{title}</Text>
                            <Text style={styles.timeText}>{convertTime(duration)}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo name="dots-three-vertical" size={20} color={color.FONT_MEDIUM} onPress={onOptionPress} style={{ padding: 10 }} />
                </View>
            </View>
            <View style={styles.separetor}></View>
        </>
    )
}

const { width } = Dimensions.get("window")

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: width - 80,
        marginVertical: 10,
        alignSelf: "center"
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    rightContainer: {
        flexBasis: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    thumlail: {
        height: 50,
        flexBasis: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.FONT_LIGHT,
    },
    thumlailText: {
        fontSize: 22,
        fontWeight: "bold",
        color: color.FONT
    },
    activeThumbnail: {
        height: 50,
        flexBasis: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: color.ACTIVE_BG,
    },
    activeThumbnailIcon: {
        color: color.ACTIVE_FONT,
        fontSize: 18,
        fontWeight: "bold"
    },
    titleContainer: {
        width: width - 180,
        paddingLeft: 10
    },
    title: {
        fontSize: 16,
        color: color.FONT
    },
    activeTitle: {
        fontSize: 16,
        color: color.ACTIVE_BG
    },
    separetor: {
        width: width - 80,
        backgroundColor: "#333",
        height: 0.5,
        opacity: 0.3,
        alignSelf: "center"
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGHT
    }
})

export default AudioListItem