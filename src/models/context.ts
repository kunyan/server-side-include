export interface IContext {
  variable: {
    [key: string]: string;
  };
  configs: IConfigs;
}

interface IConfigs {
  echomsg: string;
  errmsg: string;
  sizefmt: string;
  timefmt: string;
}
