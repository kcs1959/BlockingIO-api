//被テスト関数
function add(a: number, b: number): number {
    return a + b;
}

//テストごとにtest()関数を用意する
test('足し算できるかどうか', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(2, 2)).toBe(4);
    expect(add(3, 2)).toBe(5);
    expect(add(4, 2)).toBe(6);
});
