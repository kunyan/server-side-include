import { IContext } from './models/context';

const getContext = (): IContext => ({
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
