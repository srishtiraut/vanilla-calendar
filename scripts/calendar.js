import { today } from './date.js';
import { initMonthCalendar } from './month-calendar.js';

export function initCalendar() {
    const calendarElement = document.querySelector("[data-calendar]");

    let selectedView = "month";
    let selectedDate = today();

    function refreshCalendar() {
        //show month calendar when selectedView == month
        if (selectedView === "month") {
            initMonthCalendar(calendarElement, selectedDate);
        } else if (selectedView === "week") {
            monthCalendarElement.style.display = "none";
            weekCalendarEvent.style.display = "flex";
            dayCalendarEvent.style.display = "none";
        } else {
            monthCalendarElement.style.display = "none";
            weekCalendarEvent.style.display = "none";
            dayCalendarEvent.style.display = "flex";
        }
    }

    document.addEventListener("view-change",
        (event) => {
            selectedView = event.detail.view;
            refreshCalendar();
        });

    document.addEventListener("date-change", (event) => {
        selectedDate = event.detail.date;
        refreshCalendar();
    });

    refreshCalendar();
}