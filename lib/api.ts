export async function fetchAPI<T>(endpoint: string, token?: string): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { headers });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json() as Promise<T>;
}

export async function postAPI<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

    if (!res.ok) throw new Error(await res.text());

    return res.json() as Promise<T>;
}

export async function patchAPI<T>(endpoint: string, body: unknown, token?: string): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) });

    if (!res.ok) throw new Error(await res.text());

    return res.json() as Promise<T>;
}

export async function deleteAPI(endpoint: string, token?: string): Promise<void> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(url, { method: 'DELETE', headers });

    if (!res.ok) throw new Error(await res.text());
}