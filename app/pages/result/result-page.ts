import { EventData, Page } from "@nativescript/core"

export function onNavigatedTo(args:EventData) {
    const page = <Page>args.object
    const context = page.navigationContext
    page.bindingContext = JSON.parse(context)
}
