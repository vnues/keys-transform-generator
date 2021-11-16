import { camelcaseKeys } from '@src/index';

describe('camelcase', () => {
  it('main', () => {
    const data = {
      'foo-bar': 2,
    };
    const camelCaseData = camelcaseKeys(data);
    expect(camelCaseData.fooBar).toBe(2);
  });
  it('exclude option', () => {
    const data = {
      foo_bar: 2,
      foo_gar: 3,
    };
    const options = { exclude: ['foo_gar'] as const };
    const camelCaseData = camelcaseKeys<typeof data, typeof options>(data, options);
    expect(camelCaseData['foo_gar']).toBe(3);
  });
  it('deep option', () => {
    const data = {
      a_b: 1,
      a_c: {
        c_d: 1,
        c_e: {
          e_f: 1,
        },
      },
    };
    const options = {
      deep: true,
    } as const;
    const camelCaseData = camelcaseKeys<typeof data, typeof options>(data, options);
    expect(camelCaseData.aC.cE.eF).toBe(1);
  });
});
