export const sendFailRes = (msg: string, code?: string) => {
  return {
    success: false,
    err: {
      msg,
      code,
    },
  };
};

export const sendSuccessRes = <T = any>(data: T) => {
  return {
    success: true,
    data,
  };
};
