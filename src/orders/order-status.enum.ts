export enum OrderStatus {
  NEW = 'NEW',
  CONFIRM = 'CONFIRM',
  IN_PROGRESS = 'IN_PROGRESS',
  PACKAGED = 'PACKAGED',
  PICKED = 'PICKED',
  DELIVERED = 'DELIVERED',
  PAID = 'PAID',
  RETURNED = 'RETURNED',
  CANCEL = 'CANCEL',
  DONE = 'DONE',
}
export const description = (status) => {
  switch (status) {
    case 'NEW':
      return 'Khách hàng đã tạo một đơn hàng mới';
    case 'CONFIRM':
      return 'Đơn hàng đã được xác nhận';
    case 'IN_PROGRESS':
      return 'Đơn hàng đang được xử lí';
    case 'PACKAGED':
      return 'Đơn hàng đã được đóng gói và sẵn sàng giao cho đơn vị vận chuyển';
    case 'PICKED':
      return 'Shipper đã lấy hàng';
    case 'DELIVERED':
      return 'Đơn hàng đã được giao thành công';
    case 'DONE':
      return 'Đơn hàng đã được hoàn thành';
    case 'PAID':
      return 'Đơn hàng đã thanh toán thành công';
    case 'CANCEL':
      return 'Đơn hàng đã hủy thành công';
  }
};
