const calendarTemplateElement = document.querySelector("[data-template='month-calendar']");

const calendarDayTemplateElement = document.querySelector("[data-template='month-calendar-day']");

export function initMonthCalendar(parent, selectedDate) {
    const calendarContent = calendarTemplateElement.content.cloneNode(true);
    const calendarElement = calendarContent.querySelector("[data-month-calendar]");
    const calendarDayListElement = calendarElement.querySelector("[data-month-calendar-day-list]");

    console.log(calendarElement);

    parent.appendChild(calendarContent);

}