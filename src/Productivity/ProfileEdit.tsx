import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import { userStore } from '../index';
import { observer } from 'mobx-react';
import API from '../utils/API';
import { ENDPOINT } from "../utils/config";
import DropdownList from 'react-widgets/lib/DropdownList'
import ProductivityMenu  from "./ProductivityMenu"

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
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
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

const ProfileEdit = (props) => {
  const classes = useStyles({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [section, setSection] = useState('');
  const [sectionData, setSectionData] = useState([]);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    async function initialize() {
      var user = userStore.getUser;
      let api = new API();
      api
      .get(`${ENDPOINT}/section`)
      .then((data) => {
        setSectionData(data.sections);
        setUsername(user.username);
        setSection(user.sectionID);
        setEmail(user.email);
        data.sections.forEach((section) => {
          if(section.name === "ROOT") {
            if(section._id === user.sectionID) {
              setAdmin(true);
            }
          }
        })
        setLoading(false);
      })
      .catch((error) => {
        if(error.data && error.data.message) {
          props.setError(error.data.message);
        } else {
          props.setError("An error occurred");
        }
        setLoading(false);
      })
    }
    initialize();
  }, []);
  const handleReset = (e: any) => {
    e.preventDefault();
    setErrorMessage("");
    if(password !== confirmPassword) {
      setErrorMessage("Password does not match");
    }
    let api = new API()
    api
    .put(`${ENDPOINT}/authentication/edit`, {
      _id: userStore.getUser._id,
      username,
      password: updatePassword? password : undefined,
      email,
      sectionID: section
    })
    .then((data) => {
      setErrorMessage("Updated");
    })
    .catch(error => {
      if(error.data && error.data.message) {
        setErrorMessage(error.data.message);
      } else {
        setErrorMessage("An error occurred")
      }
    }) 
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <ProductivityMenu />
      {
        loading ? (
          <div style={{display: "flex", justifyContent: "center", height: "100%"}}>
              <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <CircularProgress size={50} />
              </div>
          </div>
        ) : (
          <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <main className={classes.layout}>
              <Paper className={classes.paper}>
                <form className={classes.form} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      { admin ? (
                        <Typography component="h1" variant="h4" align="center">
                          Edit email and password
                        </Typography>
                      ) : (
                        <div>
                          <Typography component="h1" variant="h4" align="center">
                            Edit Profile
                          </Typography>
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
                            onChange={(event) => {setUsername(event.target.value)}}
                          />
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        value={email}
                        onChange={(event) => {setEmail(event.target.value)}}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="password"
                        label="Password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(event) => {setPassword(event.target.value)}}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="confirmPassword"
                        label="Confirm password"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => {setConfirmPassword(event.target.value)}}
                      />
                    </Grid>
                    { !admin && <Grid item xs={12}>
                      <DropdownList 
                      data={sectionData}
                      textField="name"
                      valueField="_id"
                      value={section}
                      onChange={value => {setSection(value._id)}}
                      />
                    </Grid>}
                  </Grid>
                  <Grid style={{display: "flex", justifyContent: "flex-start", paddingLeft: "8px", paddingRight: "8px"}} container spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={updatePassword} onChange={(event) => {setUpdatePassword(event.target.checked)}} />
                      }
                      label="Change password"
                    />
                  </Grid>
                  <Grid style={{display: "flex", justifyContent: "center"}} container spacing={2}>
                    { errorMessage && <h4 style={{color: "red", marginBottom: "0px", marginTop: "15px"}}>{errorMessage}</h4>}
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={handleReset}
                  >
                    Edit
                  </Button>
                </form>
              </Paper>
            </main>
          </div>
        )
      }
    </React.Fragment>
  );
}

export default observer(ProfileEdit);