import { ClientError } from './ClientError.js';

export class BadRequest extends ClientError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}
