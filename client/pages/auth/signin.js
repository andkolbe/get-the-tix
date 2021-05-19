import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email,
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  return (

    <div className='row justify-content-center mt-5'>
      <div className='col-lg-6'>
        <form className='form-group border border-primary rounded shadow bg-white font-weight-bold p-4' onSubmit={onSubmit}>
          <h1>Sign In</h1>
          <div className='form-group'>
            <label>Email Address</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='form-control border-primary'
            />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type='password'
              className='form-control border-primary'
            />
          </div>
          {errors}
          <button className='btn btn-primary'>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default signin
