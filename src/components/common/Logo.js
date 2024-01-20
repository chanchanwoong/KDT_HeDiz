import { Link } from 'react-router-dom';

function Logo(props) {
  return (
    <Link
      to='/'
      className='text-color'
    >
      <div
        className={`flex justify-content-center align-items-center ${props.margin}`}
      >
        <span className={`font-medium text-xl font-semibold ${props.size}`}>
          He<span className='text-primary font-bold'>Diz</span>
        </span>
      </div>
    </Link>
  );
}

export default Logo;
