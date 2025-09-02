import { requestPermissions } from "@nativescript/camera";
import { EventData, ImageSource, knownFolders, Observable, Page, path } from "@nativescript/core";
import { setInterval } from "@nativescript/core/timer";
import { DetectionEvent, DetectionType, MLKitView } from "@nativescript/mlkit-core";
import { FaceResult } from "@nativescript/mlkit-face-detection";


let page:Page, faceDetection=true
export async function onNavigatedTo(args:EventData) {
    page = <Page>args.object
    page.bindingContext = new Observable()
    // let count =0
    // setInterval(() => {
    //     count++;
    //     page.bindingContext.set('facedata', 'faceData'+ count)
    // }, 2000)
    await requestPermissions();


}

export function onDetection(event: DetectionEvent){
    console.log(faceDetection);
        if(!faceDetection){
            console.log('should return ');
            return
        }
        faceDetection = false
       setTimeout(() => {
         if(event.type == DetectionType.Face){
            const face: FaceResult = event.data[0] as FaceResult;
            page.bindingContext.set('facedata',JSON.stringify(face))
            // const mlkitView = page.getViewById('mlkitView') as MLKitView
            const facedata = JSON.stringify({x: face.headEulerAngleX, y : face.headEulerAngleY, z:face.headEulerAngleZ})
            page.bindingContext.set('facedata',facedata)

            // const latestImage: ImageSource = mlkitView.latestImage;
            // console.log(JSON.stringify(face));
            /* if (latestImage) {
                // Face bounding box coordinates (normalized 0-1 relative to image)
                const left = Math.round(face.bounds['y'] * latestImage.width);
                const top = Math.round(face.bounds['x'] * latestImage.height);
                const width = Math.round(face.bounds['height'] * latestImage.width);
                const height = Math.round(face.bounds['width'] * latestImage.height);

                // Crop the face region from the latest image
                const faceImage: ImageSource = latestImage['crop'](left, top, width, height);

                if (faceImage) {
                    // Save the cropped face image to device storage (e.g., documents folder)
                    saveImage(faceImage, 'detected-face.png');

                    // Optional: Log or display success
                    console.log(`Face captured! Size: ${width}x${height}`);
                }
            } */
            // console.log(face);
        }
       }, 0)


    }



    function saveImage(image: ImageSource, filename: string) {
        try {
            const documents = knownFolders.documents();
            const fileName = path.join(documents.path, filename);
            const saved = image.saveToFile(fileName, 'png');  // Or 'jpeg' for compression

            if (saved) {
                console.log('Face image saved to: ' + fileName);
                // Optional: Show alert or navigate
                // alert('Face image captured and saved!');
            }
        } catch (error) {
            console.error('Error saving image: ' + error);
        }
    }
