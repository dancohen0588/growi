import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MeService } from './me.service';
import { OverviewDto } from './dto/overview.dto';

@ApiTags('Me')
@Controller('me')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MeController {
  private readonly logger = new Logger(MeController.name);

  constructor(private readonly meService: MeService) {}

  @Get('overview')
  @ApiOperation({
    summary: 'Get user garden overview',
    description: 'Returns aggregated data for the user dashboard including projects, plants, reminders, activities, weather and alerts'
  })
  @ApiResponse({
    status: 200,
    description: 'User garden overview data',
    type: OverviewDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async getOverview(@Request() req: any): Promise<OverviewDto> {
    this.logger.log(`[OVERVIEW] Request received from user: ${req.user?.sub || 'UNKNOWN'}`);
    this.logger.log(`[OVERVIEW] User data: ${JSON.stringify(req.user)}`);
    this.logger.log(`[OVERVIEW] Headers: ${JSON.stringify(req.headers)}`);
    
    const userId = req.user.sub;
    return this.meService.getOverview(userId);
  }
}