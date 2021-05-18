import { Publisher, Subjects, TicketUpdatedEvent } from '@ajktickets/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated // readonly means that we are unable to change the type of subject
}
