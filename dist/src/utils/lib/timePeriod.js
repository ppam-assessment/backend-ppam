export default async function getNextDay() {
    return new Date(Date.now() + 1000 * 60 * 60 * 24);
}
