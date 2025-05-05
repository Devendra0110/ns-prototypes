import {
  TextField,
  alert,
  ApplicationSettings,
  Connectivity,
  Application,
  EventData,
  Page
} from "@nativescript/core";

import { createViewModel } from "./main-view-model";
import { BASE_URL } from "./config";


let viewModel, connectionStatus:string,page

export function onNavigatingTo(args: EventData) {

  page = <Page>args.object;
  viewModel = createViewModel();
  page.bindingContext = viewModel;

  Connectivity.startMonitoring((change: number) => {
      updateStatus(change);
     })

  // Load session values if already set
  const s_name = ApplicationSettings.getString("name");
  const s_mobile = ApplicationSettings.getString("mobile");

  if (s_name && s_mobile) {
      viewModel.set("s_name", s_name);
      viewModel.set("s_mobile", s_mobile);
      viewModel.set("sessionExists", true);
  } else {
      viewModel.set("sessionExists", false);
  }
}

export function onSendOtpTap(args: EventData) {
  const page = (<any>args.object).page as Page;
  const phoneField = page.getViewById<TextField>("mobileField");
  const mobile_no = phoneField?.text?.trim();

  if (!mobile_no || mobile_no.length !== 10) {
      // return alert({message:"⚠️ Enter a valid 10-digit mobile number!",theme:4, okButtonText:'OK', title:"Alert"});
      return alert("⚠️ Enter a valid 10-digit mobile number!");
  }

  if(connectionStatus === 'Offline'){
      return alert("⚠️ Please check your internet connection 🛜");
  }

}

export function onVerifyOtpTap(args: EventData) {
  const enteredOtp = viewModel.get("enteredOtp").trim();
  const c_mobile = viewModel.get("mobileNumber").trim();
  if(!enteredOtp){
      alert("❌ Incorrect OTP. Try again.");
      return;
  }
  const expectedOtp = ApplicationSettings.getString("expectedOtp");

  const userUrl = `${BASE_URL}__master_phone-name.php?type=json&mobile=${c_mobile}`;
  console.log("🔗 Fetching user info from:", userUrl);

}

export function unloaded(_:EventData){
  Application.off(Application.suspendEvent)
  Connectivity.stopMonitoring();
}


function updateStatus(connectionType:number) {

  switch (connectionType) {
    case Connectivity.connectionType.none:
     connectionStatus = "Offline"
      break;
    case Connectivity.connectionType.wifi:
     connectionStatus = "Online (Wi-Fi)"
      break;
    case Connectivity.connectionType.mobile:
     connectionStatus = "Online (Mobile)"
      break;
    default:
     connectionStatus = "Unknown"
      break;
  }

  if(connectionStatus === 'Offline'){
      return alert("⚠️ Please check your internet connection 🛜");
  }

  // if(connectionStatus.toLowerCase().includes("online")){
  //     return alert("⚠️ Please check your internet connection 🛜");
  // }
}
