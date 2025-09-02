import { requestPermissions } from "@nativescript/camera";
import { EventData, Page } from "@nativescript/core";
import { PaymentViewModel } from "./payment-view-model";


let page:Page
export async function onNavigatedTo(args:EventData) {
    page = <Page>args.object
    await requestPermissions();
    page.bindingContext = new PaymentViewModel()

}
