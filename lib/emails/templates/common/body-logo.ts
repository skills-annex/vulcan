import { IS_PRODUCTION, BASE_URL } from "@lib/config/constants";

export const emailBodyLogo = (): string => {
  const image = IS_PRODUCTION
    ? `${BASE_URL}/emails/the-skills-logo-black.png`
    : "https://images.ctfassets.net/1qt0q58mfxo8/6xHsFPOLJUVWqEH8XUbq9c/419415185f681ad2d77688182522f83b/the-skills-logo-black_2.png";

  return `
  <!--[if mso | IE]></td></tr></table><table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" ><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]-->
  <div style="margin:0px auto;max-width:600px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
      <tbody>
        <tr>
          <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;">
            <!--[if mso | IE]><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td class="" style="vertical-align:top;width:600px;" ><![endif]-->
            <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                <tbody>
                  <tr>
                    <td align="center" style="font-size:0px;padding:10px 25px;padding-top:32px;word-break:break-word;">
                      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                        <tbody>
                          <tr>
                            <td style="width:150px;">
                              <a href="${BASE_URL}" target="_blank">
                                <img height="52" src="${image}" style="border:0;display:block;outline:none;text-decoration:none;height:52px;width:100%;font-size:13px;" width="150" />
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!--[if mso | IE]></td></tr></table><![endif]-->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `;
};
