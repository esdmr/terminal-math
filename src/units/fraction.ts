import { Box, compileGroup, Group, Unit } from '../defs';

export default class Fraction implements Unit {
	constructor (
		readonly numerator: Group,
		readonly denominator: Group,
	) { }

	compile (): Box {
		const num = compileGroup(this.numerator);
		const den = compileGroup(this.denominator);
		const width = Math.max(num.width, den.width);
		const numoff = (width - num.width) / 2 | 0;
		const denoff = (width - den.width) / 2 | 0;

		return {
			render: (canvas, x, y) => {
				num.render(canvas, x + 1 + numoff, y - num.depth - 1);
				den.render(canvas, x + 1 + denoff, y + den.height);

				for (let i = 0; i < width + 2; i++) {
					canvas.draw(x + i, y, '─');
				}
			},
			width: width + 2,
			height: num.height + num.depth + 1,
			depth: den.height + den.depth,
			marginLeft: 1,
			marginRight: 1,
		};
	}
}
