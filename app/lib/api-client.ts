const BASE_URL =
  "https://cinetrack-g3cufqgbd2erh6ad.swedencentral-01.azurewebsites.net/api";

//const BASE_URL = "http://localhost:5000/api";

export const apiClient = {
  async get<T>(
    path: string,
    defaultErrorMessage: string = "Failed to fetch data",
  ): Promise<T> {
    let data: unknown = null;

    console.log(`Fetching data from: ${BASE_URL}${path}`);
    const response = await fetch(`${BASE_URL}${path}`);

    const contentType = response.headers.get("Content-Type");
    if (contentType?.includes("application/json")) {
      data = await response.json();
    }
    if (!response.ok) {
      const errorMessage = (data as any)?.error || defaultErrorMessage;
      throw new Error(errorMessage);
    }

    return data as T;
  },
};
