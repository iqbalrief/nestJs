import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { PaginatedResult } from 'src/common/paginated-result.interface';
import { Repository } from 'typeorm';
import { User } from './models/user.entity';

@Injectable()
export class UserService extends AbstractService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {
        super(userRepository);
    }

  /*   async all(): Promise<User[]> {
        return this.userRepository.find();
    } */

    async paginate(page = 1, relations: any[] = []) : Promise<PaginatedResult> {
        const {data, meta} = await super.paginate(page, relations);
        

        return {
            data: data.map(user => {
                const {password, ...data} = user;
                return data;
            }),
            meta
        }
    }


   /*  async create(data): Promise<User> {
        return this.userRepository.save(data);
    }

    async findone(condition): Promise<User> {
        return this.userRepository.findOne(condition);
    }

    async update(id: number, data): Promise<any> {
        return this.userRepository.update(id, data);
    }

    async delete(id: number): Promise<any> {
        return this.userRepository.delete(id)
    } */
}