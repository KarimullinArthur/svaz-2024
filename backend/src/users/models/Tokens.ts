import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"


export type Tokens = {

    access_token: string
    refresh_token: string
}
export class AccessToken{

    @ApiProperty({type: String, required: true})
    access_token: string

}
