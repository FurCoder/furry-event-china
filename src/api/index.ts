import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";

wretch.options({ mode: "cors" });

const HOST = "https://api.furryeventchina.com";

const wfetch = wretch(HOST, { cache: "default" })
  .auth(`Bearer ${process.env.FEC_API_TOKEN}`)
  .addon(QueryStringAddon);

export default wfetch;
