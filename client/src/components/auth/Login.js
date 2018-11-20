import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authactions';

 class Login extends Component {
     constructor(){
         super();
         this.state = {
             email: '',
             password:'',
             errors: {}
         }
         this.onchange = this.onchange.bind(this);
         this.onsubmit = this.onsubmit.bind(this);
     }

componentWillReceiveProps(nextProps) {
    if(nextProps.auth.isAuthenticated){
        this.props.history.push('/dashboard');
    }
    if(nextProps.errors) {
        this.setState({erros: nextProps.errors});
    }
}

onchange = (e) => {
    this.setState({[e.target.name]: e.target.value});
}

onsubmit = (e) => {
    e.preventDefault();
    const loginDetails = {
        email: this.state.email,
        password: this.state.password
    }
    this.props.loginUser(loginDetails);
}

  render() {
    return (
      <div>
      <div className="login">
            <div className="container">
                <div className="row">
                <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Log In</h1>
                    <p className="lead text-center">Sign in to your DevConnector account</p>
                    <form onSubmit={this.onsubmit} >
                    <div className="form-group">
                        <input type="email" 
                        className="form-control form-control-lg" 
                        placeholder="Email Address" 
                        value = {this.state.email}
                        onChange = {this.onchange}
                        name="email" 
                        required
                        />
                    </div>
                    <div className="form-group">
                        <input type="password" 
                        className="form-control form-control-lg" 
                        placeholder="Password" 
                        value = {this.state.password}
                        onChange={this.onchange}
                        name="password"
                        required
                        />
                    </div>
                    <input type="submit" className="btn btn-info btn-block mt-4" />
                    </form>
                </div>
                </div>
            </div>
            </div>
      </div>
    )
  }
}

Login.protoTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(Login);