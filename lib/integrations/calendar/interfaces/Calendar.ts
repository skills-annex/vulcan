import { BookingStatus, DestinationCalendar, SelectedCalendar } from "@prisma/client";
import { TFunction } from "next-i18next";

import { PaymentInfo } from "@ee/lib/stripe/server";

import { Ensure } from "@lib/types/utils";
import { VideoCallData } from "@lib/videoClient";

import { NewCalendarEventType } from "../constants/types";
import { ConferenceData } from "./GoogleCalendar";

export type Person = {
  name: string;
  email: string;
  timeZone: string;
};

export interface EntryPoint {
  entryPointType?: string;
  uri?: string;
  label?: string;
  pin?: string;
  accessCode?: string;
  meetingCode?: string;
  passcode?: string;
  password?: string;
}

export interface AdditionInformation {
  conferenceData?: ConferenceData;
  entryPoints?: EntryPoint[];
  hangoutLink?: string;
}

export interface CalendarEvent {
  type: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string | null;
  references?: {
    id: number;
    type: string;
    uid: string;
    meetingId: string | null;
    meetingPassword: string | null;
    meetingUrl: string | null;
    bookingId: number | null;
  }[];
  team?: {
    name: string;
    members: string[];
  };
  location?: string | null;
  organizer: Person;
  attendees: Person[];
  conferenceData?: ConferenceData;
  language: TFunction;
  additionInformation?: AdditionInformation;
  uid?: string | null;
  videoCallData?: VideoCallData;
  paymentInfo?: PaymentInfo | null;
  destinationCalendar?: DestinationCalendar | null;
  status?: BookingStatus;
}

export interface IntegrationCalendar extends Ensure<Partial<SelectedCalendar>, "externalId"> {
  primary?: boolean;
  name?: string;
}

type EventBusyDate = Record<"start" | "end", Date | string>;

export interface Calendar {
  createEvent(event: CalendarEvent): Promise<NewCalendarEventType>;

  updateEvent(uid: string, event: CalendarEvent): Promise<any>;

  deleteEvent(uid: string): Promise<unknown>;

  getAvailability(
    dateFrom: string,
    dateTo: string,
    selectedCalendars: IntegrationCalendar[]
  ): Promise<EventBusyDate[]>;

  listCalendars(event?: CalendarEvent): Promise<IntegrationCalendar[]>;
}
