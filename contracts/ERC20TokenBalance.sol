pragma solidity ^0.4.23;

import './SafeMath.sol';
import './StandardToken.sol';

/**
 * @title ERC20TokenBalance
 */
contract ERC20TokenBalance {
	address private owner;

	/**
	 * @dev Checks if owner addresss is calling
	 */
	modifier onlyOwner {
		require(msg.sender == owner);
		_;
	}

	/**
	 * Constructor
	 */
	constructor() public {
		owner = msg.sender;
	}

	/******************************************/
	/*           OWNER ONLY METHODS           */
	/******************************************/

	/**
	 * @dev Allows owner to kill the contract
	 */
	function kill() public onlyOwner {
		selfdestruct(owner);
	}

	/******************************************/
	/*            PUBLIC METHODS              */
	/******************************************/

	/**
	 * @dev Allows user to get ERC20 token balance
	 */
	function getBalance(address tokenAddress, address sender) public constant returns (uint256) {
		StandardToken _token = StandardToken(tokenAddress);
		return _token.balanceOf(sender);
	}
}
