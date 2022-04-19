import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Statistic } from './statistic.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Statistic)
    private readonly statisticsService: Repository<Statistic>,
  ) {}
  async creatStatistics(statisticsDto) {
    const statistic = this.statisticsService.create({
      ...statisticsDto,
    });
    await this.statisticsService.save(statistic);
  }
  async updateStatistic(statistic: Statistic) {
    await this.statisticsService.save(statistic);
  }

  formatDate(date) {
    let day = date.getDate();
    day = day < 10 ? '0' + day : day;
    let month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    return date.getFullYear() + '-' + month + '-' + day;
  }
  formatReport(date_start, date_end, result) {
    const report = [];
    while (date_start <= date_end) {
      const index = result.findIndex(
        (r) => r.order_date === this.formatDate(date_start),
      );
      console.log(index);
      if (index < 0) {
        report.push({
          id: uuidv4(),
          gross_sale: 0,
          order_date: this.formatDate(date_start),
          net_sale: 0,
          total_order: 0,
        });
      } else {
        report.push(result[index]);
      }
      const newDate = date_start.setDate(date_start.getDate() + 1);
      date_start = new Date(newDate);
    }
    return report;
  }
  async findStatisticsByDate(date) {
    return await this.statisticsService.findOne({
      where: { order_date: date },
    });
  }
  async findStatisticsByLastXDay(day: number): Promise<Statistic[]> {
    const date_end = new Date();
    const date_start = new Date(date_end);
    date_start.setDate(date_end.getDate() - day);
    const statistic = await this.statisticsService
      .createQueryBuilder('s')
      .where('s.order_date >= :start_at', {
        start_at: date_start,
      })
      .andWhere('s.order_date <= :end_at', {
        end_at: date_end,
      })
      .orderBy('s.order_date', 'ASC')
      .getMany();
    return this.formatReport(date_start, date_end, statistic);
  }
  async findStatisticsByLastWeek(): Promise<Statistic[]> {
    // const statistic = await this.statisticsService.query(`
    //    Select id,gross_sale,net_sale, order_date from statistic WHERE order_date::DATE >= now()::DATE -7 and order_date::DATE < now()::DATE order by order_date ASC
    // `);
    // return await this.statisticsService.find({
    //   where: {
    //     order_date: MoreThan(date_start),
    //     order_date: LessThan(date_start),
    //   },
    // });
    // console.log(statistic);
    return this.findStatisticsByLastXDay(6);
    // return statistic;
  }
  async findStatisticsByLast30Day(): Promise<Statistic[]> {
    // const statistic = await this.statisticsService.query(`
    //    Select id,gross_sale,net_sale, order_date::DATE from statistic WHERE order_date::DATE >= now()::DATE -30 and order_date::DATE < now()::DATE order by order_date ASC
    // `);

    return this.findStatisticsByLastXDay(29);
  }
  async findStatisticsByYesterday(): Promise<Statistic[]> {
    return this.findStatisticsByLastXDay(1);
  }
  async findStatisticsByPeriod(
    date_start: string,
    date_end: string,
  ): Promise<Statistic> {
    const statistic = await this.statisticsService.query(`
       Select *  from statistic WHERE order_date >= '${date_start}' and order_date <= '${date_end}' order by order_date ASC
    `);
    console.log(statistic);
    return statistic;
  }
  async income2MonthLastest() {
    const now = new Date();
    const lastMoth = new Date(now);
    lastMoth.setMonth(lastMoth.getMonth() - 1);
    lastMoth.setDate(1);
    console.log(this.formatDate(lastMoth));
    const statistic = await this.statisticsService.query(`
    SELECT to_char(s.order_date,'mm')as MONTH,to_char(s.order_date,'yyyy')as Year ,SUM(gross_sale)::int8 as income, sum(net_sale)::int8 as profit, (SUM(gross_sale)::int8-sum(net_sale)::int8) as cost 
        FROM statistic s
      
        Where s.order_date::date >=  '${this.formatDate(lastMoth)}'
        GROUP BY MONTH,Year
         order by year asc
 `);
    return statistic;
  }
}
