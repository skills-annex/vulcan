import logger from "@lib/logger";

export interface ISendSms {
  email?: string;
  eventName?: string;
  instructorName?: string;
  meetingLink?: string;
  startTime?: string;
  timeToEvent?: string;
}

const sendSms = async (sms: ISendSms) => {
  const { email } = sms;
  const thetisSiteHost = process.env.THETIS_SITE_HOST;
  const thetisApiKey = process.env.THETIS_API_KEY;
  if (!thetisSiteHost) {
    logger.error("Missing config value for THETIS_SITE_HOST");
    return;
  }

  if (!thetisApiKey) {
    logger.error("Missing value for THETIS_API_KEY");
    return;
  }

  if (!email) {
    logger.error(`Unable to send SMS reminder to ${email}, missing email`);
  }

  try {
    const result = await fetch(`${thetisSiteHost}/api/twilio/send-sms`, {
      method: "POST",
      headers: {
        "x-api-key": thetisApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sms),
    });

    return result;
  } catch (e) {
    logger.error(e);
  }
};

export default sendSms;
