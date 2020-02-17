import React, { useState } from 'react';
import { Button, TextField, Checkbox, Paper, Grid, Typography, FormControlLabel} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import CA_Logo from '../images/CA_Logo.jpg';
import { userStore } from '../index';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage2, setErrorMessage2] = useState("");
  const [forgetPassword, setForgetPassword] = useState(false);

  const handleChange = (e: any ) => {
    switch (e.target.name) {
      case 'username':
        setUsername(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      default:
        return;
    }
  }

  const handleLogin = (e:any) => {
    e.preventDefault();
    setErrorMessage("");
    let api = new API();
    api
    .post(`${ENDPOINT}/authentication/signIn`, {username, password})
    .then((data) => {
      userStore.setUser(data.user);
      if(remember) {
        localStorage.jwtToken = data.token;
      }
      userStore.setAuthenticated(true);
    })
    .catch(err => {
      if(err.data && err.data.message) {
        setErrorMessage(err.data.message);
      } else {
        setErrorMessage("An error occurred")
      }
    });
  }

  const handleSendEmail = (e: any) => {
    e.preventDefault();
    setErrorMessage2("");
    let api = new API();
    api
    .post(`${ENDPOINT}/authentication/forget/password`, {username})
    .then((data) => {
      setErrorMessage2("Email with new password sent. Please check your email account and login with new password.")
    })
    .catch(err => {
      if(err.data && err.data.message) {
        setErrorMessage2(err.data.message);
      } else {
        setErrorMessage2("An error occurred")
      }
    });
  }

  return(
      <div style={{height: "100%"}}>
          <Grid container spacing={4} alignItems="center" style={{height: "100%"}}>
            <Grid item xs={12} sm={12} md={8} lg={8} >
              <img src={CA_Logo} alt="Collins Aerospace Logo" height="auto" width="100%" style={{padding: "60px 60px 60px 60px"}} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
              { !forgetPassword ? (
                <Paper className={classes.paper} style={{marginLeft: "30px", marginRight: "30px", border: "1px solid black", borderRadius: "25px"}}>
                  <Typography component="h1" variant="h4" align="center">
                      Login
                  </Typography>
                    <form className={classes.form} noValidate>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            value={username}
                            autoFocus
                            onChange={handleChange}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          name="password"
                          type="password"
                          label="Password"
                          id="password"
                          value={password}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid container spacing={2} style={{marginTop: "14px"}}>
                      <FormControlLabel
                        style={{paddingLeft: "8px"}}
                        control={
                          <Checkbox
                          checked={remember}
                          onChange={(event) => {remember ? setRemember(false) : setRemember(true)}}
                          value="primary"
                          inputProps={{ 'aria-label': 'primary checkbox' }}
                          />
                        }
                        label="Remember me"
                      />
                      </Grid>
                      { errorMessage && <h3 style={{color: "red"}}>{errorMessage}</h3>}
                      <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" style={{ cursor: 'pointer' }}>
                            <span onClick={() => {setForgetPassword(true)}}>Forgot Password</span>
                          </Typography>
                        </Grid>
                        <Grid item >
                          <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          className={classes.submit}
                          onClick={handleLogin}
                          >
                          Login
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                </Paper>
              ) : (
                <Paper className={classes.paper} style={{marginLeft: "30px", marginRight: "30px", border: "1px solid black", borderRadius: "25px"}}>
                  <Typography component="h1" variant="h4" align="center">
                      Forgot Password
                  </Typography>
                  <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          margin="normal"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          name="username"
                          value={username}
                          autoFocus
                          onChange={handleChange}
                        />
                      </Grid>
                    </Grid>
                    <Grid style={{display: "flex", alignItems: "center", justifyContent: "center"}} container spacing={2}>
                      { errorMessage2 && <h3 style={{color: "red"}}>{errorMessage2}</h3>}
                    </Grid>
                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Button
                        style={{width: "150px"}}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => {setForgetPassword(false)}}
                        >
                          Back
                        </Button>
                      </Grid>
                      <Grid item >
                        <Button
                        style={{width: "150px"}}
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSendEmail}
                        >
                        Send Email
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              )}
            </Grid>
          </Grid>
      </div>
  )
}

export default observer(Login);