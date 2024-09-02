import { Status } from "@prisma/client";

export default [
    {
        id: 'test-admin',
        username: 'developer',
        email: 'developer@gmail.com',
        password: '$2a$12$2K55OKAqhjd7v5ey40MNsOgzgCZVYLIwjtTugD4Qb6X3.8ojCKax6', // code maniac
        status: Status.admin
    },
    {
        id: 'test-submitter',
        username: 'test',
        email: 'developer1@gmail.com',
        institute: 'test',
        password: '$2a$12$2K55OKAqhjd7v5ey40MNsOgzgCZVYLIwjtTugD4Qb6X3.8ojCKax6', // code maniac
        status: Status.submitter
    }
]