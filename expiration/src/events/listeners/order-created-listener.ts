import { Listener, OrderCreatedEvent, Subjects } from '@ajktickets/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime() // delays the job for 15 min

        // enqueue a job using our Bull queue
        await expirationQueue.add({
            // we store the orderId of the newly created order on every new job that we send off the Redis server
            orderId: data.id // orderId comes from the id off of the data object we are receiving on the OrderCreatedEvent
        }, {
            delay
        })

        msg.ack()
    }
}