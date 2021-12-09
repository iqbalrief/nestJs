import { 
    Controller, 
    Get, 
    Post, 
    Body, 
    UseInterceptors, 
    ClassSerializerInterceptor, 
    UseGuards, 
    Param, 
    Put,
    Delete,
    Query, 
    } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';



@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {

    constructor(private userService: UserService) {
    }

    /* @Get()
    async all(): Promise<User[]> {
        return this.userService.all();
    } */

    @Get()
    async all(@Query('page') page = 1): Promise<User[]> {
        return this.userService.paginate(page);
    }

    @Post()
    async create(@Body() body: UserCreateDto): Promise<User> {
        const password = await bcrypt.hash('1234' , 12)

        const {role_id, ...data} = body;

        return this.userService.create({
            ...data,
            password,
            role: {id: role_id}
        });
    }

    @Get(':id')
    async get(@Param('id') id: number) {
        return this.userService.findone({id});
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() body: UserUpdateDto
    ) {

        const {role_id, ...data} = body;

        await this.userService.update(id, {
            ...data,
            role: {id: role_id}
        });

        return this.userService.findone({id});
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}
