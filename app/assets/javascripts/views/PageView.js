import React from 'react';
import Header from '../components/header';
import WidgetsList from '../components/widgets-list';

class PageView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return !this.props.loading
      ? <div>
        <Header />
        <WidgetsList data={this.props.data} />
      </div>
      : <div>
        <Header />
        <div>Loading</div>
      </div>;
  }
}

PageView.propTypes = {
  data: React.PropTypes.array.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default PageView;
