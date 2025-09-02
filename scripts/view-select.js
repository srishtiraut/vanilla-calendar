import { getUrlView } from "./url.js";

export function initViewSelect() {

    // Pick the View Selector element from the navbar at the calendar top
    const viewSelectElement = document.querySelector("[data-view-select]")

    viewSelectElement.value = getUrlView();     // Set the selector's value based on the current URL. By default, it is 'month'.

    // Whenever the option in the View Selector is changed, fire a customEvent to announce that a view change happened AND other modules that are listening should set the calendarView to the option selected in the selector(for eg. week)
    viewSelectElement.addEventListener("change", (event) => {
        viewSelectElement.dispatchEvent(
            new CustomEvent("view-change", {
                detail: {
                    view: viewSelectElement.value
                },
                bubbles: true
            }));
    });

    // Update the selector to display the latest selected option
    document.addEventListener("view-change", (event) => {
        viewSelectElement.value = event.detail.view;
    });
}