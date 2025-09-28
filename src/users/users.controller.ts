import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({
    description: 'The user has been successfully created',
    type: UserDto,
    isArray: false,
  })
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Returns all users',
    type: UserDto,
    isArray: true,
  })
  @Get()
  @ApiBearerAuth()
  async findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({
    description: 'Returns the user with the specified id',
    type: UserDto,
    isArray: false,
  })
  @Get(':id')
  @ApiBearerAuth()
  async findOne(@Param('id') id: number): Promise<UserDto> {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: 'Partially update a user' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'The user has been successfully updated',
    type: UserDto,
    isArray: false,
  })
  @Patch(':id')
  @ApiBearerAuth()
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @HttpCode(204)
  @ApiOkResponse({ description: 'The user has been successfully deleted' })
  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id') id: number): Promise<void> {
    return this.usersService.remove(id);
  }
}
