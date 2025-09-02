import { EventData, Frame, Observable, WebView } from "@nativescript/core"
import { NAVIGATION_PATHS } from "~/config";
import { hideLoader, showLoader } from "~/service/loader.service"
export class DetailsViewModel extends Observable {
    message: string;
    amount: number;
    webviewSrc: string;
    constructor(url:string){
        super()
        this.message = ""
        this.amount = null
        this.webviewSrc = null;
        this.getData(url)
    }
    getData(url: string){
        showLoader()
        fetch(url)
        .then((response) => {
            hideLoader()
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            showLoader()
            return response.json();

        })
        .then((data) => {
            hideLoader()
            const {Status, MealTime, Amount} = data
            console.log({Status, MealTime, Amount});
            if(Status != "Functional"){
                this.set("message", "Canteen is temporarily closed")
            }else{
                const currentTime = new Date().getTime()
                const [fromHr, fromMin] = MealTime.from_time.split(":").map(Number)
                const [toHr, toMin] = MealTime.to_time.split(":").map(Number)
                if(currentTime >= new Date().setHours(fromHr, fromMin) && currentTime <= new Date().setHours(toHr, toMin)){
                    this.set("message", "Canteen is Open")
                    this.set("amount", Amount)
                }else{
                    this.set("message", `Canteen Timings are ${MealTime.from_time} to ${MealTime.to_time}`)
                    this.set("amount", null)
                }

            }
        })
        .catch((error) => {
            hideLoader()
            console.error("There was a problem with the fetch operation:", error);
        });

    }

    onPayTap(args:EventData){
        console.log("hello");
        this.set("message", "Payment is in progress")
        this.set("amount", null)
        this.set("webviewSrc", "https://ssastatescheme.com/hbocwwb/site/receipts/pay-online?vp_id=1&shg_id=1&cid=1&mobile=7793042536&name=Rakesh&amount=10")
    }


    pageLoaded(arg:any){
        const webView = arg.object as WebView

        console.log('WebView finished loading', arg.url, webView)

        if(arg.url && arg.url.includes("payment_response")){

            const jsCode = `(function() {
                const preTag = document.querySelector('pre');
                if (preTag) {
                  return preTag.textContent; // Get the JSON string
                }
                return null;
              })();`;
    /**
         * if (webView.ios) {
        // iOS: Execute JavaScript and parse JSON
        const jsonString = webView.ios.stringByEvaluatingJavaScriptFromString(jsCode);
            if (jsonString) {
                const result = JSON.parse(value)
                try {
                    console.log(result);
                    Frame.topmost().navigate({
                        moduleName: "pages/receipt/receipt-page",
                        context: result}
                    )
                    } catch (error) {
                    console.error('JSON Parse Error:', error);
                    }
            } else {
                console.error('No JSON found in iOS WebView');
            }
        } else {*/
        const valueCallback = new android.webkit.ValueCallback({
            onReceiveValue: (value:string) => {
                const result = JSON.parse(value)
                try {
                    console.log(result);
                    Frame.topmost().navigate({
                        moduleName: NAVIGATION_PATHS.RESULT_PAGE,
                        context: result
                    })
                    } catch (error) {
                    console.error('JSON Parse Error:', error);
                    }
            }
        });
        webView.android.evaluateJavascript(
            jsCode,
            valueCallback
            );
        }
    }
    pageLoading(arg:any){
        const webView = arg.object as WebView
        console.log('WebView started loading', arg.url, webView.android)
    }



}
