import { EventScale } from "./event";

export enum DurationType {
  Passed = "passed", //already done.
  Now = "now", // in the duration of event.
  Soon = "soon", // in the same month of event start date.
  Next = "next", // not start yet but plan in this year.
  NextYear = "nextYear", // in the next year
}

export type SelectedFilterType = {
  onlyAvailable: boolean;
  eventScale: (typeof EventScale)[keyof typeof EventScale][];
};
