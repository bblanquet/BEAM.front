import axios, { AxiosError, AxiosResponse } from 'axios';
import { IApiService } from './IApiService';

export class ApiService implements IApiService {
	private _api: string = '{{server}}';

	constructor() {}

	public post<T1, T2>(route: string, body: T1, resultFunc: (e: T2) => void, errorFunc: (e: ApiError) => void): void {
		const conf: any = {
			headers: {
				Authorization: ''
			}
		};

		axios
			.post(`${this._api}/${route}`, body, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				this.handleError(error, errorFunc);
			});
	}

	public delete<T1, T2>(
		route: string,
		value: T1,
		resultFunc: (e: T2) => void,
		errorFunc: (e: ApiError) => void
	): void {
		const conf: any = {
			headers: {
				Authorization: ''
			},
			data: value
		};

		axios
			.delete(`${this._api}/${route}`, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				this.handleError(error, errorFunc);
			});
	}

	public get<T1, T2>(
		route: string,
		params: T1,
		resultFunc: (e: T2) => void,
		errorFunc: (e: ApiError) => void,
		extra?: any
	): void {
		const conf = extra ? extra : {};
		conf.headers = {
			Authorization: ''
		};
		if (params !== null) {
			conf.params = params;
		}

		axios
			.get(`${this._api}/${route}`, conf)
			.then((response: AxiosResponse<T2>) => {
				resultFunc(response.data);
			})
			.catch((error: AxiosError<ApiError>) => {
				this.handleError(error, errorFunc);
			});
	}

	private handleError(error: AxiosError<ApiError>, errorFunc: (e: ApiError) => void) {
		if (error.response && error.response.data && error.response.data.description && error.response.data.name) {
			errorFunc(error.response.data);
		} else if (error.response && error.response.data && typeof error.response.data === 'string') {
			const err = new ApiError();
			err.name = `${error.response.status}`;
			err.description = <string>(<unknown>error.response.data);
			errorFunc(err);
		} else {
			const err = new ApiError();
			err.name = error.name;
			err.description = error.message;
			errorFunc(err);
		}
	}
}

export class ApiError {
	public name: string;
	public description: string;
}
