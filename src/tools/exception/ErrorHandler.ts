import { LogKind } from '../logger/LogKind';
import { StaticLogger } from '../logger/StaticLogger';
import { Dictionary } from '../collections/Dictionary';

export enum ErrorCat {
	outOfRange,
	null,
	nullEmpty,
	invalidParameter,
	invalidType,
	unsupportedVariable,
	invalidComputation,
	methodNotImplemented
}

export class ErrorHandler {
	private static _lastErrorDate: number = undefined;
	private static _fiveSeconds = 5000;

	private static IsNewError(): boolean {
		const now = Date.now();
		const isNew = this._lastErrorDate === undefined || this._fiveSeconds < this._lastErrorDate - now;
		this._lastErrorDate = now;
		return isNew;
	}

	private static Cat: Dictionary<string> = Dictionary.New([
		{ key: ErrorCat[ErrorCat.null], value: 'null object' },
		{ key: ErrorCat[ErrorCat.outOfRange], value: 'out of range' },
		{ key: ErrorCat[ErrorCat.nullEmpty], value: 'null or empty array' },
		{ key: ErrorCat[ErrorCat.invalidParameter], value: 'invalid parameter' },
		{ key: ErrorCat[ErrorCat.invalidType], value: 'invalid type' },
		{ key: ErrorCat[ErrorCat.invalidComputation], value: 'invalid computation' },
		{ key: ErrorCat[ErrorCat.methodNotImplemented], value: 'Method not implemented' }
	]);

	public static Throw(cat: ErrorCat, message: string = ''): void {
		throw new Error(`[${this.Cat.Get(ErrorCat[cat])}] ${message}`);
	}

	public static Log(error: Error) {
		if (this.IsNewError()) {
			StaticLogger.Log(LogKind.error, `${error.message}\n${error.name}\n${error.stack}`);
		}
	}

	public static ThrowNullOrUndefined(obj: any): void {
		if (obj === undefined || obj === null) {
			const error = new Error('null exception');
			throw error;
		}
	}

	public static ThrowNullOrEmpty(obj: any[]): void {
		if (obj === undefined || obj === null || obj.length === 0) {
			const error = new Error('null/empty exception');
			throw error;
		}
	}
}
