
export const API_URL = "http://localhost:8000/api";

export async function getAccounts() {
  const res = await fetch(`${API_URL}/accounts/`);
  return res.json();
}

export async function sendMoney(data) {
  const res = await fetch(`${API_URL}/send/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
