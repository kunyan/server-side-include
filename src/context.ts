import { IContext } from "./models/context";

const getContext = (): IContext => ({
  variable: {
    DATE_GMT: new Date().toISOString(),
    DATE_LOCAL: new Date().toString(),
  },
  configs: {
    echomsg: "ssss",
    errmsg: "ssss",
    sizefmt: "ssss",
    timefmt: "ssss",
  },
});

export default getContext;
