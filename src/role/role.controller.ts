import { 
    Controller, 
    Get, Put, Delete,
    Param, Body, Post 
} from '@nestjs/common';
import { HasPermission } from 'src/permission/has-permission.decorator';
import { RoleService } from './role.service';



@Controller('roles')
export class RoleController {
    constructor(private roleService: RoleService) {
    }

    @Get()
    @HasPermission('roles')
    async all() {
    return this.roleService.all();
    }

    @Post()
    @HasPermission('roles')
    async create(
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    ) {
        /*
            [1, 2]

        [
            {id: 3}, {id:2}
        ]
        */
        return this.roleService.create({
            name,
            permissions: ids.map(id => ({id}))
        });
    }

    @Get(':id')
    @HasPermission('roles')
    async get(@Param('id') id: number) {
        return this.roleService.findone({id}, ['permissions']);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body('name') name: string,
        @Body('permissions') ids: number[]
    ) {
        await this.roleService.update(id, {name});

        const role = await this.roleService.findone({id});

        return this.roleService.create({
            ...role,
            permissions: ids.map(id => ({id}))
        });
    }

    @Delete(':id')
    @HasPermission('roles')
    async delete(@Param('id') id: number) {
        return this.roleService.delete(id);
    }
}
