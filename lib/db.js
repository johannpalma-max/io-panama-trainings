// Capa de datos. Usa Redis (vía REDIS_URL, p.ej. la integración Upstash de
// Vercel) si está disponible; si no, cae a un store en memoria sembrado con
// los defaults.
//
// El store en memoria NO persiste entre invocaciones serverless: sirve para
// ver el sitio funcionando antes de conectar la base de datos. En producción
// se usa REDIS_URL.

import Redis from "ioredis";
import { defaultSettings, defaultTopics } from "./seed";

const REDIS_URL = process.env.REDIS_URL || process.env.KV_URL;

export const hasPersistentDb = Boolean(REDIS_URL);

// ---- Cliente Redis (singleton reutilizado entre invocaciones tibias) ----
function getClient() {
  if (!REDIS_URL) return null;
  if (!globalThis.__ioRedis) {
    globalThis.__ioRedis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });
  }
  return globalThis.__ioRedis;
}

// ---- Store en memoria (fallback) ----
const mem = globalThis.__ioMemStore || (globalThis.__ioMemStore = {});

async function rawGet(key) {
  const client = getClient();
  if (client) {
    const v = await client.get(key);
    return v == null ? undefined : JSON.parse(v);
  }
  return key in mem ? mem[key] : undefined;
}

async function rawSet(key, value) {
  const client = getClient();
  if (client) {
    await client.set(key, JSON.stringify(value));
    return;
  }
  mem[key] = value;
}

// ---- API de alto nivel ----
export async function getSettings() {
  const s = await rawGet("settings");
  if (!s) return { ...defaultSettings };
  return { ...defaultSettings, ...s };
}

export async function saveSettings(settings) {
  await rawSet("settings", settings);
  return settings;
}

export async function getTopics() {
  const t = await rawGet("topics");
  if (!t) return [...defaultTopics];
  return t;
}

export async function getTopicBySlug(slug) {
  const topics = await getTopics();
  return topics.find((t) => t.slug === slug) || null;
}

export async function saveTopics(topics) {
  await rawSet("topics", topics);
  return topics;
}

export async function getBookings() {
  const b = await rawGet("bookings");
  return b || [];
}

export async function saveBookings(bookings) {
  await rawSet("bookings", bookings);
  return bookings;
}

export async function addBooking(booking) {
  const bookings = await getBookings();
  bookings.unshift(booking);
  await saveBookings(bookings);
  return booking;
}

export async function updateBooking(id, patch) {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...patch };
  await saveBookings(bookings);
  return bookings[idx];
}

// ---- Miembros ----
export async function getMembers() {
  const m = await rawGet("members");
  return m || {};
}

export async function getMember(email) {
  if (!email) return null;
  const members = await getMembers();
  return members[email.toLowerCase()] || null;
}

export async function saveMember(member) {
  const members = await getMembers();
  const email = member.email.toLowerCase();
  members[email] = { ...members[email], ...member, email };
  await rawSet("members", members);
  return members[email];
}

export async function getBookingsByEmail(email) {
  if (!email) return [];
  const bookings = await getBookings();
  const e = email.toLowerCase();
  return bookings.filter((b) => (b.requesterEmail || "").toLowerCase() === e);
}
