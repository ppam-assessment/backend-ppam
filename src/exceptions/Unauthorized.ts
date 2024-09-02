import { ClientError } from './ClientError.js';

export class Unauthorized extends ClientError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}
