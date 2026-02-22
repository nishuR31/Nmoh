export class Err extends Error {
  constructor(res = null, msg = "Something went wrong", code = 200, payload = {}, extra = {}) {
    super(msg);
    this.res = res;
    this.code = code;
    this.payload = payload;
    this.success = false;
    this.extra = extra;
    Error.captureStackTrace(this, this.constructor);
  }

  res() {
    let data = {
      message: this.message,
      statusCode: this.code,
      payload: this.payload,
      success: false,
      stack: process.env.MODE === "dev" ? this.stack : null,
      extra: this.extra,
    };
    return this.res?.status(this.code).json(data);
  }
}

export default function err(
  res = null,
  msg = "Something went wrong",
  code = 400,
  payload = {},
  extra = {},
) {
  let data = {
    message: process.env.MODE === "dev" ? msg : "Something broke",
    statusCode: code,
    payload: payload,
    success: false,
    stack: process.env.MODE === "dev" ? new Error(msg).stack : null,
    extra,
  };

  if (res && typeof res.status === "function" && typeof res.json === "function") {
    return res.status(code).json(data);
  } else {
    // Fallback: log error if res is not available
    console.error("[err] No valid response object provided:", data);
    // Optionally, throw or return the error data
    return data;
  }
}
