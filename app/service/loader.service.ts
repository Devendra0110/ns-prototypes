import {
    LoadingIndicator,
    Mode,
    OptionsCommon,
  } from '@nstudio/nativescript-loading-indicator';

  const indicator = new LoadingIndicator();

const options: OptionsCommon = {
  message: 'Loading...',
  details: 'Fetching details',
  progress: 0.65,
  margin: 10,
  dimBackground: true,
  color: '#4B9ED6', // color of indicator and labels
  // background box around indicator
  // hideBezel will override this if true
  backgroundColor: 'yellow',
  userInteractionEnabled: false, // default true. Set false so that the touches will fall through it.
  hideBezel: true, // default false, can hide the surrounding bezel
  mode: Mode.AnnularDeterminate, // see options below
  android: {                       // Android-specific options
    cancelable: false
  },
  ios: {                           // iOS-specific options
    square: false
  }
}

function showLoader(){
    indicator.show(options)
}

function hideLoader(){
    indicator.hide()
}

export {
    showLoader,
    hideLoader
}
