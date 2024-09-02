import { ClientError } from './ClientError.js';

export class Forbidden extends ClientError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}
