import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Create new user if the user name doesn't exists
    const existingUser = await this.findOneByUserName(createUserDto.userName);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }
    // Hash password with salt
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const createdUser = await this.usersRepository.save(newUser);
    return createdUser;
  }

  async findOneByUserName(userName: string): Promise<User | undefined> {
    // Get user by userName
    const user = await this.usersRepository.findOneBy({ userName });
    return user;
  }
}
