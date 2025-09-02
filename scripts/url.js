import { today } from "./date.js";

//Example URL: http://127.0.0.1:5500/?view=day&date=2025-09-08T06%3A30%3A00.000Z
/*                                        |---|     |-------selectedDate-------|        
                                            ^
                                         selectedView
                                    |--------window.location.search------------|    
*/
export function initUrl() {
    let selectedView = getUrlView();
    let selectedDate = getUrlDate();

    function updateUrl() {
        const url = new URL(window.location);
        // console.log(url);

        /* Think of url.searchParams as an object that represents:

            {
            "view": "month",
            "date": "2025-09-04"
            }
        
        */

        url.searchParams.set("view", selectedView);     //Pick the 'view' parameter of the url and set its value to whatever the selectedView is (e.g day or week)
        url.searchParams.set("date", selectedDate.toISOString());   //Same for 'date' parameter

        //Update the browser’s address bar without reloading the page
        history.replaceState(null, "", url);
    }

    // Whenever there is a change in the view or the date, update the selectedView and selectedDate variables and (naturally) the URL.
    document.addEventListener("view-change", (event) => {
        selectedView = event.detail.view;
        updateUrl();
    });

    document.addEventListener("date-change", (event) => {
        selectedDate = event.detail.date;
        updateUrl();
    });
}

//Example URL: http://127.0.0.1:5500/?view=day&date=2025-09-08T06%3A30%3A00.000Z
/*                                  |--------||--------urlParams.get("date")---|        
                                          ^
                                    urlParams.get("view")
                                    |--------window.location.search------------|    

*/
export function getUrlView() {
    const urlParams = new URLSearchParams(window.location.search);

    return urlParams.get("view") || "month";        //default view is set to 'month'
}

export function getUrlDate() {
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get("date");

    return date ? new Date(date) : today();

}