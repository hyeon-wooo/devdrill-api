export const sendFailRes = (msg: string) => {
  return {
    success: false,
    err: {
      msg,
    },
  };
};

export const sendSuccessRes = <T = any>(data: T) => {
  return {
    success: true,
    data,
  };
};
