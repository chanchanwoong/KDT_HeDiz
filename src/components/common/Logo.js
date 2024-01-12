// HeDiz 로고
function Logo(props) {
  return (
    <div
      className={`flex justify-content-center align-items-center ${props.margin}`}
    >
      <span className={`font-medium text-xl font-semibold ${props.size}`}>
        He<span className='text-primary font-bold'>Diz</span>
      </span>
    </div>
  );
}

export default Logo;
