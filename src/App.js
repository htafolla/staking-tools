import 'regenerator-runtime/runtime'
import React, { Component, useCallback, useEffect, useState } from 'react'
import { login, logout } from './utils'
import './global.css'
import PropTypes from 'prop-types'
import logo from './assets/logo.svg';
import blazenetlogo from './assets/blazenet-io-icon.png';
import nearlogo from './assets/near_logo_wht.svg';
import near from './assets/near.svg';
import { utils, validators, Account } from 'near-api-js';

import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import { Tooltip } from '@material-ui/core';

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import { green } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';

import './App.css';
import Signup from './Signup.js';
import Search from './Search.js';
import Calculator from './Calculator.js';
import YoctoCalculator from './YoctoCalculator.js';
import NEARCalculator from './NEARCalculator.js';
import MenuAppBar from './AppBar.js';


import getConfig from './config';


const { networkId } = getConfig(process.env.NODE_ENV || 'mainnet')

class App extends Component {

  intervalID;

  constructor(props) {

    super(props);

    this.state = {

      login: false,
      balance: null,
      messages: null,
      balance: null,
      error: null,
      blockHeight: null,
      epoch: null,
      epoch_length: null,
      startHeight: null,
      isLoading: true,
      networkState: null,
      validators: null,
      refreshValidators: false,
      seatPrice: null,
      nextSeatPrice: null,

    }

    console.log("Initial State Loaded...");

    //this.signedInFlow = this.signedInFlow.bind(this);
    //this.requestSignIn = this.requestSignIn.bind(this);
    //this.requestSignOut = this.requestSignOut.bind(this);
    //this.signedOutFlow = this.signedOutFlow.bind(this);
    //this.getMessages = this.getMessages.bind(this);

    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    console.log("Calling Load Data...");

  	this.loadData();

    //let loggedIn = this.props.wallet.isSignedIn();
    // let loggedIn = false;

    // if (loggedIn) {
    //   this.signedInFlow();

    // } else {
    //   this.signedOutFlow();
    // }
  }

  componentWillUnmount() {

    clearInterval(this.intervalID);

  }

  // async signedInFlow() {

  //   this.setState({
  //     login: true,
  //   })

  //   const accountId = await this.props.wallet.getAccountId()

  //   //console.log(await (this.props.wallet.account()).state());

  //   this.setState({balance: (await this.props.wallet.account().state()).amount});

  //   if (window.location.search.includes("account_id")) {
  //     window.location.replace(window.location.origin + window.location.pathname)
  //   }
    
  //   //await this.welcome();
  //   //await this.getMessages();
  //   this.loadData();

  // }

  async getValidators() {

    // Get the additional EXPERIMENTAL params to calc seat price
    const genesisConfig = await this.props.near.connection.provider.sendJsonRpc('EXPERIMENTAL_genesis_config', {});
    console.log(genesisConfig);

    //const contract = await this.props.near.connection.provider.sendJsonRpc('query', {request_type: 'call_function', finality: 'final', account_id: 'blazenet.pool.f863973.m0', "method_name": "get_reward_fee_fraction", args_base64: 'e30='});
    


    //console.log(atob(contract.result))
    // let contractParsed = contract.values.map((data, i) => {
    //   return { 'key': atob(data.key), 'value': atob(data.value) };
    // });

    //console.log(contractParsed)

    //let data = types.deserializeData(contract);
    //console.log(data)

    //console.log(contract)
    // let contractParsed = contract.values.map((data, i) => {
    //   return { 'key': atob(data.key), 'value': atob(data.value) };
    // });
    // console.log(contractParsed)

    // let data = types.deserializeData(contract);
    // console.log(data)


    // Get validators
    const result = await this.props.near.connection.provider.sendJsonRpc('validators', [null]);
    result.genesisConfig = genesisConfig;
    result.numSeats = genesisConfig.num_block_producer_seats + genesisConfig.avg_hidden_validator_seats_per_shard.reduce((a, b) => a + b);

    return result;
  }

