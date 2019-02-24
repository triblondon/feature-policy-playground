import React, { Component } from 'react';
import classNames from 'classnames';

const RESULT_PENDING = 'PENDING';
const RESULT_OK = 'OK';
const RESULT_EXPECTED_FAIL = 'EXPECTED_FAIL';
const RESULT_UNEXPECTED_SUCCESS = 'UNEXPECTED_SUCCESS';
const RESULT_UNEXPECTED_FAIL = 'UNEXPECTED_FAIL';
const LONG_WAIT_TIMEOUT = 2000;

class TestResult extends Component {
  constructor (props) {
    super(props)
    this.state = {
      status: RESULT_PENDING,
      detail: null,
      longWait: false
    }
    this.boundHandleReceiveMessage = this.handleReceiveMessage.bind(this);
    this.longWaitTimer = null;
  }

  componentDidMount() {
    window.addEventListener("message", this.boundHandleReceiveMessage, false);

  }
  componentWillUnmount() {
    window.removeEventListener("message", this.boundHandleReceiveMessage, false);
  }
  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this.setState({ status: RESULT_PENDING, detail: null, longWait: false });  // <-- TODO: maybe setState in a didUpdate hook is bad practice?
      clearTimeout(this.longWaitTimer);
      this.longWaitTimer = setTimeout(() => this.setState({ longWait: true }), LONG_WAIT_TIMEOUT);
    }
  }

  handleReceiveMessage(msg) {
    if (msg.data.type !== 'feature-test-result') return;
		if (Number.parseInt(msg.data.demoID, 10) !== Number.parseInt(this.props.id, 10)) return;
    if (msg.data.isWorking && this.props.expectToWork) {
      this.setState({ status: RESULT_OK });
    } else if (!msg.data.isWorking && !this.props.expectToWork) {
      this.setState({ status: RESULT_EXPECTED_FAIL });
    } else if (msg.data.isWorking && !this.props.expectToWork) {
      this.setState({ status: RESULT_UNEXPECTED_SUCCESS });
    } else {
      this.setState({ status: RESULT_UNEXPECTED_FAIL });
    }
    this.setState({ detail: msg.data.resultDetail });
    clearTimeout(this.longWaitTimer);
  }

  render() {
    const statusDescriptions = {
      [RESULT_PENDING]: `Waiting for the demo to report a result...`,
      [RESULT_OK]: `The feature worked, and it was allowed by the Feature Policy`,
      [RESULT_EXPECTED_FAIL]: `The feature didn't work, but we didn't expect it to, because it was blocked by the Feature Policy`,
      [RESULT_UNEXPECTED_SUCCESS]: `The feature worked despite being blocked by a Feature Policy.  Perhaps this policy is not recognised by this browser`,
      [RESULT_UNEXPECTED_FAIL]: `The feature didn't work, but was allowed by the Feature Policy.  Perhaps the feature is not supported in this browser`
		};
		const classes = classNames({
			'result': true,
			'alert': true,
			'alert-info': this.state.status === RESULT_PENDING,
			'alert-success': this.state.status === RESULT_OK,
			'alert-secondary': this.state.status === RESULT_EXPECTED_FAIL,
			'alert-danger': [RESULT_UNEXPECTED_SUCCESS, RESULT_UNEXPECTED_FAIL].includes(this.state.status)
		});

    return (
      <div className={classes}>
				{Boolean(this.state.status === RESULT_PENDING) && (
					<div className="spinner-grow" role="status"><span className="sr-only">Loading...</span></div>
				)}
				<div className='content'>
					<p>{statusDescriptions[this.state.status]}
            {this.state.status === RESULT_PENDING && this.state.longWait && (
              <span> (you may need to interact with the demo)</span>
            )}
          </p>
					{Boolean(this.state.detail) && (
						<p className='detail'>{this.state.detail}</p>
					)}
				</div>
      </div>
    );
  }
}

export default TestResult;
