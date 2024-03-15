import React from 'react'
import { color } from '../misc/color';
import { AntDesign } from '@expo/vector-icons';

const PlayerButton = (props) => {
    const { iconType, size = 40, colour = color.FONT, onPress } = props
    const getIconType = (type) => {
        switch (type) {
            case "play":
                return "pausecircle"
            case "pause":
                return "playcircleo"
            case "next":
                return "fastforward"
            case "prev":
                return "fastbackward"
        }
    }
    return <AntDesign {...props} name={getIconType(iconType)} size={size} color={colour} onPress={onPress} />
}

export default PlayerButton