  async loadData() {

    //const { findSeatPrice } = require('./validators.ts');
    //const { validators } = require('near-api-js');
    console.log("Loading Data...");
    console.log(near)

    this.setState({ isLoading: true });

    // Get the Network State
    const networkState = await this.props.near.connection.provider.sendJsonRpc('status', {});
    console.log(networkState)
    this.setState({networkState: networkState});
    this.setState({blockHeight: networkState.sync_info.latest_block_height});

    // Get the Network State
    const validatorsObj  = await this.getValidators();
    console.log(validatorsObj)

    let findCurrentSeatPrice = validators.findSeatPrice(validatorsObj.current_validators, validatorsObj.numSeats);
    let findNextSeatPrice = validators.findSeatPrice(validatorsObj.next_validators, validatorsObj.numSeats);

    //console.log(validatorsObj.genesisConfig.epoch_length);

    // Set state
    this.setState({epoch_length: validatorsObj.genesisConfig.epoch_length});
    this.setState({startHeight: validatorsObj.epoch_start_height});
    this.setState({validators: validatorsObj, refreshValidators: true, isLoading: false});
    this.setState({seatPrice: utils.format.formatNearAmount(findCurrentSeatPrice.toString(), 0) });
    this.setState({nextSeatPrice: utils.format.formatNearAmount(findNextSeatPrice.toString(), 0)});

    this.intervalID = setTimeout(this.loadData.bind(this), 300000);

  }

  // async getMessages() {

  //   let validators = await this.props.contract.getMessages();
  //   console.log(validators);

  //   this.setState({messages: await this.props.contract.getMessages()});

  // }

  // async requestSignIn() {

  //   const appTitle = 'BlazeNet Validator Tools';

  //   await this.props.wallet.requestSignIn(
  //     window.nearConfig.contractName,
  //     appTitle
  //   )
  // }

  // requestSignOut() {

  //   this.props.wallet.signOut();

  //   setTimeout(this.signedOutFlow, 500);
  // }

  // signedOutFlow() {

  //   if (window.location.search.includes("account_id")) {
  //     window.location.replace(window.location.origin + window.location.pathname)
  //   }

  //   this.setState({
  //     login: false,
  //   })

  // }

