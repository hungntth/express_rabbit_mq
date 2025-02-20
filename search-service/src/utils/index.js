const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((element) => {
    if (obj[element] == null) {
      delete obj[element];
    }
  });
  return obj;
};

const updatedNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((element) => {
    if (typeof obj[element] === "object" && !Array.isArray(obj[element])) {
      const response = updatedNestedObjectParser(obj[element]);
      Object.keys(response).forEach((item) => {
        final[`${element}.${item}`] = response[item];
      });
    } else {
      final[element] = obj[element];
    }
  });
  return final;
};

const convertToObjectIdMongoDb = (id) => new Types.ObjectId(id);

const replaceMail = (template, params) => {
  Object.keys(params).forEach((item) => {
    const placeHolder = `{{${k}}}`;
    template = template.replace(new RegExp(placeHolder, "g"), params[item]);
  });
};

module.exports = {
  StatusCodes: require("./statusCodes"),
  ReasonPhrases: require("./reasonPhrases.js"),
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updatedNestedObjectParser,
  convertToObjectIdMongoDb,
  replaceMail,
};