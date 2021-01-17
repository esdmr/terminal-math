export { };

const enum Sy {
	pi = 'π',
	sum = 'Σ',
}

const enum DD { left, right }
const enum DT { round, square, curly, floor, ceil, vert, dbvert, hidden }
const enum OT { text, unary = 2, binary, fname }
const enum ST { rm, sf, sc, fr, tt, bb }
const enum UT { null, terminal, styled, stack, fraction, root, delimit, limit, symbol }

interface Terminal {
	readonly type: UT.terminal;
	readonly op: OT;
	readonly ch: string;
}

interface Styled {
	readonly type: UT.styled;
	readonly op: OT;
	readonly ch: string;
	readonly tf: ST;
	readonly bf: boolean;
	readonly it: boolean;
}

interface Stack {
	readonly type: UT.stack;
	readonly sup: Group;
	readonly sub: Group;
}

interface Fraction {
	readonly type: UT.fraction;
	readonly num: Group;
	readonly den: Group;
}

interface Root {
	readonly type: UT.root;
	readonly rad: Group;
	readonly deg: Group;
}

interface Delimiter {
	readonly type: UT.delimit;
	readonly del: DT;
	readonly rdl: DT;
	readonly val: Group;
	/** Automatic vspace for stack. */
	readonly stk: Stack | null;
}

interface Limit {
	readonly type: UT.limit;
	/** Limits at above and below */
	readonly lim: boolean;
	readonly val: Terminal | Styled | Symbol;
	readonly stk: Stack;
}

interface Symbol {
	readonly type: UT.symbol;
	readonly ch: Sy;
}

interface NullBox {
	readonly type: UT.null;
}

type Unit = Terminal | Styled | Stack | Fraction | Root | Delimiter | NullBox | Limit | Symbol;
type Group = readonly Unit[];

interface ImageData {
	data: string[];
	width: number;
	height: number;
}

interface Box {
	render: (canvas: ImageData, x: number, y: number) => void;
	width: number;
	height: number;
	depth: number;
	marginStart: number;
	marginEnd: number;
}

const box = compileGroup([
	{
		type: UT.fraction,
		num: [{
			type: UT.fraction,
			num: [{ type: UT.terminal, op: OT.text, ch: '1' }],
			den: [{ type: UT.terminal, op: OT.text, ch: '2' }],
		}],
		den: [{ type: UT.terminal, op: OT.text, ch: '3' }],
	},
	{ type: UT.terminal, op: OT.binary, ch: '+' },
	{
		type: UT.fraction,
		num: [{ type: UT.terminal, op: OT.text, ch: '2' }],
		den: [{
			type: UT.root,
			deg: [],
			rad: [
				{ type: UT.terminal, op: OT.fname, ch: 'Sin' },
				{
					type: UT.delimit,
					del: DT.round,
					rdl: DT.round,
					val: [{
						type: UT.fraction,
						num: [{ type: UT.terminal, op: OT.text, ch: Sy.pi }],
						den: [{ type: UT.terminal, op: OT.text, ch: '2' }]
					}],
					stk: {
						type: UT.stack,
						sup: [{ type: UT.terminal, op: OT.text, ch: '2' }],
						sub: []
					}
				},
				{ type: UT.terminal, op: OT.binary, ch: '+' },
				{
					type: UT.fraction,
					num: [{ type: UT.terminal, op: OT.text, ch: '1' }],
					den: [
						{ type: UT.terminal, op: OT.text, ch: '-2' },
						{
							type: UT.stack,
							sup: [{ type: UT.terminal, op: OT.text, ch: '5' }],
							sub: [],
						}
					]
				}
			]
		}],
	},
	{ type: UT.terminal, op: OT.binary, ch: '+' },
	{
		type: UT.delimit,
		del: DT.floor,
		rdl: DT.floor,
		val: [{
			type: UT.fraction,
			num: [
				{ type: UT.terminal, op: OT.unary, ch: '-' },
				{ type: UT.terminal, op: OT.text, ch: 'e' },
			],
			den: [{ type: UT.terminal, op: OT.text, ch: '4' }],
		}],
		stk: null,
	},
	{ type: UT.terminal, op: OT.binary, ch: '+' },
	{
		type: UT.limit,
		lim: true,
		val: { type: UT.symbol, ch: Sy.sum },
		stk: {
			type: UT.stack,
			sup: [
				{ type: UT.terminal, op: OT.text, ch: 'n' }
			],
			sub: [
				{ type: UT.terminal, op: OT.text, ch: 'i' },
				{ type: UT.terminal, op: OT.binary, ch: '=' },
				{ type: UT.terminal, op: OT.text, ch: '1' }
			]
		}
	},
	{ type: UT.terminal, op: OT.text, ch: 'i' },
	{ type: UT.terminal, op: OT.binary, ch: '+' },
	{
		type: UT.delimit, del: DT.floor, rdl: DT.floor, stk: null, val: [
			{ type: UT.terminal, op: OT.text, ch: 'n' }
		]
	},
]);

