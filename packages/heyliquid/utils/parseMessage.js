const { REWARD_SYMBOL, DEFAULT_POINT, VALUE_SYMBOL_LIST } = require('./consts');

const parseMessage = (payload) => {
  const elements = payload.event.blocks
    .find((i) => i.type === 'rich_text')
    .elements.find((i) => i.type === 'rich_text_section').elements;

  // filter target user,
  // user can not praise themself
  const targetUserList = elements
    .filter((i) => i.type === 'user')
    .filter((i) => i.user_id !== payload.event.user);

  // get total point
  const totalPoint =
    elements.filter((i) => {
      return i.type === 'emoji' && i.name === REWARD_SYMBOL;
    }).length * DEFAULT_POINT;

  // get value list
  const valueList = elements
    .filter((i) => i.type === 'emoji')
    .filter((i) => {
      return VALUE_SYMBOL_LIST.indexOf(i.name) !== -1;
    });

  const isValid = targetUserList.length > 0 && totalPoint > 0;
  let pointPerUser = 0;

  if (isValid) {
    pointPerUser = (totalPoint / targetUserList.length).toFixed(2);
  }

  return {
    elementList: elements,
    eventId: payload.event_id,
    targetUserList,
    totalPoint,
    valueList,
    isValid,
    pointPerUser,
  };
};

module.exports = parseMessage;
