import { compileGroup, ImageData, Sy } from './defs';
import Delimiter, { DT } from './units/delimit';
import Fraction from './units/fraction';
import Limit from './units/limit';
import Root from './units/root';
import Stack from './units/stack';
import Symbol from './units/symbol';
import Terminal, { OT } from './units/terminal';

const box = compileGroup([
	new Fraction([
		new Fraction([new Terminal('1')], [new Terminal('2')]),
	], [new Terminal('3')]),
	new Terminal('+', OT.binary),
	new Fraction([new Terminal('2')], [
		new Root([
			new Terminal('Sin', OT.fname),
			new Stack([
				new Delimiter(DT.round, [
					new Fraction([new Terminal(Sy.pi)], [new Terminal('2')])
				]),
			], [new Terminal('2')]),
			new Terminal('+', OT.binary),
			new Fraction([new Terminal('1')], [
				new Stack([
					new Terminal('-', OT.unary),
					new Terminal('2'),
				], [new Terminal('5')]),
			]),
		]),
	]),
	new Terminal('+', OT.binary),
	new Delimiter(DT.floor, [
		new Fraction([
			new Terminal('-', OT.unary),
			new Terminal('e'),
		], [new Terminal('4')]),
	]),
	new Terminal('+', OT.binary),
	new Limit(true, new Symbol(Sy.sum), new Stack([], [new Terminal('n')], [
		new Terminal('i'),
		new Terminal('=', OT.binary),
		new Terminal('1'),
	])),
	new Terminal('i'),
	new Terminal('+', OT.binary),
	new Delimiter(DT.floor, [new Terminal('n')]),
]);

const imgData = new ImageData(box.width, box.height, box.depth);
imgData.render(box);
output(imgData);


function output (imgData: ImageData) {
	process.stdout.write('\n ');

	for (const [i, value] of imgData.data.entries()) {
		process.stdout.write(value);

		// Line feed at end of line
		if (i % imgData.width === imgData.width - 1) {
			process.stdout.write('\n ');
		}
	}

	process.stdout.write('\n');
}
