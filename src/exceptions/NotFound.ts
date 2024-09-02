import { ClientError } from './ClientError.js';

export class NotFound extends ClientError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}
