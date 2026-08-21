/**
 * Portable storage layer.
 *
 * Mirrors the get/set/delete/list interface used during prototyping,
 * but persists to the browser's localStorage instead of a sandbox-only API,
 * so it works once this app is deployed on a real domain.
 *
 * IMPORTANT LIMITATION: localStorage is per-browser, per-device. Two people
 * (or the same person on two devices) will NOT see each other's data.
 * "Shared" keys behave the same as personal keys here — there is no real
 * multi-user backend yet. When you're ready to support real accounts across
 * devices, replace the calls below with fetch() calls to your own API
 * (see /api and README.md for the recommended next step: a real database).
 */

const PREFIX = "creatorai:";

function read(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  async get(key /*, shared */) {
    const value = read(key);
    if (value === null) return null;
    // Match the shape the app expects: { key, value: <json string> }
    return { key, value: JSON.stringify(value) };
  },
  async set(key, value /*, shared */) {
    const ok = write(key, JSON.parse(value));
    return ok ? { key, value } : null;
  },
  async delete(key /*, shared */) {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true };
  },
  async list(prefix = "" /*, shared */) {
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX + prefix))
      .map((k) => k.slice(PREFIX.length));
    return { keys };
  },
};
