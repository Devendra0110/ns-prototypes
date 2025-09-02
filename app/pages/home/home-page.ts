import { EventData, Frame, Http, Page,Image, CoreTypes, ImageSource, knownFolders, path, File, Folder, Dialogs } from "@nativescript/core";
import { BASE_URL } from "~/config";
import { CameraOptions, isAvailable, requestPermissions, takePicture, } from '@nativescript/camera';
import { getCurrentLocation } from "@nativescript/geolocation";
import * as bghttp from "@nativescript/background-http";
import * as piexif from "piexifjs";

let page:Page,latitude,longitude
export async function onNavigatedTo(args:EventData) {
   try {
    page = <Page>args.object
    await requestPermissions();
    const userLocation  = await getCurrentLocation({ desiredAccuracy: CoreTypes.Accuracy.high, maximumAge: 5000, timeout: 20000 })
    console.log(userLocation)

    if (!userLocation) {
        console.log("Unable to get user location");
        return;
    }
    latitude = userLocation.latitude
    longitude = userLocation.longitude

   } catch (error) {
    console.log(error)
   }
}

function addExifData(imageData: string): string {
    const newExif = {
        "0th": {
            [piexif.ImageIFD.Make]: "CameraBrand",
            [piexif.ImageIFD.Model]: "CameraModel",
            [piexif.ImageIFD.DateTime]: "2025:05:06 12:00:00"
        },
        "Exif": {
            [piexif.ExifIFD.FNumber]: [50, 10], // f/5.0
            [piexif.ExifIFD.ISOSpeedRatings]: 100
        },
        "GPS": {
            [piexif.GPSIFD.GPSLatitudeRef] : latitude < 0 ? 'S' : 'N',
            [piexif.GPSIFD.GPSLatitude] : degToDmsRational(latitude),
            [piexif.GPSIFD.GPSLongitudeRef] : longitude < 0 ? 'W' : 'E',
            [piexif.GPSIFD.GPSLongitude] : degToDmsRational(longitude)
        }
    };




    const exifBytes = piexif.dump(newExif);
    const newImageData = piexif.insert(exifBytes, imageData);

    return newImageData; // Updated image with EXIF data
}


export async function takeImage(){
   try {
    const options:CameraOptions = {
        width: 300,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false,

    };
    const imageAsset = await takePicture(options);

    // Convert image asset to ImageSource
    const imageSource = await ImageSource.fromAsset(imageAsset);
    // Convert image to base64 (piexifjs requires base64 or binary string)
    const base64Image = imageSource.toBase64String('jpg');

    // Add EXIF data
    const updatedImage = addExifData(`data:image/jpeg;base64,${base64Image}`);
    page.bindingContext = {src:imageAsset.android} // Set the image to the page binding context
    console.log(updatedImage);

    var name = imageAsset.android.substr(imageAsset.android.lastIndexOf('/') + 1);
// Save the image to the device

    try {
    const base64ImageExif: ImageSource = ImageSource.fromBase64Sync(updatedImage.replace('data:image/jpeg;base64,', ''));

        const folderDest: Folder = knownFolders.externalDocuments()

        folderDest.getFile('/images/test.jpg') //1. Create the file

        const pathDest = path.join(folderDest.path, '/images/test.jpg')
        const saved: boolean = await base64ImageExif.saveToFileAsync(pathDest, 'jpeg') // Save to the file

        if (saved) {
                uploadImage(pathDest);
        }
      } catch (err) {
        Dialogs.alert(err)
      }


   } catch (error) {
    console.log(error);
   }


}

function uploadImage(filePath:string){
    var url = 'https://icmjaipur.in/php/scrap/__save.php';
    var name = filePath.substr(filePath.lastIndexOf('/') + 1);
    var session = bghttp.session('image-upload');
    var request = {
        url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        description: 'Uploading ' + name,
    };

    var params = [
        { name: 'lat', value: latitude },
        { name: 'lon', value: longitude },
        { name: 'image', filename: filePath, mimeType: 'image/jpeg' },
      ]

      var task = session.multipartUpload(params, request)
      task.on("progress", progressHandler);
    task.on("error", errorHandler);
    task.on("responded", respondedHandler);
    task.on("complete", completeHandler);
    task.on("cancelled", cancelledHandler); // Android only

}
/// task methods


function progressHandler(e: bghttp.ProgressEventData) {
    alert('uploaded ' + e.currentBytes + ' / ' + e.totalBytes)
  }

  // event arguments:
  // task: Task
  // responseCode: number
  // error: java.lang.Exception (Android) / NSError (iOS)
  // response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
  function errorHandler(e: bghttp.ErrorEventData) {
    alert('received ' + e.responseCode + ' code.')
    var serverResponse = e.response
  }

  // event arguments:
  // task: Task
  // responseCode: number
  // data: string
  function respondedHandler(e: bghttp.ResultEventData) {
    alert('received ' + e.responseCode + ' code. Server sent: ' + e.data)
  }

  // event arguments:
  // task: Task
  // responseCode: number
  // response: net.gotev.uploadservice.ServerResponse (Android) / NSHTTPURLResponse (iOS)
  function completeHandler(e: bghttp.CompleteEventData) {
    alert('received ' + e.responseCode + ' code')
    var serverResponse = e.response
  }

  // event arguments:
  // task: Task
  function cancelledHandler(e: EventData) {
    alert('upload cancelled')
  }







function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64.split(',')[1]); // Remove "data:image/jpeg;base64," prefix
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer as ArrayBuffer;
}

function degToDmsRational(degFloat:number): [number, number][] {
    var minFloat = degFloat % 1 * 60
    var secFloat = minFloat % 1 * 60
    var deg = Math.floor(degFloat)
    var min = Math.floor(minFloat)
    var sec = Math.round(secFloat * 100)

    return [[deg, 1], [min, 1], [sec, 100]]
  }

interface IPage {
    Page : string;
    Hindi : string;
    Content : string;
    Others : string;
}
