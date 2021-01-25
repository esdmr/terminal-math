import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { gzip as _gzip } from 'zlib';
import { databaseFile, FamilyName } from './style';

interface GeneratorItem {
	readonly name: FamilyName;
	readonly from: string;
	readonly to: string;
	readonly convert: string;
	readonly exceptions: Readonly<Record<string, string>>;
}

/// @ts-expect-error 2339
Map.prototype.toJSON = function toJSON<K extends string | number | symbol, V> (this: Map<K, V>) {
	const object: Partial<Record<K, V>> = {};

	for (const [key, value] of this.entries()) {
		object[key] = value;
	}

	return object as Record<K, V>;
};

const gzip = promisify(_gzip);

const generatorData: readonly GeneratorItem[] = [
	{ name: FamilyName.rmbf, from: 'A', to: 'Z', convert: '𝐀', exceptions: {} },
	{ name: FamilyName.rmit, from: 'A', to: 'Z', convert: '𝐴', exceptions: {} },
	{ name: FamilyName.rmbi, from: 'A', to: 'Z', convert: '𝑨', exceptions: {} },
	{ name: FamilyName.sf, from: 'A', to: 'Z', convert: '𝖠', exceptions: {} },
	{ name: FamilyName.sfbf, from: 'A', to: 'Z', convert: '𝗔', exceptions: {} },
	{ name: FamilyName.sfit, from: 'A', to: 'Z', convert: '𝘈', exceptions: {} },
	{ name: FamilyName.sfbi, from: 'A', to: 'Z', convert: '𝘼', exceptions: {} },
	{
		name: FamilyName.sc, from: 'A', to: 'Z', convert: '𝒜', exceptions: {
			B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
		}
	},
	{ name: FamilyName.scbf, from: 'A', to: 'Z', convert: '𝓐', exceptions: {} },
	{
		name: FamilyName.fr, from: 'A', to: 'Z', convert: '𝔄', exceptions: {
			C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ',
		}
	},
	{ name: FamilyName.frbf, from: 'A', to: 'Z', convert: '𝕬', exceptions: {} },
	{ name: FamilyName.tt, from: 'A', to: 'Z', convert: '𝙰', exceptions: {} },
	{
		name: FamilyName.bb, from: 'A', to: 'Z', convert: '𝔸', exceptions: {
			C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ',
		}
	},
	{ name: FamilyName.rmbf, from: 'a', to: 'z', convert: '𝐚', exceptions: {} },
	{
		name: FamilyName.rmit, from: 'a', to: 'z', convert: '𝑎', exceptions: {
			h: 'ℎ', ı: '𝚤', ȷ: '𝚥',
		}
	},
	{ name: FamilyName.rmbi, from: 'a', to: 'z', convert: '𝒂', exceptions: {} },
	{ name: FamilyName.sf, from: 'a', to: 'z', convert: '𝖺', exceptions: {} },
	{ name: FamilyName.sfbf, from: 'a', to: 'z', convert: '𝗮', exceptions: {} },
	{ name: FamilyName.sfit, from: 'a', to: 'z', convert: '𝘢', exceptions: {} },
	{ name: FamilyName.sfbi, from: 'a', to: 'z', convert: '𝙖', exceptions: {} },
	{
		name: FamilyName.sc, from: 'a', to: 'z', convert: '𝒶', exceptions: {
			e: 'ℯ', g: 'ℊ', o: 'ℴ',
		}
	},
	{ name: FamilyName.scbf, from: 'a', to: 'z', convert: '𝓪', exceptions: {} },
	{ name: FamilyName.fr, from: 'a', to: 'z', convert: '𝔞', exceptions: {} },
	{ name: FamilyName.frbf, from: 'a', to: 'z', convert: '𝖆', exceptions: {} },
	{ name: FamilyName.tt, from: 'a', to: 'z', convert: '𝚊', exceptions: {} },
	{ name: FamilyName.bb, from: 'a', to: 'z', convert: '𝕒', exceptions: {} },
	{ name: FamilyName.rm, from: 'Α', to: '∇', convert: 'Α', exceptions: {} },
	{ name: FamilyName.rmbf, from: 'Α', to: '∇', convert: '𝚨', exceptions: {} },
	{ name: FamilyName.rmit, from: 'Α', to: '∇', convert: '𝛢', exceptions: {} },
	{ name: FamilyName.rmbi, from: 'Α', to: '∇', convert: '𝜜', exceptions: {} },
	{ name: FamilyName.sfbf, from: 'Α', to: '∇', convert: '𝝖', exceptions: {} },
	{ name: FamilyName.sfbi, from: 'Α', to: '∇', convert: '𝞐', exceptions: {} },
	{ name: FamilyName.rm, from: 'α', to: 'ϖ', convert: 'α', exceptions: {} },
	{
		name: FamilyName.rmbf, from: 'α', to: 'ϖ', convert: '𝛂', exceptions: {
			Ϝ: '𝟊',
			ϝ: '𝟋'
		}
	},
	{ name: FamilyName.rmit, from: 'α', to: 'ϖ', convert: '𝛼', exceptions: {} },
	{ name: FamilyName.rmbi, from: 'α', to: 'ϖ', convert: '𝜶', exceptions: {} },
	{ name: FamilyName.sfbf, from: 'α', to: 'ϖ', convert: '𝝰', exceptions: {} },
	{ name: FamilyName.sfbi, from: 'α', to: 'ϖ', convert: '𝞪', exceptions: {} },
	{ name: FamilyName.rmbf, from: '0', to: '9', convert: '𝟎', exceptions: {} },
	{ name: FamilyName.bb, from: '0', to: '9', convert: '𝟘', exceptions: {} },
	{ name: FamilyName.sf, from: '0', to: '9', convert: '𝟢', exceptions: {} },
	{ name: FamilyName.sfbf, from: '0', to: '9', convert: '𝟬', exceptions: {} },
	{ name: FamilyName.tt, from: '0', to: '9', convert: '𝟶', exceptions: {} },
];

