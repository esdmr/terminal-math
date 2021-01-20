import { Box, compileGroup, Group, Unit } from '../defs';

export default class Stack implements Unit {
	constructor (
		readonly value: Group,
		readonly superscript: Group,
		readonly subscript: Group = [],
	) { }

	compile (): Box {
		const val = compileGroup(this.value);
		const sup = compileGroup(this.superscript);
		const sub = compileGroup(this.subscript);
		const hsp = Math.max(val.height - 1, 1);
		const dsp = Math.max(val.depth - 1, 0);

		return {
			render: (canvas, x, y) => {
				val.render(canvas, x, y);
				x += val.width;
				sup.render(canvas, x, y - sup.depth - hsp);
				sub.render(canvas, x, y + sub.height - dsp);
			},
			width: val.width + Math.max(sup.width, sub.width),
			height: Math.max(val.height, sup.height + sup.depth + hsp),
			depth: Math.max(val.depth, sub.height + sub.depth + dsp),
			marginLeft: val.marginLeft,
			marginRight: val.marginRight,
		};
	}
}
