export class Success {
  constructor(res = null, msg = "Successfull", code = 200, payload = {}, extra = {}) {
    this.msg = msg;
    this.res = res;
    this.code = code;
    this.payload = payload;
    this.success = true;
    this.extra = extra;
  }

  res() {
    let data = {
      message: this.msg,
      statusCode: code,
      payload: this.payload,
      success: true,
      extra,
    };
    return res.status(this.code).json({ data });
  }
}

export default function success(
  res = null,
  msg = "Successfull",
  code = 200,
  payload = {},
  extra = {},
) {
  let data = {
    message: msg,
    statusCode: code,
    payload: payload,
    success: true,
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
