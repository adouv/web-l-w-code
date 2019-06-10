using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;

namespace MLPen.Helpers
{
    public class RabbitMQSendHelper
    {
        static IsoDateTimeConverter dtConverter = new IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd HH:mm:ss" };
        static RabbitMQConnectHelper connection = null;

        static RabbitMQSendHelper()
        {
            connection = new RabbitMQConnectHelper();
            
        }

        /// <summary>
        /// 添加多条信息到队列
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="item">信息</param>
        /// <param name="queueName">队列名</param>
        /// <param name="exchange">交换器名称</param>
        /// <param name="type">交换器类型</param>
        public static bool PushMsgToMq<T>(List<T> item, string queueName, string exchange, string type)
        {
            string msg = JsonConvert.SerializeObject(item, dtConverter);
            using (global::RabbitMQ.Client.IModel channel = connection.CreateModel())
            {
                try {
                    channel.QueueDeclare(queue: queueName,
                   durable: true,
                   exclusive: false,
                   autoDelete: false,
                   arguments: null);
                    channel.ExchangeDeclare(exchange, type, true, false, null);
                    channel.QueueBind(queueName, exchange, queueName, null);
                    //构造一个完全空的内容标头，以便与Basic内容类一起使用。
                    global::RabbitMQ.Client.IBasicProperties properties = channel.CreateBasicProperties();
                    properties.Persistent = true;
                    byte[] body = Encoding.UTF8.GetBytes(msg);
                    channel.ConfirmSelect();
                    channel.BasicPublish(exchange: exchange,
                        routingKey: queueName,
                        basicProperties: properties,
                        body: body);
                    //消息回调机制 true 发送成功 false 发送失败
                    bool b = channel.WaitForConfirms();
                    
                    return channel.WaitForConfirms();
                } catch(Exception e)
                {
                    throw new Exception("消息发送失败");
                }
                finally
                {
                    channel.Close();
                    connection.close();
                }
               
            }
        }


        /// <summary>
        /// 添加单条信息到队列
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="item">信息</param>
        /// <param name="queueName">队列名</param>
        /// <param name="exchange">交换器名称</param>
        /// <param name="type">交换器类型</param>
        public static bool PushMsgToMq<T>(T item, string queueName, string exchange, string type)
        {
            string msg = JsonConvert.SerializeObject(item, dtConverter);
            using (global::RabbitMQ.Client.IModel channel = connection.CreateModel())
            {
                try
                {
                    channel.QueueDeclare(queue: queueName,
                    durable: true,
                    exclusive: false,
                    autoDelete: false,
                    arguments: null);
                channel.ExchangeDeclare(exchange, type, true, false, null);
                channel.QueueBind(queueName, exchange, queueName, null);
                //构造一个完全空的内容标头，以便与Basic内容类一起使用。
                global::RabbitMQ.Client.IBasicProperties properties = channel.CreateBasicProperties();
                properties.Persistent = true;
                byte[] body = Encoding.UTF8.GetBytes(msg);
                channel.ConfirmSelect();
                channel.BasicPublish(exchange: exchange,
                    routingKey: queueName,
                    basicProperties: properties,
                    body: body);
                //消息回调机制 true 发送成功 false 发送失败
                return channel.WaitForConfirms();
            }
            catch (Exception e)
            {
                throw new Exception("消息发送失败");
            }
            finally
            {
                channel.Close();
                connection.close();
            }
            }
        }
    }
}