const canvas = {
	data: new Array<string>(box.width * (box.height + box.depth)).fill(' '),
	width: box.width,
	height: box.height + box.depth,
};

box.render(canvas, 0, box.height - 1);
// console.log({ canvas });
// console.log(inspect(box, { depth: Infinity, colors: true }));
// process.stdout.cork();
process.stdout.write('\n ');

for (const [i, value] of canvas.data.entries()) {
	process.stdout.write(value);

	// Line feed at end of line
	if (i % canvas.width === canvas.width - 1) {
		process.stdout.write('\n ');
	}
}

process.stdout.write('\n');
// process.stdout.uncork();

function compileGroup (group: Group): Box {
	const len = group.length;
	if (len === 1) return compileUnit(group[0]!);
	const boxes = group.map((unit) => compileUnit(unit));

	for (let i = 0; i < len - 1; i++) {
		boxes[i]!.marginEnd = Math.max(boxes[i]!.marginEnd, boxes[i + 1]!.marginStart);
		boxes[i + 1]!.marginStart = 0;
	}

	const marginStart = boxes[0]?.marginStart ?? 0;
	const marginEnd = boxes[len - 1]?.marginEnd ?? 0;

	if (len > 0) {
		boxes[0]!.marginStart = 0;
		boxes[len - 1]!.marginEnd = 0;
	}

	return boxes.reduce((total, next) => {
		total.width += next.marginStart + next.width + next.marginEnd;
		total.height = Math.max(total.height, next.height);
		total.depth = Math.max(total.depth, next.depth);

		return total;
	}, {
		render (canvas, x, y) {
			for (const box of boxes) {
				x += box.marginStart;
				box.render(canvas, x, y);
				x += box.width;
				x += box.marginEnd;
			}
		},
		width: 0,
		height: 0,
		depth: 0,
		marginStart,
		marginEnd,
	});
}

