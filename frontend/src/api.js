const BASE = "/api";

export async function fetchCountries() {
  const res = await fetch(`${BASE}/countries`);
  if (!res.ok) throw new Error("Failed to load countries");
  return res.json();
}

export async function fetchPeople(countryId, year) {
  const res = await fetch(`${BASE}/people?country_id=${countryId}&year=${year}`);
  if (!res.ok) throw new Error("Failed to load people");
  return res.json();
}

export async function fetchPersonDetail(personId) {
  const res = await fetch(`${BASE}/person/${personId}`);
  if (!res.ok) throw new Error("Failed to load person detail");
  return res.json();
}

export async function searchPeople(query) {
  const res = await fetch(`${BASE}/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}