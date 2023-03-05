export function padZero(data: string, length: number) {
    return data.padStart(data.length + (length - data.length % length), "0");
}