import * as React from 'react';

interface IAppProps {
}

const Footer: React.FunctionComponent<IAppProps> = () => {
  return (
    <>
      <div className="bg-slate-900">
        <div className="container p-2 mx-auto">
          <footer className="py-5">
            <div className="text-base  text-center text-white">Copyright URL Shotner | Anfas</div>
          </footer>
        </div>
      </div>
    </>
  )
};

export default Footer;