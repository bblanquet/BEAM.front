import { ApiError } from './ApiService';

export interface IApiService {
	post<T1, T2>(route: string, body: T1, result: (r: T2) => void, errorCallback: (e: ApiError) => void): void;
	get<T1, T2>(
		route: string,
		params: T1,
		result: (r: T2) => void,
		errorCallback: (e: ApiError) => void,
		extra?: any
	): void;
	delete<T1, T2>(route: string, data: T1, result: (r: T2) => void, errorCallback: (e: ApiError) => void): void;
}
