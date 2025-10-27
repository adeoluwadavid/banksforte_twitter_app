import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('tweets')
@UseGuards(JwtAuthGuard)
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  async create(
    @CurrentUser() user: any,
    @Body() createTweetDto: CreateTweetDto,
  ) {
    return this.tweetsService.create(user.id, createTweetDto);
  }

  @Get('my-tweets')
  async findMyTweets(@CurrentUser() user: any) {
    return this.tweetsService.findMyTweets(user.id);
  }

  @Get('shared-with-me')
  async findSharedWithMe(@CurrentUser() user: any) {
    return this.tweetsService.findSharedWithMe(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tweetsService.findOne(id);
  }
}
