import Joi from "joi";

const emailRegex =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+(?:\\.[A-Za-z0-9!#$%&'*+/=?^_{|}~-]+)*@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\\.)+[A-Za-z]{2,}|\\[(?:IPv6:[A-F0-9]{0,4}(?::[A-F0-9]{0,4}){2,7}|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\\]$/;

const appEmailSchema = Joi.object({
  email: Joi.string().trim().pattern(emailRegex).required(),
});

export default appEmailSchema;
