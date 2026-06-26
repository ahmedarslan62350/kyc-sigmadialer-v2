export interface IpDetails {
  ip?: string;
  city?: string;
  region?: string; // state / province name
  postal?: string; // zip / postal code
  country_name?: string;
  country_code?: string; // ISO 2-letter, e.g. "US", "CA"
  country_calling_code?: string; // e.g. "+1"
  provider: string; // which provider answered, useful for debugging/logs
}

interface Provider {
  name: string;
  fetchAndNormalize: (signal: AbortSignal) => Promise<IpDetails>;
}

const TIMEOUT_MS = 4000;

async function fetchJson(url: string, signal: AbortSignal) {
  const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`);
  }
  return res.json();
}

const ipapiCo: Provider = {
  name: "ipapi.co",
  fetchAndNormalize: async (signal) => {
    const data = await fetchJson("https://ipapi.co/json/", signal);
    if (!data || data.error) {
      throw new Error(data?.reason || "ipapi.co returned an error payload");
    }
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      postal: data.postal,
      country_name: data.country_name,
      country_code: data.country_code,
      country_calling_code: data.country_calling_code,
      provider: "ipapi.co",
    };
  },
};

const ipwhoIs: Provider = {
  name: "ipwho.is",
  fetchAndNormalize: async (signal) => {
    const data = await fetchJson("https://ipwho.is/", signal);
    if (!data || data.success === false) {
      throw new Error(data?.message || "ipwho.is returned an error payload");
    }
    return {
      ip: data.ip,
      city: data.city,
      region: data.region,
      postal: data.postal,
      country_name: data.country,
      country_code: data.country_code,
      country_calling_code: data.calling_code ? `+${data.calling_code}` : undefined,
      provider: "ipwho.is",
    };
  },
};

const freeIpApi: Provider = {
  name: "freeipapi.com",
  fetchAndNormalize: async (signal) => {
    const data = await fetchJson("https://freeipapi.com/api/json/", signal);
    if (!data || !data.countryCode) {
      throw new Error("freeipapi.com returned an incomplete payload");
    }
    return {
      ip: data.ipAddress,
      city: data.cityName,
      region: data.regionName,
      postal: data.zipCode,
      country_name: data.countryName,
      country_code: data.countryCode,
      country_calling_code: undefined, // not provided by this API
      provider: "freeipapi.com",
    };
  },
};

const ipApiCom: Provider = {
  name: "ip-api.com",
  fetchAndNormalize: async (signal) => {
    const data = await fetchJson(
      "http://ip-api.com/json/?fields=status,message,query,city,region,regionName,zip,country,countryCode",
      signal
    );
    if (!data || data.status !== "success") {
      throw new Error(data?.message || "ip-api.com returned an error payload");
    }
    return {
      ip: data.query,
      city: data.city,
      region: data.regionName,
      postal: data.zip,
      country_name: data.country,
      country_code: data.countryCode,
      country_calling_code: undefined, // not provided by this API
      provider: "ip-api.com",
    };
  },
};

const PROVIDERS: Provider[] = [ipapiCo, ipwhoIs, freeIpApi, ipApiCom];

export async function getIp(): Promise<IpDetails> {
  const errors: string[] = [];

  for (const provider of PROVIDERS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const result = await provider.fetchAndNormalize(controller.signal);
      clearTimeout(timeout);
      return result;
    } catch (err: any) {
      clearTimeout(timeout);
      const reason = err?.message || "Unknown error";
      console.warn(`getIp: provider "${provider.name}" failed — ${reason}`);
      errors.push(`${provider.name}: ${reason}`);
      // continue to next provider
    }
  }

  throw new Error(`getIp: all providers failed — ${errors.join(" | ")}`);
}