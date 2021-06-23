import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  return (

    <div className='row justify-content-center mt-5'>
      <div className='col-lg-5'>
        <form className='form-group border rounded border-primary shadow p-4' onSubmit={onSubmit}>
          <h1>{ticket.title}</h1>
          <h4>Price: ${ticket.price}</h4>
          {errors}
          <button onClick={() => doRequest()} className='btn btn-primary mt-3'>
          {/* <button onClick={doRequest} className='btn btn-primary mt-3'> */}
            Purchase
          </button>
        </form>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
