/** 
 * 队列服务
 */
export default class Queue {
  items = [];
  /**
   * 向队列尾部添加一个或多个资源
   *
   */
  enqueue(element) {
    this.items.push(element);
  }
  /**
   * 移除队列的第一（即排在队列对前面的）项，并返回被移除的元素
   *
   */
  dequeue() {
    return this.items.shift();
  }
  /**
   * 返回队列中第一个元素---最先被添加的,也将是最先被移除的元素。队列不做任何变动（不移除元素，只返回元素信息）
   *
   */
  front() {
    return this.items[0];
  }
  /**
   * 如果队列中不包含任何元素，返回true，否则返回false
   *
   * @returns
   */
  isEmpty() {
    return this.items.length === 0;
  }
  /**
   * 返回队列包含的元素个数，与数组的length属性类似
   *
   * @returns
   */
  size() {
    return this.items.length;
  }
  /**
   * 打印队列
   *
   */
  print() {
    console.log(this.items.toString());
  }
}
