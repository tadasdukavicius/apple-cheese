export async function fetchAPI<T>(endpoint: string): Promise<T> {
    const url = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;

    console.log('iiiitestastast', url)

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json() as Promise<T>;
}