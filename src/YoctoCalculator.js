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


class YoctoCalculator extends Component {

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
      ? new Big(1000000000000000000000000)
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

      //self.loadData();
      
    };

    const handleFocus = (event) => event.target.select();

    const results = !this.state.searchTerm
    ? new Big(1000000000000000000000000)
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
          className="yocto highlight"
          placeholder="1000000000000000000000000"
          defaultValue="1000000000000000000000000"
          value={this.state.searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          label="yoctoNEAR Ⓝ"
          variant="outlined"
          size="small"
          margin="dense"
        />


        <TextField
          id="near"
          label="NEAR Ⓝ"
          value={utils.format.formatNearAmount(this.state.searchTerm,  0)}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />


		</form>
      </div>
    );
  }
}



export default YoctoCalculator;