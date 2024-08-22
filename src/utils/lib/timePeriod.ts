export default async function getNextDay(): Promise<Date> {
    return new Date(Date.now() + 1000 * 60 * 60 * 24);
}
