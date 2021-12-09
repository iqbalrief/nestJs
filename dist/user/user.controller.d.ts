import { User } from './models/user.entity';
import { UserService } from './user.service';
import { UserCreateDto } from './models/user-create.dto';
import { UserUpdateDto } from './models/user-update.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    all(page?: number): Promise<User[]>;
    create(body: UserCreateDto): Promise<User>;
    get(id: number): Promise<User>;
    update(id: number, body: UserUpdateDto): Promise<User>;
    delete(id: number): Promise<any>;
}
