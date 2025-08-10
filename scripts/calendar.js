export function initCalendar() {
    const monthCalendarElement = document.querySelector("[data-month-calendar]");

    document.addEventListener("view-change",
        (event) => {
            const selectedView = event.detail.view;

            //show month calendar when selectedView == month
            if (selectedView === "month") {
                monthCalendarElement.style.display = "flex";
            } else {
                monthCalendarElement.style.display = "none";
            }

        });

}