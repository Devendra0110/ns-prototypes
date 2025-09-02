import { EventData, Page } from "@nativescript/core";
import { DetailsViewModel } from "./details-view-model";
import { hideLoader, showLoader } from "~/service/loader.service";


let page:Page, webviewlink="https://ssastatescheme.com/hbocwwb/site/receipts/pay-online?vp_id=1&shg_id=1&cid=1&mobile=7793042536&name=Rakesh&amount=10"
export function onNavigatedTo(args:EventData) {
    page = <Page>args.object
    const navigationContext = page.navigationContext;
    page.bindingContext = new DetailsViewModel(navigationContext.url)
    // getData(navigationContext.url)


}


function getData(url: string) {
    let message = "", amount = null
    showLoader()
    fetch(url)
    .then((response) => {
        hideLoader()
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();

    })
    .then((data) => {
        const {Status, MealTime, Amount} = data
        console.log({Status, MealTime, Amount});
        if(Status != "Functional"){
            message = "Canteen is temporarily closed"
        }else{
            const currentTime = new Date().getTime()
            const [fromHr, fromMin] = MealTime.from_time.split(":").map(Number)
            const [toHr, toMin] = MealTime.to_time.split(":").map(Number)
            if(currentTime >= new Date().setHours(fromHr, fromMin) && currentTime <= new Date().setHours(toHr, toMin)){
                message = "Canteen is Open"
                amount = Amount
            }else{
               message = `Canteen Timings are ${MealTime.from_time} to ${MealTime.to_time}`
            }

        }
        page.bindingContext = {message, amount:Amount}
    })
    .catch((error) => {
        hideLoader()
        console.error("There was a problem with the fetch operation:", error);
    });
}

export function onPayTap(args:EventData){
    console.log("hello");
    page.bindingContext = {message: "Payment is in progress", amount: null, webviewSrc:"https://ssastatescheme.com/hbocwwb/site/receipts/pay-online?vp_id=1&shg_id=1&cid=1&mobile=7793042536&name=Rakesh&amount=10"}
}
