import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export async function http<T>(
    request: AxiosRequestConfig
): Promise<T> {
    const response: AxiosResponse<T> = await axios(request);
    return response.data;
}

export async function get<T>(
		url: string,
	): Promise<T> {
		return await http<T>({
            url: url,
            method: "GET"
        });
	};

export async function post<T>(
		url: string,
		body: any
	): Promise<T>  {

	return await http<T>({
        url: url,
        method: 'POST',
        data: body,
        headers: {"Content-Type": "application/json" }
    });
};

export async function put<T>(
    url: string,
    body: any
): Promise<T> {
    
    return await http<T>({
        url: url,
        method: 'PUT',
        data: body,
        headers: {"Content-Type": "application/json" }
    });
};

export async function remove<T>(
    url: string,
): Promise<T> {
    return await http<T>({
        url: url,
        method: "DELETE"
    });
};