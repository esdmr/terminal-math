import { Box, compileGroup, Unit } from '../defs';
import Stack from './stack';
import Symbol from './symbol';
import Terminal from './terminal';

export default class Limit implements Unit {
	constructor (
		readonly limits: boolean,
		readonly value: Terminal | Symbol,
		readonly stack: Stack,
	) { }

	compile (): Box {
		return this.limits ? this.compileLimits() : this.compileNoLimits();
	}

	private compileLimits (): Box {
		const val = this.value.compile();
		const sup = compileGroup(this.stack.superscript);
		const sub = compileGroup(this.stack.subscript);
		const width = Math.max(val.width, sup.width, sub.width);
		const limvaloff = (width - val.width) / 2 | 0;
		const limsupoff = (width - sup.width) / 2 | 0;
		const limsuboff = (width - sub.width) / 2 | 0;

		return {
			render: (canvas, x, y) => {
				val.render(canvas, x + limvaloff, y);
				sup.render(canvas, x + limsupoff, y - sup.depth - val.height);
				sub.render(canvas, x + limsuboff, y + sub.height + val.depth);
			},
			width,
			height: sup.height + sup.depth + val.height,
			depth: val.depth + sub.height + sub.depth,
			marginLeft: val.marginLeft,
			marginRight: val.marginRight,
		};
	}

	private compileNoLimits (): Box {
		const val = this.value.compile();
		const sup = compileGroup(this.stack.superscript);
		const sub = compileGroup(this.stack.subscript);
		const dsp = Math.max(val.depth - 1, 0);
		const hsp = Math.max(val.height - 1, 1);

		return {
			render: (canvas, x, y) => {
				val.render(canvas, x, y);
				x += val.width;
				sup.render(canvas, x, y - sup.depth - hsp);
				sub.render(canvas, x, y + sub.height + dsp);
			},
			width: val.width + Math.max(sup.width, sub.width),
			height: Math.max(val.height, sup.height + sup.depth + hsp),
			depth: Math.max(val.depth, sub.height + sub.depth + dsp),
			marginLeft: val.marginLeft,
			marginRight: val.marginRight,
		};
	}
}
