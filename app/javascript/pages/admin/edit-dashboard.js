import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import Wysiwyg from 'vizz-wysiwyg';

const EditDashboard = ({ admin }) => (
  <div className="l-page-list">
    <div className="wrapper">
      <h1>Dashboard Content</h1>
      <Wysiwyg
        items={admin.page.content || []}
      />
    </div>
  </div>
);

function mapStateToProps(state) {
  return { admin: state.admin };
}

EditDashboard.propTypes = { admin: PropTypes.object.isRequired };

export default connect(mapStateToProps, null)(EditDashboard);
