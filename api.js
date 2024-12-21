const BASE_URL = "http://localhost:8089/api/v1"; // Replace with your backend URL

/**
 * Helper function to make GET requests
 */
async function get(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("GET Request Failed:", error.message);
    throw error;
  }
}

/**
 * Helper function to make POST requests
 */
async function post(endpoint, data) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("POST Request Failed:", error.message);
    throw error;
  }
}

/**
 * Helper function to make DELETE requests
 */
async function del(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("DELETE Request Failed:", error.message);
    throw error;
  }
}

export { get, post, del };
