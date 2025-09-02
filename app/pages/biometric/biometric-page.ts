
import { EventData, ImageSource, knownFolders, Observable, Page, path } from "@nativescript/core";
import {
  BiometricAuth,
  BiometricIDAvailableResult,
  ERROR_CODES,
} from '@nativescript/biometrics'




let page:Page, faceDetection=true
export async function onNavigatedTo(args:EventData) {
    page = <Page>args.object
    page.bindingContext = new Observable()

}


export async function checkBiometricAvailibility() {

    var biometricAuth = new BiometricAuth()
    page.bindingContext.set('biometricAuth',biometricAuth)

        biometricAuth.available().then((result: BiometricIDAvailableResult) => {
            console.log(result);

        })
    const biometricResult = await biometricAuth.available()
    page.bindingContext.set('isBiometric', biometricResult.any)
    page.bindingContext.set('isFace', biometricResult.face)
    page.bindingContext.set('isTouch', biometricResult.touch)
}

export async function initiateFaceAuth() {

    const biometricAuth = page.bindingContext.get('biometricAuth')
    biometricAuth
  .verifyBiometric({
    title: 'Android title', // optional title (used only on Android)
    message: 'Scan your finger', // optional (used on both platforms) - for FaceID on iOS see the notes about NSFaceIDUsageDescription
    fallbackMessage: 'Enter your PIN', // this will be the text to show for the "fallback" button on the biometric prompt
    pinFallback: true, // allow fall back to pin/password
  })
  .then((result) => {
    console.log(result);
    if (result.code === ERROR_CODES.SUCCESS) {
      console.log('Biometric ID OK')
    }
  })
  .catch((err) => console.log(`Biometric ID NOT OK: ${JSON.stringify(err)}`))
}
