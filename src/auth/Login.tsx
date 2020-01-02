import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { observer } from 'mobx-react';
import CA_Logo from '../images/CA_Logo.jpg';
import { userStore } from '../index';

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
  const [email, setEmail] = useState('');

  const handleChange = (e: any ) => {
    switch (e.target.name) {
      case 'username':
        setUsername(e.target.value);
        break;
      case 'email':
        setEmail(e.target.value);
        break;
      default:
        return;
    }
  }

  const handleLogin = (e:any) => {
    e.preventDefault();
    console.log("Username is " + username + " while email is " + email)
  }

  return(
      <div style={{height: "100%"}}>
          <Grid container spacing={4} alignItems="center" style={{height: "100%"}}>
            <Grid item xs={12} sm={12} md={8} lg={8} >
              <img src={CA_Logo} alt="Collins Aerospace Logo" height="auto" width="100%" style={{padding: "60px 60px 60px 60px"}} />
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4}>
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
                        name="email"
                        label="Email"
                        id="email"
                        value={email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid container style={{paddingLeft: "10px", paddingRight: "10px"}} justify="space-between" alignItems="center">
                      <Grid item>
                      <Typography variant="body2" style={{ cursor: 'pointer' }}>
                        Forgot Password
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
            </Grid>
          </Grid>
      </div>
  )
}

export default observer(Login);