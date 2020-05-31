const parseMessage = require('./parseMessage');
const { case01, case02, case03, case04 } = require('./__mock__');

describe('case01', () => {
  test('Check generally for all results', () => {
    const t = parseMessage(case01);

    expect(t.elementList.length).toBeGreaterThanOrEqual(1);
    expect(t.eventId).toEqual('Ev014KDMDVQS');
    expect(t.targetUserList.length).toEqual(0);
    expect(t.valueList.length).toEqual(1);
    expect(t.totalPoint).toEqual(1);
    expect(t.isValid).toEqual(false);
    expect(t.pointPerUser).toEqual(0);
  });
});

describe('case02', () => {
  test('This case is not valid due to there are no user was mentioned', () => {
    const t = parseMessage(case02);

    expect(t.totalPoint).toEqual(3);
    expect(t.isValid).toEqual(false);
  });
});

describe('case03', () => {
  test('This is a valid case, at least 1 people was mentioned.', () => {
    const t = parseMessage(case03);

    expect(t.totalPoint).toEqual(3);
    expect(t.isValid).toEqual(true);
  });
});

describe('case04', () => {
  test('PointPerUser should be calculated properly', () => {
    const t = parseMessage(case04);

    expect(t.totalPoint).toEqual(3);
    expect(t.targetUserList.length).toEqual(2);
    expect(t.pointPerUser).toEqual('1.50');
  });
});
