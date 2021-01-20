import { Box, compileGroup, Group, ImageData, Unit } from '../defs';

const enum DD { left, right }
export const enum DT { round, square, curly, floor, ceil, vert, dbvert, hidden }

export default class Delimiter implements Unit {
	constructor (
		readonly leftDelimiter: DT,
		readonly value: Group,
		readonly rightDelimiter = leftDelimiter,
	) { }

	compile (): Box {
		const val = compileGroup(this.value);
		const height = Math.max(val.height, 1);
		const depth = Math.max(val.depth, 1);
		const leftWidth = this.leftDelimiter === DT.hidden ? 0 : 2;
		const rightWidth = this.rightDelimiter === DT.hidden ? 0 : 2;

		return {
			render: (canvas, x, y) => {
				renderDelimiter(canvas, x, y, val, this.leftDelimiter, DD.left);
				x += leftWidth;
				val.render(canvas, x, y);
				x += val.width;
				renderDelimiter(canvas, x, y, val, this.rightDelimiter, DD.right);
			},
			width: val.width + leftWidth + rightWidth,
			height,
			depth,
			marginLeft: 1,
			marginRight: 1,
		};
	}
}

function renderDelimiter (
	canvas: ImageData,
	x: number,
	y: number,
	{ height, depth }: Box,
	delim: DT,
	dir: DD,
) {
	height = Math.max(height, 2);
	depth = Math.max(depth, 1);
	if (dir === DD.right) x++;

	switch (delim) {
		case DT.round:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '│');
			}

			canvas.draw(x, y - height + 1, dir === DD.left ? '╭' : '╮');
			canvas.draw(x, y + depth, dir === DD.left ? '╰' : '╯');
			break;

		case DT.square:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '│');
			}

			canvas.draw(x, y - height + 1, dir === DD.left ? '┌' : '┐');
			canvas.draw(x, y + depth, dir === DD.left ? '└' : '┘');
			break;

		case DT.floor:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '│');
			}

			canvas.draw(x, y - height + 1, '╷');
			canvas.draw(x, y + depth, dir === DD.left ? '└' : '┘');
			break;

		case DT.ceil:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '│');
			}

			canvas.draw(x, y - height + 1, dir === DD.left ? '┌' : '┐');
			canvas.draw(x, y + depth, dir === DD.left ? '╵' : '╵');
			break;

		case DT.curly:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '│');
			}

			canvas.draw(x, y - height + 1, dir === DD.left ? '╭' : '╮');
			canvas.draw(x, y + depth, dir === DD.left ? '╰' : '╯');
			// TODO: add dent
			break;

		case DT.vert:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '│');
			}

			break;

		case DT.dbvert:
			for (let i = -depth; i < height; i++) {
				canvas.draw(x, y - i, '║');
			}

			break;

		case DT.hidden: break;

		default: throw new Error('Invalid delimiter type');
	}
}
