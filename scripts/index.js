import { initCalendar } from "./calendar.js";
import { initViewSelect } from "./view-select.js";
import { initEventCreateButton } from "./event-create-button.js"
import { initEventFormDialog } from "./event-form-dialog.js";
import { initNotifications } from "./notifications.js";
import { initEventStore } from "./event-store.js";



initEventStore();
initCalendar();
initEventCreateButton();
initEventFormDialog();
initNotifications();
initViewSelect();
