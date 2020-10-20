import React, { Component, useCallback, useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Tooltip } from '@material-ui/core';

import WarningIcon from '@material-ui/icons/Warning';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import ErrorIcon from '@material-ui/icons/Error';


import { green } from '@material-ui/core/colors';
import { yellow } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import { utils, validators, Account } from 'near-api-js';

import Box from '@material-ui/core/Box';

import Big from 'big.js'


class NEARCalculator extends Component {

  intervalID;
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      validators: '',
      searchTerm: '',
      isLoading: true,
      yoctoNear: 0,

    }

    this.loadData = this.loadData.bind(this);

  }

  componentDidMount() {
  	this._isMounted = true;
  	this.loadData();

  }

  componentWillUnmount() {
	this._isMounted = false;
  }

  async loadData() {

    if(this._isMounted) {


      const results = !this.state.searchTerm
      ? 1
      : this.state.searchTerm;

    	this.setState({searchTerm: results});

      var near = new Big(results)
      console.log(near.toFixed())
      this.setState({searchTerm: near.toFixed()});

    }

  }

  render() {

    const self = this


    if(!self._isMounted) {
      return <><p>Loading...</p></>;
    }

    const handleChange = () => {

      this.setState({searchTerm: event.target.value});
      
    };

    const handleFocus = (event) => event.target.select();

    const results = !this.state.searchTerm
    ? 1
    : this.state.searchTerm;

  	const classes = makeStyles((theme) => ({
  	  root: {
  	    '& .MuiTextField-root': {
  	      margin: theme.spacing(1),
  	      width: '25ch',
  	    },
  	  },
  	}));

    return (

      <div className="App">

		<form className={classes.root} noValidate autoComplete="off">

        <TextField
          id="search"
          
          value={this.state.searchTerm}
          className="highlight"
          onChange={handleChange}
          onFocus={handleFocus}
          defaultValue="1"
          label="NEAR Ⓝ"
          variant="outlined"
          margin="dense"
          placeholder="1"
        />


        <TextField
          id="near"
          label="yoctoNEAR Ⓝ"
          className="yocto"
          value={utils.format.parseNearAmount(this.state.searchTerm,  0)}
          variant="outlined"
          placeholder="1000000000000000000000000"
          defaultValue="1000000000000000000000000"
          InputProps={{
            readOnly: true,
          }}
        />


		</form>
      </div>
    );
  }
}



export default NEARCalculator;