function compileUnit (unit: Unit): Box {
	switch (unit.type) {
		case UT.null: {
			return {
				render () { },
				width: 0,
				height: 0,
				depth: 0,
				marginStart: 0,
				marginEnd: 0,
			};
		}

		case UT.terminal: {
			const margin = unit.op === OT.text || unit.op === OT.unary ? 0 : 1;

			return {
				render (canvas, x, y) {
					let i = 0;

					for (const char of unit.ch) {
						canvas.data[x + y * canvas.width + i++] = char;
					}
				},
				width: [...unit.ch].length,
				height: 1,
				depth: 0,
				marginStart: margin,
				marginEnd: margin,
			};
		}

		case UT.stack: return compileStack(unit);

		case UT.fraction: {
			const num = compileGroup(unit.num);
			const den = compileGroup(unit.den);
			const width = Math.max(num.width, den.width);
			const numOffset = (width - num.width) / 2 | 0;
			const denomOffset = (width - den.width) / 2 | 0;

			return {
				render (canvas, x, y) {
					num.render(canvas, x + 1 + numOffset, y - num.depth - 1);
					den.render(canvas, x + 1 + denomOffset, y + den.height);

					for (let i = 0; i < width + 2; i++) {
						canvas.data[x + y * canvas.width + i] = '─';
					}
				},
				width: width + 2,
				height: num.height + num.depth + 1,
				depth: den.height + den.depth,
				marginStart: 1,
				marginEnd: 1,
			};
		}

		case UT.root: {
			/*
			 *    ▁▁▁
			 *   ╱
			 * ╲╱  2
			 */
			const rad = compileGroup(unit.rad);
			const deg = compileGroup(unit.deg);
			const degSkip = Math.max(deg.width, 1);

			return {
				render (canvas, x, y) {
					// Tail
					canvas.data[x + degSkip - 1 + (y + rad.depth) * canvas.width] = '╲';

					// Side
					for (let i = 0; i < rad.depth + rad.height + 1; i++) {
						canvas.data[x + degSkip + i + (y + rad.depth - i) * canvas.width] = '╱';
					}

					// Top
					for (let i = 0; i < rad.width + 2; i++) {
						canvas.data[x + degSkip + rad.depth + rad.height + 1 + i + (y - rad.height - 1) * canvas.width] = '▁';
					}

					// Radicant
					rad.render(canvas, x + degSkip + rad.depth + rad.height + 2, y);

					// Degree
					deg.render(canvas, x, y - 1 - deg.depth);
				},
				width: degSkip + rad.depth + rad.height + rad.width + 3,
				height: Math.max(1 + deg.depth + deg.height, rad.height + 2),
				depth: rad.depth,
				marginStart: 1,
				marginEnd: 1,
			};
		}

		case UT.delimit: {
			const val = compileGroup(unit.val);
			const height = val.height;
			const depth = val.depth;
			const totalHeight = height + depth;
			const delWidth = unit.del === DT.hidden ? 0 : totalHeight === 1 ? 1 : 2;
			const rdlWidth = unit.rdl === DT.hidden ? 0 : totalHeight === 1 ? 1 : 2;

			// if (unit.stk != null) {
			// 	unit.stk.hsp = Math.max(height - 1, 1);
			// 	unit.stk.dsp = depth;
			// }

			// const stk = compileUnit(unit.stk ?? { type: UT.null });

			const stk = unit.stk == null ? compileUnit({ type: UT.null }) : compileStack(unit.stk, Math.max(height - 1, 1), depth);

			return {
				render (canvas, x, y) {
					x += renderDelimiter(canvas, x, y, val, unit.del, DD.left);
					val.render(canvas, x, y);
					x += val.width;
					x += renderDelimiter(canvas, x, y, val, unit.rdl, DD.right);
					stk.render(canvas, x, y);
				},
				width: val.width + delWidth + rdlWidth + stk.width,
				height: Math.max(height, stk.height),
				depth: Math.max(depth, stk.depth),
				marginStart: 1,
				marginEnd: 1,
			};
		}

		case UT.limit: {
			const val = compileUnit(unit.val);
			const sup = compileGroup(unit.stk.sup);
			const sub = compileGroup(unit.stk.sub);
			const stkWidth = Math.max(sup.width, sub.width);
			const dsp = Math.max(val.depth - 1, 0);
			const hsp = Math.max(val.height - 1, 1);

			const width = unit.lim ? Math.max(val.width, stkWidth) : val.width + stkWidth;
			const height = unit.lim
				? sup.height + sup.depth + val.height
				: Math.max(val.height, sup.height + sup.depth + hsp);

			const depth = unit.lim
				? val.depth + sub.height + sub.depth
				: Math.max(val.depth, sub.height + sub.depth + dsp);

			const limvaloff = (width - val.width) / 2 | 0;
			const limsupoff = (width - sup.width) / 2 | 0;
			const limsuboff = (width - sub.width) / 2 | 0;

			return {
				render: unit.lim ? (canvas, x, y) => {
					val.render(canvas, x + limvaloff, y);
					sup.render(canvas, x + limsupoff, y - sup.depth - val.height);
					sub.render(canvas, x + limsuboff, y + sub.height + val.depth);
				} : (canvas, x, y) => {
					val.render(canvas, x, y);
					x += val.width;
					sup.render(canvas, x, y - sup.depth - hsp);
					sub.render(canvas, x, y + sub.height + dsp);
				},
				width,
				height,
				depth,
				marginStart: 0,
				marginEnd: 0,
			};
		}

		case UT.symbol: return compileSymbol(unit);

		default: throw new Error('Invalid unit type');
	}
}

