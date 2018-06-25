import React, { Component } from "react";
import * as Web3 from "web3";
import {
	Wrapper,
	TableWrapper,
	TableCell,
	Title,
	Description,
	WalletWrapper,
	Wallet,
	TokenWrapper,
	Header,
	HeaderSmall,
	TokenRow,
	A,
	TokenImage,
	TokenName,
	TokenSymbol,
	TokenBalance
} from "./Layout";
import { Alert, AlertContainer } from "react-bs-notifier";
import { abi } from "./ERC20TokenBalance.json";
import { tokens } from "./ERC20TokenList.json";
const promisify = require("tiny-promisify");

const numberWithCommas = (x) => {
	var parts = x.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accounts: [],
			showAlert: false,
			alertContent: "",
			erc20TokenBalance: null,
			tokenBalances: []
		};
	}

	async componentDidMount() {
		try {
			const web3 = await this.connectToWeb3();
			await this.verifyNetwork(web3);
			const accounts = await this.getAccounts(web3);
			const erc20TokenBalance = web3.eth
				.contract(abi)
				.at("0xbc1321e28fc344b47773d2ee99d83472e730aa57");
			this.setState({ accounts, erc20TokenBalance });
			this.getTokenBalances();
		} catch (e) {
			this.setState({ showAlert: true, alertContent: e.message });
		}
	}

	async connectToWeb3() {
		let web3;

		if (typeof window.web3 !== "undefined") {
			web3 = await new Web3(window.web3.currentProvider);
		} else {
			web3 = await new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
		}

		if (web3.isConnected()) {
			return web3;
		} else {
			throw new Error(
				"Make sure you are using a Web3-enabled browser and connecting to the appropriate Ethereum network, and that your account is unlocked"
			);
		}
	}

	async verifyNetwork(web3) {
		const networkId = await promisify(web3.version.getNetwork)();
		if (parseInt(networkId, 10) === 1) {
			return true;
		} else {
			throw new Error(
				"The ERC20 Token Balance smart contract is not available on the Ethereum network you're currently connected to"
			);
		}
	}

	async getAccounts(web3) {
		const accounts = await promisify(web3.eth.getAccounts)();
		if (accounts.length) {
			return accounts;
		} else {
			throw new Error(
				"Unable to find an active account on the Ethereum network you're currently connected to"
			);
		}
	}

	getTokenBalances() {
		const promiseArray = [];
		for (let token of tokens) {
			promiseArray.push(this.getTokenBalance(token.address));
		}
		Promise.all(promiseArray).then(
			(balances) => {
				const tokenBalances = [];
				for (let balance of balances) {
					const token = tokens.find((token) => {
						return token.address === balance.address;
					});
					token.balance = balance.balance;
					tokenBalances.push(token);
				}
				this.setState({ tokenBalances });
			},
			(error) => {
				console.log(error);
				this.setState({ showAlert: true, alertContent: error });
			}
		);
	}

	getTokenBalance(tokenAddress) {
		return new Promise((fulfill, reject) => {
			try {
				if (!this.state.erc20TokenBalance || !this.state.accounts) {
					reject();
				}
				const { erc20TokenBalance, accounts } = this.state;
				erc20TokenBalance.getBalance.call(tokenAddress, accounts[0], (err, balance) => {
					if (!err) {
						fulfill({ address: tokenAddress, balance });
					} else {
						reject(err);
					}
				});
			} catch (e) {
				reject(e.message);
			}
		});
	}

	render() {
		const { accounts, tokenBalances } = this.state;

		const tokenBalancesRows = tokenBalances.map((tokenBalance) => (
			<TokenRow className="row" key={tokenBalance.address}>
				<div className="col-xs-6">
					<A href={"https://etherscan.io/token/" + tokenBalance.address} target="_blank">
						<TokenImage src={tokenBalance.logo} />
						<TokenName>{tokenBalance.name}</TokenName>
						<TokenSymbol>({tokenBalance.symbol})</TokenSymbol>
					</A>
				</div>
				<div className="col-xs-6">
					<A
						href={
							"https://etherscan.io/token/" +
							tokenBalance.address +
							"?a=" +
							accounts[0]
						}
						target="_blank"
					>
						<TokenBalance>
							{numberWithCommas(
								tokenBalance.balance.div(10 ** tokenBalance.decimals).toString()
							)}
						</TokenBalance>
						<TokenSymbol>{tokenBalance.symbol}</TokenSymbol>
					</A>
				</div>
			</TokenRow>
		));
		return (
			<Wrapper>
				<div className="row">
					<div className="col-xs-6">
						<TableWrapper>
							<TableCell>
								<Title>ERC20 Token Balance</Title>
								<Description>
									A simple Dapp to check the balances of your ERC20 Tokens
								</Description>
								<WalletWrapper>
									Your account:{" "}
									<Wallet>
										{accounts.length ? (
											<A
												href={"https://etherscan.io/address/" + accounts[0]}
												target="_blank"
											>
												{accounts[0]}
											</A>
										) : null}
									</Wallet>
								</WalletWrapper>
							</TableCell>
						</TableWrapper>
					</div>
					<div className="col-xs-6">
						<TokenWrapper>
							<div className="row">
								<div className="col-xs-6">
									<Header>
										Token <HeaderSmall>(scroll down to view more)</HeaderSmall>
									</Header>
								</div>
								<div className="col-xs-6">
									<Header>Your Balance</Header>
								</div>
							</div>
							{tokenBalancesRows}
						</TokenWrapper>
					</div>
				</div>
				<AlertContainer position="top-right">
					{this.state.showAlert ? (
						<Alert type="danger" headline="Oops!">
							{this.state.alertContent}
						</Alert>
					) : null}
				</AlertContainer>
			</Wrapper>
		);
	}
}

export default App;
