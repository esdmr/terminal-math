export const enum Sy {
	pi = 'π',
	sum = 'Σ',
}

export const enum DD { left, right }
export const enum DT { round, square, curly, floor, ceil, vert, dbvert, hidden }
export const enum OT { text, unary = 2, binary, fname }
export const enum ST { rm, sf, sc, fr, tt, bb }

export interface ImageData {
	readonly draw: (x: number, y: number, value: string) => void;
	readonly data: string[];
	readonly width: number;
	readonly height: number;
}

export interface Box {
	readonly render: (canvas: ImageData, x: number, y: number) => void;
	readonly width: number;
	readonly height: number;
	readonly depth: number;
	readonly marginLeft: number;
	readonly marginRight: number;
}

export interface Unit {
	readonly compile: () => Box;
}

export type Group = readonly Unit[];

export function compileGroup (group: Group): Box {
	const len = group.length;
	if (len === 1) return group[0]!.compile();
	const boxes = group.map((unit) => unit.compile());

	const margins = boxes.map((box, i) => i >= len - 1 ? 0 : Math.max(box.marginRight, boxes[i + 1]!.marginLeft));

	let width = margins.reduce((a, b) => a + b);
	let height = 0;
	let depth = 0;

	for (const box of boxes) {
		width += box.width;
		height = Math.max(height, box.height);
		depth = Math.max(depth, box.depth);
	}

	return {
		render: (canvas, x, y) => {
			for (const [box, margin] of zip2(boxes.values(), margins.values())) {
				box.render(canvas, x, y);
				x += box.width +margin;
			}
		},
		width,
		height,
		depth,
		marginLeft: boxes[0]!.marginLeft,
		marginRight: boxes[len - 1]!.marginRight,
	}
}
