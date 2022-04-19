import { Body, Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsService: StatisticsService) {}
  @Get('/reportPeriod')
  getReportByPeriod(
    @Query('date_start') date_start,
    @Query('date_end') date_end,
  ) {
    // return this.statisticsService.findStatisticsByLastWeek();
    // return this.statisticsService.findStatisticsByYesterday();
    // return this.statisticsService.findStatisticsByLastWeek();
    // return this.statisticsService.findStatisticsByLast30Day();
    return this.statisticsService.findStatisticsByPeriod(date_start, date_end);
  }
  @Get('/reportLastWeek')
  getReportLastWeek() {
    return this.statisticsService.findStatisticsByLastWeek();
    // return this.statisticsService.findStatisticsByYesterday();
    // return this.statisticsService.findStatisticsByLastWeek();
    // return this.statisticsService.findStatisticsByLast30Day();
  }
  @Get('/report30Day')
  getReportLast30Day() {
    return this.statisticsService.findStatisticsByLast30Day();
  }
  @Get('/reportYesterday')
  getReportYestorday() {
    return this.statisticsService.findStatisticsByYesterday();
  }
  @Get('/income')
  getIncome() {
    return this.statisticsService.income2MonthLastest();
  }
}
