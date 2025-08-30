import { initCalendar } from "./calendar.js";
import { initViewSelect } from "./view-select.js";
import { initEventCreateButton } from "./event-create-button.js"
import { initEventFormDialog } from "./event-form-dialog.js";
import { initNotifications } from "./notifications.js";
import { initEventStore } from "./event-store.js";
import { initNav } from "./nav.js";
import { initEventDetailsDialog } from "./event-details-dialog.js";
import { initEventDeleteDialog } from "./event-delete-dialog.js";
import { initMiniCalendars } from "./mini-calendar.js";


const eventStore = initEventStore();

// initEventStore();
initCalendar(eventStore);
initEventCreateButton();
initEventFormDialog();
initNav();
initNotifications();
initViewSelect();
initEventDetailsDialog();
initEventDeleteDialog();
initMiniCalendars();

