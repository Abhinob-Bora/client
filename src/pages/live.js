import React from 'react';
import ReactPlayer from 'react-player';

class RTSPPlayer extends React.Component {
  render() {
    const { url } = this.props;

    return (
      <ReactPlayer
        url={url}
      />
    );
  }
}

export default RTSPPlayer;