function compileStack (unit: Stack, hsp = 1, dsp = 0): Box {
	const sup = compileGroup(unit.sup);
	const sub = compileGroup(unit.sub);

	return {
		render (canvas, x, y) {
			sup.render(canvas, x, y - sup.depth - hsp);
			sub.render(canvas, x, y + sub.height + dsp);
		},
		width: Math.max(sup.width, sub.width),
		height: sup.height + sup.depth + hsp,
		depth: sub.height + sub.depth + dsp,
		marginStart: 0,
		marginEnd: 0,
	};
}

function renderDelimiter (
	canvas: ImageData,
	x: number,
	y: number,
	val: Box,
	delim: DT,
	dir: DD,
) {
	const totalHeight = val.depth + val.height;
	const delimWidth = delim === DT.hidden ? 0 : totalHeight === 1 ? 1 : 2;
	if (totalHeight < 1) return delimWidth;
	if (dir === DD.right && totalHeight > 1) x++;

	switch (delim) {
		case DT.round: {
			if (totalHeight === 1) {
				canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '(' : ')';
				break;
			}

			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '│';
			}

			canvas.data[x + (y - val.height + 1) * canvas.width] = dir === DD.left ? '╭' : '╮';
			canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '╰' : '╯';
			break;
		}

		case DT.square: {
			if (totalHeight === 1) {
				canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '[' : ']';
				break;
			}

			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '│';
			}

			canvas.data[x + (y - val.height + 1) * canvas.width] = dir === DD.left ? '┌' : '┐';
			canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '└' : '┘';
			break;
		}

		case DT.floor: {
			if (totalHeight === 1) {
				canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '⌊' : '⌋';
				break;
			}

			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '│';
			}

			canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '└' : '┘';
			break;
		}

		case DT.ceil: {
			if (totalHeight === 1) {
				canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '⌈' : '⌉';
				break;
			}

			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '│';
			}

			canvas.data[x + (y - val.height + 1) * canvas.width] = dir === DD.left ? '┌' : '┐';
			break;
		}

		case DT.curly: {
			if (totalHeight === 1) {
				canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '{' : '}';
				break;
			}

			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '│';
			}

			canvas.data[x + (y - val.height + 1) * canvas.width] = dir === DD.left ? '╭' : '╮';
			canvas.data[x + (y + val.depth) * canvas.width] = dir === DD.left ? '╰' : '╯';
			// TODO: add dent
			break;
		}

		case DT.vert: {
			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '│';
			}

			break;
		}

		case DT.dbvert: {
			for (let i = -val.depth; i < val.height; i++) {
				canvas.data[x + (y - i) * canvas.width] = '║';
			}

			break;
		}

		case DT.hidden: break;

		default: throw new Error('Invalid delimiter type');
	}

	return delimWidth;
}

function compileSymbol ({ ch }: Symbol): Box {
	switch (ch) {
		case Sy.sum: {
			return {
				render (canvas, x, y) {
					canvas.data[x + (y - 2) * canvas.width] = '▁';
					canvas.data[x + 1 + (y - 2) * canvas.width] = '▁';
					canvas.data[x + 2 + (y - 2) * canvas.width] = '▁';
					canvas.data[x + (y - 1) * canvas.width] = '╲';
					canvas.data[x + y * canvas.width] = '╱';
					canvas.data[x + (y + 1) * canvas.width] = '▔';
					canvas.data[x + 1 + (y + 1) * canvas.width] = '▔';
					canvas.data[x + 2 + (y + 1) * canvas.width] = '▔';
				},
				width: 3,
				height: 3,
				depth: 1,
				marginStart: 0,
				marginEnd: 0,
			};
		}

		default: throw new Error(`Symbol ${ch} can not be enlargened. Use a text Terminal instead.`);
		// default: return compileUnit({ type: UT.terminal, op: OT.text, ch });
	}
}
