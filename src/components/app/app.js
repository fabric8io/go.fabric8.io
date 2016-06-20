import React, { PropTypes } from 'react';

const App = props => {
  return (
    <div>
      <main className="main">{props.children}</main>
    </div>
  );
};

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;

