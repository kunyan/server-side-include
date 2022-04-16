export interface Context {
  variable: {
    [key: string]: string;
  };
  configs: Configs;
}

export interface Configs {
  echomsg: string;
  errmsg: string;
  sizefmt: string;
  timefmt: string;
}

export const getContext = (): Context => ({
  variable: {
    DATE_GMT: new Date().toISOString(),
    DATE_LOCAL: new Date().toString(),
  },
  configs: {
    echomsg: 'SSI render echo error',
    errmsg: 'SSI render error',
    sizefmt: '',
    timefmt: '',
  },
});

export default getContext;
