/* eslint-disable consistent-return, no-restricted-syntax, prefer-const */

const checkParams = (array, body, response) => {
  for (let requiredParameter of array) {
    if (!body[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the ${requiredParameter} property.`,
      });
    }
  }
};

module.exports = checkParams;
