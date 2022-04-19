import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { config } from 'process';
import { map } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
@Injectable()
export class GhtkService {
  constructor(private httpService: HttpService) {}
  createOrder(data): Observable<any> {
    return this.httpService
      .post(
        'https://services.ghtklab.com/services/shipment/order/?ver=1.5',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Token: '12d0B0c45a64E00a67968B37d1Bf02b41Cc43dF7',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
      .pipe(
        map((res) => {
          console.log(res.data);
          return res.data;
        }),
      );
  }
  caculatorFeeShip(dataBody): Observable<any> {
    // const address = this.getPickAddress().toPromise();
    // console.log(address);
    const body = {
      pick_province: 'Hà Nội',
      pick_district: 'Huyện Phú Xuyên',
      province: dataBody.city,
      district: dataBody.district,
      // address: 'P.503 tòa nhà Auu Việt, số 1 Lê Đức Thọ',
      weight: 1000,
      value: 3000000,
      transport: 'road',
    };
    return this.httpService
      .get('https://services.ghtklab.com/services/shipment/fee', {
        params: body,

        headers: {
          'Content-Type': 'application/json',
          Token: '12d0B0c45a64E00a67968B37d1Bf02b41Cc43dF7',
          'Access-Control-Allow-Origin': '*',
        },
      })
      .pipe(
        map((res) => {
          console.log(res.data);
          return res.data.fee.ship_fee_only;
        }),
      );
  }
  getPickAddress() {
    return this.httpService
      .get(
        'https://services.ghtklab.com/services/shipment/list_pick_add',

        {
          headers: {
            'Content-Type': 'application/json',
            Token: '12d0B0c45a64E00a67968B37d1Bf02b41Cc43dF7',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
      .pipe(
        map((res) => {
          console.log(res.data);
          return res.data;
        }),
      );
  }
  printOrder(label) {
    return this.httpService
      .get(`https://services.ghtklab.com/services/label/${label}`, {
        headers: {
          'Content-Type': 'application/pdf',
          Token: '12d0B0c45a64E00a67968B37d1Bf02b41Cc43dF7',
          'Access-Control-Allow-Origin': '*',
          responseType: 'arraybuffer',
        },
        responseType: 'arraybuffer',
      })
      .pipe(
        map((res) => {
          res.headers['content-type'] = 'application/pdf';
          console.log(res.headers);
          return res.data;
        }),
      );
  }
  writeToZip() {
    // Call API

    return this.httpService
      .get(
        'https://services.ghtklab.com/services/label/S20597865.SG8.A2.BC.300069827',
        {
          headers: {
            'Content-Type': 'application/pdf',
            Token: '12d0B0c45a64E00a67968B37d1Bf02b41Cc43dF7',
            'Access-Control-Allow-Origin': '*',
            responseType: 'arraybuffer',
            encoding: 'binary',
          },
          responseType: 'arraybuffer',
        },
      )
      .pipe(
        map((res) => {
          //   res.headers['content-type'] = 'application/pdf';
          res.headers['Content-Type'] = 'application/pdf';

          console.log(res.data);
          return res.data;
        }),
      );
    // customFuntion = dataCustomFuntion.data.sm;
    // console.log('CUSTOM', dataCustomFuntion);
    //   res.send(dataCustomFuntion);
  }
  async writeToZip1() {
    // Call API

    try {
      const dataCustomFuntion = await this.httpService
        .get(
          'https://services.ghtklab.com/services/label/S20597865.SG8.A2.BC.300069827',
          {
            headers: {
              'Content-Type': 'application/pdf',
              Token: '12d0B0c45a64E00a67968B37d1Bf02b41Cc43dF7',
              'Access-Control-Allow-Origin': '*',
              responseType: 'arraybuffer',
            },
            responseType: 'text',
          },
        )
        .toPromise();
      // customFuntion = dataCustomFuntion.data.sm;
      console.log('CUSTOM', dataCustomFuntion.data);
    } catch (error) {
      console.log('Loi' + error);
    }
  }
}
