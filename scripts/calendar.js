export function initCalendar() {
    const monthCalendarElement = document.querySelector("[data-month-calendar]");
    const weekCalendarEvent = document.querySelector("[data-week-calendar]");

    document.addEventListener("view-change",
        (event) => {
            const selectedView = event.detail.view;

            //show month calendar when selectedView == month
            if (selectedView === "month") {
                monthCalendarElement.style.display = "flex";
                weekCalendarEvent.style.display = "none";
            } else if (selectedView === "week") {
                monthCalendarElement.style.display = "none";
                weekCalendarEvent.style.display = "flex";
            } else {
                monthCalendarElement.style.display = "none";
                weekCalendarEvent.style.display = "none";
            }

        });

}