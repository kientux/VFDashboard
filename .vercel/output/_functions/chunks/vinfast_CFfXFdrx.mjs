const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const DEFAULT_REGION = "vn";
const REGIONS = {
  us: {
    name: "United States",
    auth0_domain: "vinfast-us-prod.us.auth0.com",
    auth0_client_id: "xhGY7XKDFSk1Q22rxidvwujfz0EPAbUP",
    auth0_audience: "https://vinfast-us-prod.us.auth0.com/api/v2/",
    api_base: "https://mobile.connected-car.vinfastauto.us"
  },
  eu: {
    name: "Europe",
    auth0_domain: "vinfast-eu-prod.eu.auth0.com",
    auth0_client_id: "dxxtNkkhsPWW78x6s1BWQlmuCfLQrkze",
    auth0_audience: "https://vinfast-eu-prod.eu.auth0.com/api/v2/",
    api_base: "https://mobile.connected-car.vinfastauto.eu"
  },
  vn: {
    name: "Vietnam",
    auth0_domain: "vin3s.au.auth0.com",
    auth0_client_id: "jE5xt50qC7oIh1f32qMzA6hGznIU5mgH",
    auth0_audience: "https://vin3s.au.auth0.com/api/v2/",
    api_base: "https://mobile.connected-car.vinfast.vn"
  }
};
const API_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-SERVICE-NAME": "CAPP",
  "X-APP-VERSION": "2.17.5",
  "X-Device-Platform": "android",
  "X-Device-Family": "SM-F946B",
  "X-Device-OS-Version": "android 14",
  "X-Device-Locale": "vi-VN",
  "X-Timezone": "Asia/Ho_Chi_Minh",
  "X-Device-Identifier": "vfdashboard-community-edition",
  "X-IMEI": "",
  "User-Agent": "android - vfdashboard-community-edition - 2.17.5"
};
const MQTT_CONFIG = {
  vn: {
    endpoint: "prod.iot.connected-car.vinfast.vn",
    region: "ap-southeast-1",
    cognitoPoolId: "ap-southeast-1:c6537cdf-92dd-4b1f-99a8-9826f153142a",
    cognitoLoginProvider: "vin3s.au.auth0.com",
    heartbeatInterval: 12e4,
    // 2 minutes
    keepAlive: 300
    // seconds
  }
};
(() => {
  const proxies = [];
  const vercelUrl = typeof import.meta !== "undefined" && Object.assign(__vite_import_meta_env__, { _: process.env._ })?.VITE_BACKUP_PROXY_URL;
  if (vercelUrl) {
    proxies.push({
      baseUrl: vercelUrl.replace(/\/$/, ""),
      pathPrefix: "/api/vf-proxy"
    });
  }
  return proxies;
})();

export { API_HEADERS as A, DEFAULT_REGION as D, MQTT_CONFIG as M, REGIONS as R };
