import { Box, compileGroup, Group, Unit } from '../defs';

export default class Stack implements Unit {
	constructor (
		readonly sup: Group,
		readonly sub: Group,
	) {}

	compile (hsp = 1, dsp = 0): Box {
		const sup = compileGroup(this.sup);
		const sub = compileGroup(this.sub);

		return {
			render: (canvas, x, y) => {
				sup.render(canvas, x, y - sup.depth - hsp);
				sub.render(canvas, x, y + sub.height - dsp);
			},
			width: Math.max(sup.width, sub.width),
			height: sup.height + sup.depth + hsp,
			depth: sub.height + sub.depth + dsp,
			marginLeft: 0,
			marginRight: 0,
		};
	}
}
