export const EMPTY_BUFFER = Buffer.alloc(0);

export function padStart(data: string[], length: number): string[] {
    return Array(length - data.length % length).fill("0").concat(data).reduce((a: string[], x: string, i: number) => {
        if (i % length == 0) a.push(x);
        else a[a.length - 1] += x;
        return a;
    }, []);
}

export function padEnd(data: string[], length: number): string[] {
    return data.concat(Array(length - data.length % length).fill("=")).reduce((a: string[], x: string, i: number) => {
        if (i % length == 0) a.push(x);
        else a[a.length - 1] += x;
        return a;
    }, []);
}
