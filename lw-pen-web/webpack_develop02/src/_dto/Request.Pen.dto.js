export const RequestPenDto = {
  /**
   * 0x55
   * unsigned char
   * 1个字节
   */
  tag : "",
  /**
   * 长度
   * unsigned char
   * 1个字节
   */
  len : "",
  /**
   * 0x01 坐标, 0x02 心跳
   * unsigned char
   * 1个字节
   */
  packet_type : "",
  /**
   * 学号
   * unsigned long
   * 4个字节
   */
  penid : "",
  /**
   * 压力值
   * unsigned short
   * 2个字节
   */
  pressure : "",
  /**
   * x轴
   * int
   * 4个字节
   */
  x : "",
  /**
   * y轴
   * int
   * 4个字节
   */
  y : "",
  /**
   * 笔盒电池电压
   * unsigned char
   * 1个字节
   */
  penbox_vol : "",
  /**
   * 笔电池电压
   * unsigned char
   * 1个字节
   */
  pen_vol : "",
  /**
   * 累加和校验
   * unsigned char
   * 1个字节
   */
  chk : ""
}
