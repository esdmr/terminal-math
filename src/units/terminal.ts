import { Box, Unit } from '../defs';

export const enum OT { text, unary = 2, binary, fname }

export default class Terminal implements Unit {
	private readonly margin: number;
	private readonly length: number;

	constructor (
		readonly char: string,
		readonly type: OT = OT.text
	) {
		this.margin = type === OT.text || type === OT.unary ? 0 : 1;
		this.length = [...char].length;
	}

	compile (): Box {
		return {
			render: (canvas, x, y) => {
				let i = 0;

				for (const char of this.char) {
					canvas.draw(x + i++, y, char);
				}
			},
			width: this.length,
			height: 1,
			depth: 0,
			marginLeft: this.margin,
			marginRight: this.margin,
		};
	}
}
