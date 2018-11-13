import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authactions';

 class Register extends Component {
    constructor(){
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        }
        this.onchange = this.onchange.bind(this);
        this.onsubmit = this.onsubmit.bind(this);
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.errors){
        this.setState({errors: nextProps.errors});
      }
    }


    onchange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    }

    onsubmit = (e) => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }

        this.props.registerUser(newUser, this.props.history);

      //  axios.post('api/users/register', newUser)
      //   .then(res => console.log(res.data))
      //   .catch(err => this.setState({errors: err.response.data}));
    }

  render() {
    return (
      <div>
      <div className="register">
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">Create your DevConnector account</p>
            <form  onSubmit={this.onsubmit} >
              <div className="form-group">
                <input type="text" 
                    className="form-control form-control-lg" 
                    placeholder="Name" 
                    value={this.state.name}  
                    name="name"  
                    onChange = {this.onchange}
                    />
              </div>
              <div className="form-group">
                <input type="email" 
                    className="form-control form-control-lg" 
                    placeholder="Email Address" 
                    value={this.state.email} 
                    name="email" 
                    onChange = {this.onchange}
                    />
                <small className="form-text text-muted">This site uses Gravatar so if you want a profile image, use a Gravatar email</small>
              </div>
              <div className="form-group">
                    <input type="password" 
                    className="form-control form-control-lg" 
                    placeholder="Password" 
                    value={this.state.password} 
                    name="password" 
                    onChange = {this.onchange}
                    />
              </div>
              <div className="form-group">
                <input 
                    type="password" 
                    className="form-control form-control-lg" 
                    placeholder="Confirm Password" 
                    value={this.state.password2} 
                    name="password2" 
                    onChange = {this.onchange}
                    />
              </div>
              <input type="submit" 
                className="btn btn-info btn-block mt-4" />
            </form>
          </div>
        </div>
      </div>
    </div>
      </div>
    )
  }
}

Register.PropTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})
export default connect(mapStateToProps, {registerUser})(withRouter(Register));