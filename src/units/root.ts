import { Box, compileGroup, Group, Unit } from '../defs';

export default class Root implements Unit {
	constructor (
		readonly radicant: Group,
		readonly degree: Group = [],
	) { }

	compile (): Box {
		const deg = compileGroup(this.degree);
		const rad = compileGroup(this.radicant);
		const degskip = Math.max(deg.width, 1);

		return {
			render: (canvas, x, y) => {
				// Tail
				canvas.draw(x + degskip - 1, y + rad.depth, '╲');

				// Side
				for (let i = 0; i < rad.depth + rad.height + 1; i++) {
					canvas.draw(x + degskip + i, y + rad.depth - i, '╱');
				}

				// Top
				for (let i = 0; i < rad.width + 2; i++) {
					canvas.draw(x + degskip + rad.depth + rad.height + 1 + i, y - rad.height - 1, '▁');
				}

				// Radicant
				rad.render(canvas, x + degskip + rad.depth + rad.height + 2, y);

				// Degree
				deg.render(canvas, x, y - 1 - deg.depth);
			},
			width: degskip + rad.depth + rad.height + rad.width + 3,
			height: Math.max(1 + deg.depth + deg.height, rad.height + 2),
			depth: rad.depth,
			marginLeft: 1,
			marginRight: 1,
		};
	}
}
