// TODO
// export const backendUrl = `${location.protocol}//192.168.1.246:${3010}`;
export const backendUrl = `http://192.168.1.246:${3010}`;
// export const backendUrl = `https://8549-104-28-230-247.ngrok-free.app`;

export interface ServersState {
    url: string;
    ping: number | null;
    online: boolean;
    name?: string;
    removeable: boolean;
}

// https://github.com/TanStack/query/discussions/562
export class FetchError extends Error {
    constructor(public res: Response, message?: string) {
        super(message);
    }
}

export const getFromBackend = async (pathSegments: string[] | string, token = "") => {
    let url: string;

    if (typeof pathSegments === "string") url = pathSegments;
    else url = `${backendUrl}/${pathSegments.join("/")}`;

    let res;
    try {
        console.log("GET ->", url);
        res = await fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (!res.ok) throw new FetchError(res, res.statusText);
    } catch (err) {
        // throw new Error("Failed to fetch");
        return { json: {}, ok: false };
    }

    const json = await res.json();
    return { json, ok: res.ok };
};

export const postToBackend = async (
    pathSegments: string[] | string,
    method = "POST",
    body = {},
    token = ""
) => {
    let url: string;

    if (typeof pathSegments === "string") url = pathSegments;
    else url = `${backendUrl}/${pathSegments.join("/")}`;

    let res;
    try {
        console.log("POST ->", url);
        res = await fetch(url, {
            method,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "same-origin",
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new FetchError(res, res.statusText);
    } catch (err) {
        // throw new Error("Failed to fetch");
        return { json: {}, ok: false };
    }

    const json = await res.json();
    console.log("<-", json);

    // Handle empty responses
    if (res.status === 204) return { json: {}, ok: res.ok };
    return { json, ok: res.ok };
};

export let netlifyUrl;
if (process.env.NODE_ENV === "development") {
    const { protocol, hostname, port } = window.location;
    netlifyUrl = `${protocol}//${hostname}:${Number(port) + 1}`;
} else netlifyUrl = `${window.location.origin}/.netlify/functions/ngrok`;

export const pingBackend = (url: string, timeout = 6000) => {
    const unreachableState: ServersState = {
        url,
        online: false,
        ping: null,
        removeable: false,
    };

    return new Promise((resolve, reject) => {
        const timeStart = new Date().getTime();
        try {
            fetch(url)
                .then((res) => {
                    const ping = new Date().getTime() - timeStart;

                    res.json().then(({ name }) => {
                        resolve({
                            url,
                            name,
                            online: true,
                            ping,
                        } as ServersState);
                    });
                })
                .catch(() => resolve(unreachableState));
            setTimeout(() => {
                resolve(unreachableState);
            }, timeout);
        } catch (e) {
            reject(e);
        }
    });
};
