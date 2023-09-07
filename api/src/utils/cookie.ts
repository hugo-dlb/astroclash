// https://stackoverflow.com/questions/51812422/node-js-how-can-i-get-cookie-value-by-cookie-name-from-request
export const parseCookies = function (rawCookie: string): Record<string, string> {
    const cookies: Record<string, string> = {};

    rawCookie && rawCookie.split(";").forEach(function (cookie: string) {
        const parts: RegExpMatchArray | null = cookie.match(/(.*?)=(.*)$/);
        if (parts && parts.length) {
            cookies[parts[1].trim()] = (parts[2] || "").trim();
        }
    });

    return cookies;
};