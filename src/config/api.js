// central API URI for the frontend to call backend endpoints
// const api_uri = "http://localhost:5000/api/";
const api_uri = "https://fhgeneralequipment.com/api/";

// base URI for static assets (images, uploads) — remove the trailing `/api/`
const base_uri = api_uri.replace(/\/api\/?$/, "/");

export { api_uri, base_uri };
export default api_uri;