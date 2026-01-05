export async function fetchAPI<T>(path: string): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json() as Promise<T>;
}