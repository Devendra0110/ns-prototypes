import { Dialogs, Frame, Observable } from "@nativescript/core"
import { DetectionEvent, DetectionType } from "@nativescript/mlkit-core";
import { BarcodeResult } from "@nativescript/mlkit-barcode-scanning";
import { NAVIGATION_PATHS } from "~/config";

export class PaymentViewModel extends Observable {
    barcode = ""
    constructor(){
        super()
        /* setTimeout(() => {
            console.log('Hello');
            Frame.topmost().navigate({
                moduleName: "pages/details/details-page",
                context: { url: 'https://audit.hrylabour.gov.in/project/eUPI/__canteen.php?lat=29.9751728&long=76.8997025'}
            }
            )
        }, 1000) */
    }
    onDetection(event: DetectionEvent){
        if(event.type == DetectionType.Barcode){
            const barcodeData: BarcodeResult = event.data[0] as BarcodeResult;
            if(!this.barcode){
                this.barcode = barcodeData.rawValue
                Frame.topmost().navigate({
                    moduleName: NAVIGATION_PATHS.DETAILS_PAGE,
                    context:{
                        url: barcodeData.rawValue,
                    }
                  })
            }
        }


    }
}
