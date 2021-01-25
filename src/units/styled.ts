import { Box, Unit } from '../defs';
import { Styler } from '../style';
import Terminal from './terminal';

export default class Styled implements Unit {
	readonly stylers: Styler[];

	constructor (
		readonly terminal: Terminal,
		...stylers: Styler[]
	) {
		this.stylers = stylers;
	}

	compile (): Box {
		const box = this.terminal.compile();

		return {
			...box,
			render: (canvas, x, y) => {
				let i = 0;

				for (const char of this.terminal.char) {
					canvas.draw(
						x + i++, y,
						this.stylers.reduce((ch, styler) => styler.apply(ch), char),
					);
				}
			},
		};
	}
}
