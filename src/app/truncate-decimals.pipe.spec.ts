import { TruncateDecimalsPipe } from './truncate-decimals.pipe';

describe('TruncateDecimalsPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateDecimalsPipe();
    expect(pipe).toBeTruthy();
  });
});
