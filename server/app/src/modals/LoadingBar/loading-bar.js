import './loading-bar.scss';

function LoadingBar(args) {
  if (args.size == 'large') {
    return (
      <div
        className='large-spinner'
        style={{ margin: `${args.height ? `${args.height}px` : '0%'} auto` }}
      />
    );

  } else if (args.size == 'medium') {
    return (
      <div
        className='medium-spinner'
        style={{ margin: `${args.height ? `${args.height}px` : '0%'} auto` }}
      />
    );
  
  } else if (args.size == 'small') {
    return (
      <div
        className='small-spinner'
        style={{ margin: `${args.height ? `${args.height}px` : '0%'} auto` }}
      />
    );
  
  } else if (args.size == 'tiny') {
    return (
      <div
        className='tiny-spinner'
        style={{ margin: `${args.height ? `${args.height}px` : '0%'} auto` }}
      />
    );
  }
}
export default LoadingBar;