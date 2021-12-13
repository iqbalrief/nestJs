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
    Req,
    BadRequestException, 
    } from '@nestjs/common';
import { User } from './models/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';



@UseInterceptors(ClassSerializerInterceptor)
@Controller('users')
@UseGuards(AuthGuard)
export class UserController {

    constructor(
        private userService: UserService,
        private authService: AuthService
    ) {
    }

    /* @Get()
    async all(): Promise<User[]> {
        return this.userService.all();
    } */

    @Get()
    @HasPermission('users')
    async all(@Query('page') page = 1) {
        return this.userService.paginate(page, ['role']);
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
        return this.userService.findone({id}, ['role']);
    }

    @Put('info')
    async updateInfo(
        @Req() request: Request,
        @Body() body: UserUpdateDto
        ) {
        const id =  await this.authService.userId(request);
        await this.userService.update(id, body);

        return this.userService.findone({id});
    }

    @Put('password_confirm')
    async updatePassword(
        @Req() request: Request,
        @Body('password') password: string,
        @Body('password_confirm') password_confirm: string,
    ) {
        if (password !== password_confirm) {
            throw new BadRequestException('Passwords do not match!');
        }
        const id =  await this.authService.userId(request);

        const hashed = await bcrypt.hash(password , 12);

        await this.userService.update(id, {
            password: hashed,
        });

        return this.userService.findone({id});
    }

    @Put(':id')
    @HasPermission('users')
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
    @HasPermission('users')
    async delete(@Param('id') id: number) {
        return this.userService.delete(id);
    }
}
