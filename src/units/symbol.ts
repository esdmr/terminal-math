import { Box, Sy, Unit } from '../defs';

const symbols: { readonly [x in Sy]?: Box } = {
	[Sy.sum]: Object.freeze({
		render (canvas, x, y) {
			canvas.draw(x, y - 2, '▁');
			canvas.draw(x + 1, y - 2, '▁');
			canvas.draw(x + 2, y - 2, '▁');
			canvas.draw(x, y - 1, '╲');
			canvas.draw(x, y, '╱');
			canvas.draw(x, y + 1, '▔');
			canvas.draw(x + 1, y + 1, '▔');
			canvas.draw(x + 2, y + 1, '▔');
		},
		width: 3,
		height: 3,
		depth: 1,
		marginLeft: 0,
		marginRight: 0,
	}),
} as const;



export default class Symbol implements Unit {
	constructor (
		readonly char: Sy,
	) {
		if (!(char in symbols)) {
			throw new Error(`Symbol ${char} can not be enlargened. Use a text Terminal instead.`);
		}
	}

	compile (): Box {
		return symbols[this.char]!;
	}
}
