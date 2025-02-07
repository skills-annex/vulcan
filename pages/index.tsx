import { GetSessionParams } from "next-auth/react";

import { getSession } from "@lib/auth";

function RedirectPage() {
  return;
}

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);
  if (!session?.user?.id) {
    return { redirect: { permanent: false, destination: `${process.env.THETIS_SITE_HOST}/sign-in` } };
  }

  return { redirect: { permanent: false, destination: "/bookings/upcoming" } };
}

export default RedirectPage;
