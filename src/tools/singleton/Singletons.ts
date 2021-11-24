import { Dictionary } from '../collections/Dictionary';
import { ErrorCat, ErrorHandler } from '../exception/ErrorHandler';
import { LogKind } from '../logger/LogKind';
import { StaticLogger } from '../logger/StaticLogger';

export class Singletons {
	private static _singletons: Dictionary<any> = new Dictionary<any>();
	public static Register(key: SingletonKey, obj: any): void {
		StaticLogger.Log(LogKind.info, `${SingletonKey[key]}`);
		if (this._singletons.Exist(SingletonKey[key])) {
			ErrorHandler.Throw(ErrorCat.invalidParameter, `Singleton already exist ${SingletonKey[key]}`);
		}
		this._singletons.Add(key.toString(), obj);
	}
	public static Load<T>(key: SingletonKey): T {
		return (this._singletons.Get(key.toString()) as any) as T;
	}
}

export enum SingletonKey {
	user,
	api,
	notification
}
