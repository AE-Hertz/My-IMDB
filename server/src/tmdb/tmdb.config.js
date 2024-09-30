const baseUrl = process.env.TMDB_BASE_URL;
const key = process.env.TMDB_KEY;

console.log("TMDB Base URL:", baseUrl);
console.log("TMDB API Key:", key ? "API Key is set" : "API Key is missing");

const getUrl = (endpoint, params) => {
    const qs = new URLSearchParams(params);

    const constructedUrl = `${baseUrl}${endpoint}?api_key=${key}&${qs}`;

    console.log("Generated URL:", constructedUrl);

    return constructedUrl;
};

export default { getUrl };