const greekDecode: Record<string, string> = {
	'ϴ': '\u03A2',
	'∇': '\u03AA',
	'∂': '\u03CA',
	'ϵ': '\u03CB',
	'ϑ': '\u03CC',
	'ϰ': '\u03CD',
	'ϕ': '\u03CE',
	'ϱ': '\u03CF',
	'ϖ': '\u03D0',
};

const greekEncode: Record<string, string> = {
	'\u03A2': 'ϴ',
	'\u03AA': '∇',
	'\u03CA': '∂',
	'\u03CB': 'ϵ',
	'\u03CC': 'ϑ',
	'\u03CD': 'ϰ',
	'\u03CE': 'ϕ',
	'\u03CF': 'ϱ',
	'\u03D0': 'ϖ',
};

function getCodePoint (string: string) {
	const codepnt = (greekDecode[string] ?? string).codePointAt(0);
	if (codepnt == null) throw new Error('Code point is undefined.');
	return codepnt;
}

function fromCodePoint (code: number) {
	const char = String.fromCodePoint(code);
	return greekEncode[char] ?? char;
}

async function main () {
	await writeFile(databaseFile, await gzip(JSON.stringify({ normals: generateNormals(), variants: generateVariants() })));
}

function generateNormals () {
	const normals = new Map<string, string>();

	for (const item of generatorData) {
		const start = getCodePoint(item.from);
		const end = getCodePoint(item.to);
		const offset = getCodePoint(item.convert);

		for (let index = 0; index <= end - start; index++) {
			const char = fromCodePoint(offset + index);
			const target = fromCodePoint(start + index);
			if (char !== target) normals.set(char, target);

			const realChar = String.fromCodePoint(offset + index);
			if (realChar in greekEncode) normals.set(realChar, target);
		}

		for (const [key, value] of Object.entries(item.exceptions)) {
			normals.set(value, key);
		}
	}

	return normals;
}

function generateVariants () {
	const variants = new Map<string, Map<FamilyName, string>>();

	for (const item of generatorData) {
		const start = getCodePoint(item.from);
		const end = getCodePoint(item.to);
		const offset = getCodePoint(item.convert);

		for (let index = 0; index <= end - start; index++) {
			const char = fromCodePoint(offset + index);
			const target = fromCodePoint(start + index);
			if (!variants.has(target)) variants.set(target, new Map());
			if (char !== target) variants.get(target)!.set(item.name, char);
		}

		for (const [key, value] of Object.entries(item.exceptions)) {
			if (!variants.has(key)) variants.set(key, new Map());
			variants.get(key)!.set(item.name, value);
		}
	}

	return variants;
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
