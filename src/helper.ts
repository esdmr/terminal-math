function* zip2<T1, T2> (iter1: Iterator<T1>, iter2: Iterator<T2>): Generator<[T1, T2]> {
    while (true) {
        const item1 = iter1.next();
        const item2 = iter2.next();
        if (item1.done || item2.done) return;
        yield [item1.value, item2.value];
    }
    iter2.next();
}
