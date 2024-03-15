//play
export const play = async (playbackObj, uri) => {
    try {
        return await playbackObj.loadAsync({ uri }, { shouldPlay: true })
    } catch (error) {
        console.log("Error inside play helper method \n" + error.message);
    }
}

//pause
export const pause = async playbackObj => {
    try {
        return await playbackObj.setStatusAsync({ shouldPlay: false })
    } catch (error) {
        console.log("Error inside pause helper method \n" + error.message);
    }
}

// resume
export const resume = async playbackObj => {
    try {
        return await playbackObj.playAsync()
    } catch (error) {
        console.log("Error inside resume helper method \n" + error.message);
    }
}

// another
export const another = async (playbackObj, uri) => {
    try {
        await playbackObj.stopAsync()
        await playbackObj.unloadAsync()
        return await play(playbackObj, uri)
    } catch (error) {
        console.log("Error inside playAnother helper method \n" + error.message);
    }
}