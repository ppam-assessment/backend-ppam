import { ClientError } from './ClientError.js';

export class UnprocessableEntity extends ClientError {
  constructor(message: string = 'Unprocessable Entity') {
    super(message, 422);
  }
}
