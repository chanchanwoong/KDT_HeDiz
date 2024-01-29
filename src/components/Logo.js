import { Link } from 'react-router-dom';

function Logo(props) {
  return (
    <Link
      to='/'
      className='text-color'
    >
      <h1
        className={`flex justify-content-center align-items-center m-0 ${props.spacing}`}
      >
        <span
          className={`logo font-medium text-xl font-semibold ${props.size}`}
        >
          He<span className='text-primary font-bold'>Diz</span>
        </span>
      </h1>
    </Link>
  );
}

export default Logo;
