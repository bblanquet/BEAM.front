export function toReadableNumber(e: number) {
	return e.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
