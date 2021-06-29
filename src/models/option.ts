import { Agent } from 'http';
export interface IOptions {
  host?: string;
  rejectUnauthorized?: boolean;
  agent?: Agent;
}
