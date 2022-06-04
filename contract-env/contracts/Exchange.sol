//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange is ERC20 {

    address public cryptoDevTokenAddress;

    constructor(address _cryptodevToken) ERC20("CryptoDev LP Token", "CDLP") {
        require(_cryptodevToken != address(0), "Token address passed is a null address");
            cryptoDevTokenAddress = _cryptodevToken;
    }

    //eth balance = balance of the contract { address(this).balance}

    function getReserve() public view returns(uint){
        return ERC20(cryptoDevTokenAddress).balanceOf(address(this));
    }

    function addLiquidity(uint256 _amount) public payable returns(uint256){
        uint liquidity;
        uint ethBalance = address(this).balance;
        uint cryptodevTokenReserve = getReserve();
        ERC20 cryptoDevToken = ERC20(cryptoDevTokenAddress);

        if(cryptodevTokenReserve == 0){
            cryptoDevToken.transferFrom(msg.sender, address(this), _amount); 
            liquidity = address(this).balance;
            _mint(msg.sender, liquidity);

        }else {
            uint ethReserve = ethBalance - msg.value;
            uint cryptoDevTokenAmount = (msg.value * cryptodevTokenReserve) / (ethReserve);
            require(_amount >= cryptoDevTokenAmount, "Amount of token sent is less than the minimun token required");
            cryptoDevToken.transferFrom(msg.sender, address(this), cryptoDevTokenAmount);
            liquidity = (totalSupply() * msg.value) / ethReserve;
            _mint(msg.sender, liquidity);

        }

        return liquidity;
    }

    function removeLiquidity(uint _amount) public returns(uint, uint){
        require(_amount > 0, "_amount should be greater than zero");
        uint ethReserve = address(this).balance;
        uint _totalSupply = totalSupply();

        uint ethAmount = (ethReserve * _amount) / _totalSupply;

        uint cryptoDevTokenAmount = (getReserve() * _amount) / _totalSupply;

        _burn(msg.sender, _amount);

        payable(msg.sender).transfer(ethAmount);

        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevTokenAmount);

        return (ethAmount, cryptoDevTokenAmount);
    }

    function getAmountOfToken(
        uint inputAmount,
        uint inputReserve,
        uint outputReserve
    ) public pure returns(uint){
        require(inputReserve > 0 && outputReserve > 0, "Invalid Reserves");
        uint tokenAmountWithFee = inputAmount * 99;

        uint numerator = tokenAmountWithFee * outputReserve;
        uint denominator = (inputReserve * 100) + tokenAmountWithFee;

        return numerator / denominator;

    }


    function ethToCryptoDevToken(uint _minTokens) public payable {
        uint tokenReserve = getReserve();
        uint cryptoDevToReceive = getAmountOfToken(
            msg.value,
            address(this).balance - msg.value,
            tokenReserve
        );

       require(cryptoDevToReceive >= _minTokens, "insufficient output amount");

        ERC20(cryptoDevTokenAddress).transfer(msg.sender, cryptoDevToReceive);
    }


    function cryptoDevTokenToEth(uint _tokenSold, uint _minEth) public payable {
        uint tokenReserve = getReserve();

        uint ethReceived = getAmountOfToken(
            _tokenSold,
            tokenReserve,
            address(this).balance
        );

        require(ethReceived >= _minEth, "insufficient output amount of tokens");

        ERC20(cryptoDevTokenAddress).transferFrom(
            msg.sender,
            address(this),
            _tokenSold
        );

        payable(msg.sender).transfer(ethReceived);

    }
}

