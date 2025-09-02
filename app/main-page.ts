import {TextField,alert,ApplicationSettings,Connectivity,Application,EventData,Page, Frame } from "@nativescript/core";
import {check as checkPermission, isPermResultAuthorized, request as requestPermission, Status} from "@nativescript-community/perms"

import { createViewModel } from "./main-view-model";
import { BASE_URL, NAVIGATION_PATHS } from "./config";


let viewModel, connectionStatus:string,page

export async function onNavigatingTo(args: EventData) {
  try {
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
    await checkAndRequestPermissions()
  } catch (error) {

  }
}

export async function checkAndRequestPermissions() {
  try {
      const currentStatus = await checkPermission('location', { precise:true })
      if(currentStatus === Status.Undetermined){
          await requestPermission("location", {precise:true})
          const updateStatus = await checkPermission('location', { precise:true })
          console.log(updateStatus);
      }
  } catch (error) {
  console.log(error);
  }

}


export function navigateToHome(){
  Frame.topmost().navigate({
    moduleName: NAVIGATION_PATHS.HOME_PAGE
  })
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
