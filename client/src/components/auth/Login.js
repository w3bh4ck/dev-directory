import React, { Component } from 'react'
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

onchange = (e) => {
    this.setState({[e.target.name]: e.target.value});
}

onsubmit = (e) => {
    e.preventDefault();
    const loginDetails = {
        email: this.state.email,
        password: this.state.password
    }
    console.log(loginDetails);
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
                        name="email" />
                    </div>
                    <div className="form-group">
                        <input type="password" 
                        className="form-control form-control-lg" 
                        placeholder="Password" 
                        value = {this.state.password}
                        onChange={this.onchange}
                        name="password" />
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


export default Login;