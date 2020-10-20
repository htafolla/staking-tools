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

import Big from 'big.js'


class Calculator extends Component {

  intervalID;
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      validators: '',
      searchTerm: '',
      isLoading: true,
      poolComminsionRate: 0,
      poolTotalStake: 0,
      poolTotalRewards: 0,
      annualStakerReward: 0,
      stakerPercentPool: 0,
      stakerAnnualPercent: 0,

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

    const account = new Account(self.props.near.connection, '');
    const rewardfee =  await account.viewFunction('openshards.poolv1.near', 'get_reward_fee_fraction', {})


    const validators = await self.props.near.connection.provider.sendJsonRpc('validators', [null]);

    if(this._isMounted) {


	    const results = !this.state.searchTerm
	    ? new Big(utils.format.parseNearAmount('0'))
	    : utils.format.parseNearAmount(this.state.searchTerm);


    	this.setState({searchTerm: results});

	  	const total_supply = new Big(999999999792372916156395166000000)
	  	const annual_inflation_rate = 0.045
	  	const annual_reward_pool = total_supply.times(annual_inflation_rate)

		var total_stake = validators.current_validators.map(validator => validator.stake).reduce((a, b) => {
			let aNum = new Big(a)
			let bNum = new Big(b)
			return aNum.plus(bNum)
		});

		var pool_name = "openshards.poolv1.near"

		var pool_reward_factor = annual_reward_pool.div(total_stake)

		console.log(validators.current_validators)

		var selected_validator = validators.current_validators.filter(validator => validator.account_id.includes(pool_name));
		console.log(selected_validator);

		var total_pool_stake = new Big(selected_validator[0].stake)
		this.setState({poolTotalStake: utils.format.formatNearAmount(total_pool_stake.toFixed(), 0)});
		//console.log(utils.format.formatNearAmount(total_pool_stake.toFixed(), 0))

		var total_pool_reward = total_pool_stake.times(pool_reward_factor)
		this.setState({poolTotalRewards: utils.format.formatNearAmount(total_pool_reward.round().toFixed(), 0)});
		console.log(total_pool_reward.round().toFixed())
		console.log(utils.format.formatNearAmount(total_pool_reward.round().toFixed(), 0))

		var pool_commission_rate = (rewardfee.numerator / rewardfee.denominator) * 100;
		this.setState({poolComminsionRate: pool_commission_rate});
		console.log(pool_commission_rate)


		var staking_pool_commission = this.state.poolComminsionRate
		var staking_pool_commission_amount = total_pool_reward.times(pool_commission_rate)
		console.log(utils.format.formatNearAmount(staking_pool_commission_amount.round().toFixed(), 0))


		var staker_pool_commision = 100 - staking_pool_commission 
		console.log(staker_pool_commision)


		var staker_stake = new Big(results)
		console.log(staker_stake.toFixed())
		this.setState({searchTerm: utils.format.formatNearAmount(staker_stake.toFixed(), 0)});


		console.log(total_pool_stake.toFixed())
		var staker_pool_percent = staker_stake.div(total_pool_stake).round(4)	
		console.log(staker_pool_percent.valueOf())
		this.setState({stakerPercentPool: staker_pool_percent + "%"});

		var total_staker_reward = total_pool_reward.times(staker_stake).div(total_pool_stake).times(staker_pool_commision/100)
		console.log(total_staker_reward.toFixed())
		this.setState({annualStakerReward: total_staker_reward.round(2).toFixed()});

		var staker_annual_percent = total_staker_reward.div(staker_stake).round(4).times(100)
		console.log(staker_annual_percent.valueOf())
		this.setState({stakerAnnualPercent: staker_annual_percent + "%"});
		

		// validators.map((validator, index) => (

		// 	console.log(utils.format.formatNearAmount(validator.stake, 0))

		// ))

		//console.log(utils.format.formatNearAmount(total_staker_reward.round().toFixed(), 0))

		//console.log(utils.format.formatNearAmount(annual_reward_pool.toFixed(), 0))
		//console.log(utils.format.formatNearAmount(total_stake.toFixed(), 0))
    }

  }

  render() {

    const self = this

    //const { searchTerm, refreshValidators, isLoading, poolComminsionRate, poolTotalStake, poolTotalRewards } = self.props;

    if(!self._isMounted) {
      return <><p>Loading...</p></>;
    }

    const handleChange = () => {

      this.setState({searchTerm: event.target.value});

      self.loadData();
      
    };

    const handleFocus = (event) => event.target.select();

	const results = !this.state.searchTerm
    ? new Big(utils.format.parseNearAmount('0'))
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
          id="total-pool-stake"
          label="Pool Total Stake Ⓝ"
          value={this.state.poolTotalStake}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />

       <TextField
          id="pool-annual-rewards"
          label="Pool Annual Rewards Ⓝ"
          value={this.state.poolTotalRewards}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="staker-percent-rewards"
          label="Your Percent of Pool"
          value={this.state.stakerPercentPool}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="search"
          className="highlight"
          value={this.state.searchTerm}
          onChange={handleChange}
          onFocus={handleFocus}
          label="Amount to Stake Ⓝ"
          variant="outlined"
        />

        <TextField
          id="staker-annual-rewards"
          label="Annual Staking Reward"
          value={utils.format.formatNearAmount(this.state.annualStakerReward,  0) + ' Ⓝ'}
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
        />

        <TextField
          id="annual-rate-return"
          label="Staking APR"
          value={this.state.stakerAnnualPercent}
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



export default Calculator;