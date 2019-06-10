export const RequestProblemDto = {
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
   * 0x03 答题，0x04 抢答, 0x05 举手。
   * unsigned char
   * 1个字节
   */
  packet_type : "",
  /**
   * 包序号
   * unsigned short
   * 2个字节
   */
  sn : "",
  /**
   * 学号
   * unsigned long
   * 4个字节
   */
  penid : "",
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
   * 按键个数
   * unsigned char
   * 1个字节
   */
  prob_num : "",
  /**
   * 按键值
   * unsigned char
   * 100个字节
   */
  prob : "",
  /**
   * 累加和校验
   * unsigned char
   * 1个字节
   */
  chk : ""
}
