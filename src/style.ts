import { readFile } from 'fs/promises';
import { join } from 'path';
import { promisify } from 'util';
import { gunzip as _gunzip } from 'zlib';

export const databaseFile = join(__dirname, 'unicode.json.gz');
const gunzip = promisify(_gunzip);

export const enum FamilyName {
	rm, rmbf, rmit, rmbi,
	sf, sfbf, sfit, sfbi,
	sc, scbf, fr, frbf,
	bb, tt,
}

export namespace UnicodeDB {
	export interface DB {
		normals: {
			[x: string]: string;
		};
		variants: {
			[x: string]: {
				[K in FamilyName]?: string;
			};
		};
	}

	export let db: DB;

	export const promise: Promise<void> = readFile(databaseFile)
		.then(value => gunzip(value))
		.then(value => db = JSON.parse(value.toString('utf8')));
}

export interface Styler {
	apply: (char: string) => string;
}

export class Unicode implements Styler {
	constructor (
		readonly name: FamilyName,
	) { }

	apply (char: string): string {
		if (UnicodeDB.db == null) throw new Error('database is not ready');
		const normalChar = UnicodeDB.db.normals[char] ?? char;
		return UnicodeDB.db.variants[normalChar]?.[this.name] ?? normalChar;
	}
}

export class ANSI implements Styler {
	constructor (
		readonly bf: boolean,
		readonly it: boolean,
	) { }

	apply (char: string): string {
		const bfstr = this.bf ? 1 : 22;
		const itstr = this.it ? 3 : 23;
		return `\x1B[${bfstr};${itstr}m${char}\x1B[22;23m`;
	}
}
