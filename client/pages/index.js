import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>${ticket.price}</td>
        <td>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div className='row justify-content-center mt-4'>
      <div className='col-lg-8'>
        <h1 className='text-center mb-4'>Tickets</h1>
        <table className='table table-striped border'>
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>View Ticket</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  // const { data } = await client.get('/api/tickets');
  // return { tickets: data };

  const promise = new Promise((resolve, reject) => {
    client.get('/api/tickets')
      .then(({data}) => {
        resolve(data)
      })
      .catch((error) => {
        reject(error)
      })
  })
  return promise
    .then(data => {
      return { tickets: data, error: null }
    })
    .catch(error => {
      return { tickets: null, error }
    })
};

export default LandingPage;
