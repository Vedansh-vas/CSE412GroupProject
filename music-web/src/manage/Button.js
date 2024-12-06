import Loading from './Loading';

const Button = ({loading, children, ...restProps}) => {
  return (
    <button
      {...restProps}
      className={loading ? 'loading' : ''}
      style={loading ? {
        pointerEvents: 'none'
      } : {}}
    >
      <Loading />
      {children}
    </button>
  );
};

export default Button;
