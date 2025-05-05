import { Observable } from "@nativescript/core";
import { ApplicationSettings } from "@nativescript/core";


export function createViewModel() {
    const viewModel = new Observable();

    viewModel.set("mobileNumber", "");
    viewModel.set("enteredOtp", "");
    viewModel.set("generatedOtp", "");
    viewModel.set("message", "");
    viewModel.set("showOtpField", false);
    viewModel.set("sessionExists", ApplicationSettings.hasKey("name"));

    return viewModel;
}
