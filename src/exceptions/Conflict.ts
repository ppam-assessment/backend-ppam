import { ClientError } from './ClientError.js';

export class Conflict extends ClientError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}
