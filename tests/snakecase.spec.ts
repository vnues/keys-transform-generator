import { snakecaseKeys } from '@src/index';

describe('snakecase', () => {
  it('main', () => {
    const data = {
      fooBar: 2,
    };
    const snakecaseData = snakecaseKeys(data);
    expect(snakecaseData['foo_bar']).toBe(2);
  });
  it('exclude option', () => {
    const data = {
      fooBar: 2,
      fooGar: 3,
    };
    const options = { exclude: ['foo_gar'] as const };
    const snakecaseData = snakecaseKeys<typeof data, typeof options>(data, options);
    expect(snakecaseData['foo_gar']).toBe(3);
  });
  it('deep option', () => {
    const data = {
      aB: 1,
      aC: {
        cD: 1,
        cE: {
          eF: 1,
        },
      },
    };
    const options = {
      deep: true,
    } as const;
    const snakecaseData = snakecaseKeys<typeof data, typeof options>(data, options);
    expect(snakecaseData['a_c']['c_d']).toBe(1);
  });
});
