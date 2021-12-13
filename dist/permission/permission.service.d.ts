import { AbstractService } from 'src/common/abstract.service';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
export declare class PermissionService extends AbstractService {
    private readonly permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
}
