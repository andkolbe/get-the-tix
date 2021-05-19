import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
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

  const link = [
    { label: 'Sign Up', href: '/auth/signup' }, 
  ]

  return (
    <div className='row justify-content-center mt-5'>
      <div className='col-lg-6'>
        <form className='form-group border rounded border-primary shadow bg-white font-weight-bold p-4' onSubmit={onSubmit}>
          <h1>Sign Up</h1>
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
          {/* {errors} */}
          <button className='btn btn-primary'>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default signup
