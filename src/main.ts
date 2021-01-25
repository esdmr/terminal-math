import { compileGroup, ImageData, Sy } from './defs';
import { FamilyName, Unicode, UnicodeDB } from './style';
import Delimiter, { DT } from './units/delimit';
import Fraction from './units/fraction';
import Limit from './units/limit';
import Root from './units/root';
import Stack from './units/stack';
import Styled from './units/styled';
import Symbol from './units/symbol';
import Terminal, { OT } from './units/terminal';

function main () {
	const variable = new Unicode(FamilyName.rmit);

	const box = compileGroup([
		new Fraction([
			new Fraction([new Terminal('1')], [new Terminal('2')]),
		], [new Terminal('3')]),
		new Terminal('+', OT.binary),
		new Fraction([new Terminal('2')], [
			new Root([
				new Terminal('sin', OT.fname),
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
		new Limit(true, new Symbol(Sy.sum), new Stack([], [
			new Styled(new Terminal('n'), variable)
		], [
			new Styled(new Terminal('i'), variable),
			new Terminal('=', OT.binary),
			new Terminal('1'),
		])),
		new Styled(new Terminal('i'), variable),
		new Terminal('+', OT.binary),
		new Delimiter(DT.ceil, [new Styled(new Terminal('n'), variable)]),
	]);

	const imgData = new ImageData(box.width, box.height, box.depth);
	imgData.render(box);
	output(imgData);
}

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

UnicodeDB.promise.then(main, err => {
	console.error(err);
	process.exit(1);
});
