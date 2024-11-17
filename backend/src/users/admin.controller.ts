import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common/decorators";
import { ApiNoContentResponse, ApiResponse } from "@nestjs/swagger";
import { AdminRequired } from "./admin/AdminDecorator";
import { User, UserAdminChangeDTO, UserAdminCreateDTO, UserAdminDTO, UserCreateDTO } from "./models/User";
import { UserService } from "./users.service";

@Controller('admin')
export class AdminController {
  constructor(
    private userService: UserService,
  ) { }
  
  @ApiResponse({type: UserAdminDTO})
  @Post("user")
  @AdminRequired
  async create(@Body() user: UserAdminCreateDTO): Promise<UserAdminDTO> {    
    return await this.userService.register(user);
  }

  @ApiResponse({type: UserAdminDTO})
  @AdminRequired
  @Get("user/:id")
  async get(@Param("id") id: string): Promise<UserAdminDTO> {    
    return await this.userService.getUserById(id);
  }

  @ApiNoContentResponse()
  @AdminRequired
  @Delete("user/:id")
  async delete(@Param("id") id: string){    
    const user =  await this.userService.getUserById(id);
    user.deleteOne()
  }

  @ApiResponse({ type: UserAdminDTO })
  @AdminRequired
  @Patch("user/:id")
  async change(@Param("id") id: string, @Body() toChange: UserAdminChangeDTO) {
    return await this.userService.change(id, toChange)
  }

  @ApiResponse({type: UserAdminDTO})
  @AdminRequired
  @Get("user/username/:username")
  async getByUsername(@Param("username") username: string): Promise<UserAdminDTO> {    
    return await this.userService.findByUsername(username);
  }

}