import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto';
import { User } from './user.entity';
import { UsernameAlreadyExistsError } from 'src/common/exceptions';
import { POSTGRES } from 'src/constants';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.create({ username, password: hashedPassword });

    await this.save(user).catch((error) => {
      if (error.code === POSTGRES.ERROR_CODES.DUPLICATE_RECORD) {
        throw new UsernameAlreadyExistsError({ username });
      } else {
        throw new InternalServerErrorException();
      }
    });
  }
}
