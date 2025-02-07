import { ReminderType } from "@prisma/client";
import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

import { sendOrganizerRequestReminderEmail } from "@lib/emails/email-manager";
import { CalendarEvent } from "@lib/integrations/calendar/interfaces/Calendar";
import prisma from "@lib/prisma";

import { getTranslation } from "@server/lib/i18n";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const apiKey = req.headers.authorization || req.query.apiKey;
  if (process.env.CRON_API_KEY !== apiKey) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ message: "Invalid method" });
    return;
  }

  const reminderIntervalMinutes = [48 * 60, 24 * 60, 3 * 60];
  let notificationsSent = 0;
  for (const interval of reminderIntervalMinutes) {
    const bookings = await prisma.booking.findMany({
      where: {
        confirmed: false,
        rejected: false,
        createdAt: {
          lte: dayjs().add(-interval, "minutes").toDate(),
        },
      },
      select: {
        title: true,
        description: true,
        location: true,
        startTime: true,
        endTime: true,
        attendees: true,
        user: {
          select: {
            email: true,
            name: true,
            username: true,
            locale: true,
            timeZone: true,
          },
        },
        id: true,
        uid: true,
      },
    });

    const reminders = await prisma.reminderMail.findMany({
      where: {
        reminderType: ReminderType.PENDING_BOOKING_CONFIRMATION,
        referenceId: {
          in: bookings.map((b) => b.id),
        },
        elapsedMinutes: {
          gte: interval,
        },
      },
    });

    for (const booking of bookings.filter((b) => !reminders.some((r) => r.referenceId == b.id))) {
      const { user } = booking;
      const name = user?.name || user?.username;
      if (!user || !name || !user.timeZone) {
        console.error(`Booking ${booking.id} is missing required properties for booking reminder`, { user });
        continue;
      }

      const t = await getTranslation(user.locale ?? "en", "common");

      const evt: CalendarEvent = {
        type: booking.title,
        title: booking.title,
        description: booking.description || undefined,
        location: booking.location ?? "",
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
        organizer: {
          email: "support@theskills.com",
          name,
          timeZone: user.timeZone,
        },
        attendees: booking.attendees,
        uid: booking.uid,
        language: t,
      };

      await sendOrganizerRequestReminderEmail(evt);

      await prisma.reminderMail.create({
        data: {
          referenceId: booking.id,
          reminderType: ReminderType.PENDING_BOOKING_CONFIRMATION,
          elapsedMinutes: interval,
        },
      });
      notificationsSent++;
    }
  }
  res.status(200).json({ notificationsSent });
}
