import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { JwtAuthGuard } from 'src/security/guards/jwt-auth.guard'
import { RolesGuard } from 'src/security/guards/roles.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enums/Role'
import { ValidationPipe } from 'src/pipes/validation.pipe'
import { ReqUser } from 'src/decorators/req-user.decorator'
import { users } from '@prisma/client'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  findAll() {
    return this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('@me')
  findOneMe(@ReqUser() user: users) {
    return this.userService.findOne(user.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get(':id_user')
  findOne(@Param('id_user', ParseIntPipe) userId: number) {
    return this.userService.findOne(userId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Patch('@me')
  updateMe(
    @ReqUser() user: users,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(user.id, updateUserDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Patch('password')
  updatePassword(
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
    @ReqUser() user: users,
  ) {
    return this.userService.updatePassword(user.id, updateUserDto.password)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) userId: number,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Delete('@me')
  deleteMe(@ReqUser() user: users) {
    return this.userService.delete(user.id)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) userId: number) {
    return this.userService.delete(userId)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get('@me/avatar')
  downloadAvatar(@ReqUser() user: users, @Res() res: Response) {
    return this.userService.findImg(user, res)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Patch('@me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @ReqUser() user: users,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.userService.updateImg(image, user)
  }
}
