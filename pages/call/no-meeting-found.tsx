import { XIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";

import { useLocale } from "@lib/hooks/useLocale";

import { HeadSeo } from "@components/seo/head-seo";
import Button from "@components/ui/Button";

export default function NoMeetingFound() {
  const { t } = useLocale();

  return (
    <div>
      <HeadSeo title={t("no_meeting_found")} description={t("no_meeting_found")} />
      <main className="max-w-3xl mx-auto my-24">
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 my-4 transition-opacity sm:my-0" aria-hidden="true">
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
              </span>
              <div
                className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                    <XIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-headline">
                      {t("no_meeting_found")}
                    </h3>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-center text-gray-500">{t("no_meeting_found_description")}</p>
                  </div>
                </div>
                <div className="mt-5 text-center sm:mt-6">
                  <div className="mt-5">
                    <Button data-testid="return-home" href="/bookings/upcoming" EndIcon={ArrowRightIcon}>
                      {t("go_back_home")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
