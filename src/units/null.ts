import { Box, Unit } from '../defs';

export default class NullBox implements Unit {
	compile (): Box {
		return {
			render: () => { },
			width: 0,
			height: 0,
			depth: 0,
			marginLeft: 0,
			marginRight: 0,
		};
	}
}
