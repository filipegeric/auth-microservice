import { getRepository } from 'typeorm';

import { User } from '../entity/user.entity';

const userRepository = getRepository(User);

export { userRepository };