  render() {

    self = this;

    const { networkState, validators, epoch_length, searchTerm, startHeight, blockHeight, refreshValidators, error, seatPrice, nextSeatPrice } = this.state;


    //let loggedIn  = this.props.wallet.isSignedIn();
    let loggedIn = false;

    let numBlocksProduced = (blockHeight - startHeight);
    let percentageComplete = numBlocksProduced / epoch_length;
    let epochPercent = Math.floor(percentageComplete * 100);
    let epoch = epochPercent;

    var pool_name = "openshards.poolv1.near"

    console.log(validators)

    let selected_validator = (validators) ? validators.current_validators.filter(validator => validator.account_id.includes(pool_name)) : ''

    console.log(selected_validator)


    const useStyles = makeStyles((theme) => ({

      root: {
        flexGrow: 1,
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
        '& .MuiOutlinedInput-input': {
          padding: '10.5px 14px',
        },
        '& .yocto input': {
          'font-size': '0.65rem',
        },
        '& .highlight input + fieldset': {
          'font-weight': 'bold',
          'borderColor': '#0072ce',
          'borderWidth': 2,
        },
        '& h6': {
          'font-size': '1rem',
        },
      },
      nearlogo: {
        'width': '25%',
        'vertical-align': 'middle',
      },
      logo: {
        'flex-grow': 1,
        'font-family': "'Catamaran', sans-serif",
        'font-weight': 600,
        'font-size': 45,
      },
      validators: {
        'min-height': 150,
        textAlign: 'center',
      },
      paper: {
        padding: theme.spacing(3),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
      gridItemRight: {
        'text-align': 'right',
      },
      gridItemCenter: {
        'text-align': 'center',
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
      headerText: {
        'font-size': '1.2rem',
        'vertical-align': 'middle'
      },
      alignRight: {
        'text-align': 'right',
      },
      alignLeft: {
        'text-align': 'left',
      },
      table: {
        minWidth: 650,
      },
      hideTableCell: {
        [theme.breakpoints.only('xs')]: {
          display: 'none',
        },
        [theme.breakpoints.only('sm')]: {
          display: 'none',
        },
        [theme.breakpoints.only('md')]: {
          display: 'none',
        },

      }
    }));

    function CenteredGrid() {

      const classes = useStyles();

      return (
        <div className={classes.root}>
          <Grid container spacing={5} alignItems="flex-start" alignContent="flex-start">

           {(validators) &&
           <>
            <Grid item className={classes.validators} lg={4} md={12} sm={12} xs={12}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                  OPENSHARDS POOL
                  </Typography>
                  <Typography className={classes.title} color="textSecondary" gutterBottom>
                    REWARDS ESTIMATOR
                  </Typography>
                  <Calculator near={self.props.near} validators={self.state.validators} classes={classes} isLoading={self.state.isLoading} />
                  <Box variant="caption" fontSize={11} fontWeight={500} fontStyle="italic">
                    * For estimation purposes only. Actual rewards will very.
                  </Box>
                  <br/>
                  <Button href="https://wallet.near.org/staking/openshards.poolv1.near" target="_blank" font-family="Poppins;" variant="contained" color="primary">
                    Stake with NEAR Wallet
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item className={classes.validators} lg={3} md={7} sm={7} xs={7}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                    OSA Pool Status
                  </Typography>
                  <Typography color="textSecondary">
                        {(selected_validator) ? (<Tooltip title={"Good"} aria-label="Good"><CheckCircleIcon style={{ color: green[600] }} /></Tooltip> ) 
                      : (<Tooltip title="Need validators" aria-label="Need validators"><ErrorIcon style={{ color: yellow[800] }} /></Tooltip> )  } 
                  </Typography>
                  <Typography color="textSecondary">
                   { ((selected_validator[0].num_produced_blocks / selected_validator[0].num_expected_blocks) * 100) + '% Online'}
                  </Typography>
                </CardContent>
              </Card>
              <br/>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                    EPOCH
                  </Typography>
                  <Typography variant="h6" component="h6">
                    &nbsp;{epoch}% complete
                  </Typography>
                  <Typography color="textSecondary">
                    Last block: {blockHeight}
                  </Typography>
                  <Typography color="textSecondary">
                   Start block: {startHeight}
                  </Typography>
                </CardContent>
              </Card>
              <br/>
              <Card className={classes.scoreCard} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                     NEXT SEAT &nbsp; 
                    {
                      (nextSeatPrice > seatPrice)
                      ? <Tooltip title="Seat Price Up" aria-label="Good Standing"><ArrowUpwardIcon style={{ color: yellow[800] }} /></Tooltip> 
                      : <Tooltip title="Seat Price Down" aria-label="Seat Price Down"><ArrowDownwardIcon style={{ color: green[600] }} /></Tooltip>
                    }
                  </Typography>
                  <Typography variant="h6" component="h6">
                    &nbsp;{nextSeatPrice}
                  </Typography>
                  <Typography color="textSecondary">
                    Seat price: {seatPrice}
                  </Typography>
                  <Typography color="textSecondary">
                   &nbsp;
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item className={classes.validators} lg={4} md={10} sm={10} xs={10}>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                  yoctoNEAR to NEAR
                  </Typography>
                  <YoctoCalculator near={self.props.near} validators={self.state.validators} classes={classes} isLoading={self.state.isLoading} />
                </CardContent>
              </Card>
              <br/>
              <Card className={classes.root} variant="outlined">
                <CardContent>
                  <Typography className={classes.title} color="primary" variant="h6" component="h6">
                   NEAR to yoctoNEAR
                  </Typography>
                  <NEARCalculator near={self.props.near} validators={self.state.validators} classes={classes} isLoading={self.state.isLoading} />
                </CardContent>
              </Card>
            </Grid>

            </>
            }

          </Grid>
        </div>
      );
    }



    if (self.error) {
      return <p>{self.error.message}</p>;
    }

    return (
      <Container>
        <Box my={4}>
          <CenteredGrid />
        </Box>
      </Container>
      )
    }
  }

  export default App;
