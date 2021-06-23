import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };

  const onBlur = () => {
    const value = parseFloat(price);

    // if the user doesn't input a number, don't try to round it
    if (isNaN(value)) {
      return;
    }
    // round the value to two decimals when the user clicks out of the Price input field
    setPrice(value.toFixed(2));
  };

  return (
    <div className='row justify-content-center mt-5'>
      <div className='col-lg-5'>
        <form className="border rounded border-primary shadow p-4" onSubmit={onSubmit}>
          <h1>Create a Ticket</h1>
          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control border-primary"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              value={price}
              onBlur={onBlur}
              onChange={(e) => setPrice(e.target.value)}
              className="form-control border-primary"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
