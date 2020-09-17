exports.callContract = async function callContract({
                                                       web3,
                                                       contractAddress,
                                                       method,
                                                       fromAddress,
                                                       fromAddressPK,
                                                       abi,
                                                       parameters = [],
                                                       gasPrice = 0,
                                                       gasLimit = 210000
                                                   }) {
    const tx = await signRawTx({
        web3,
        contractAddress,
        method,
        fromAddress,
        fromAddressPK,
        abi,
        parameters,
        gasPrice,
        gasLimit
    });
    const receipt = await web3.eth.sendSignedTransaction(tx.rawTransaction);
    console.log(`receipt: ${JSON.stringify(receipt, null, 4)}`);
};

async function signRawTx({
                             web3,
                             contractAddress,
                             method,
                             fromAddress,
                             fromAddressPK,
                             abi,
                             parameters = [],
                             gasPrice = 0,
                             gasLimit = 210000
                         }) {

    console.log(`signRawTx - method: ${method}, parameters: ${parameters}, contractAddress:${contractAddress}`);
    const contract = new web3.eth.Contract(abi, contractAddress);
    const data = contract.methods[method](...parameters).encodeABI();
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const tx = await web3.eth.accounts.signTransaction({
        nonce: web3.utils.toHex(nonce),
        to: contractAddress, // note: this is contractAddress, not toAddress
        value: 0,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data: data
    }, fromAddressPK);


    console.log(`tx: ${JSON.stringify(tx, null, 4)}`);
    return tx;
}

exports.signRawTx = signRawTx;

//https://web3js.readthedocs.io/en/v1.2.9/web3-eth-contract.html?highlight=call#methods-mymethod-call
exports.callContractReturnValue = async function ({
                                                      web3,
                                                      contractAddress,
                                                      method,
                                                      fromAddress,
                                                      fromAddressPK,
                                                      abi,
                                                      parameters = [],
                                                      gasPrice = 0,
                                                      gasLimit = 210000
                                                  }) {

    // myContract.methods.myMethod(123).call({from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'})

    console.log(`callContract - method: ${method}, parameters: ${parameters}, contractAddress:${contractAddress}`);
    const contract = new web3.eth.Contract(abi, contractAddress);
    const data = await contract.methods[method](...parameters).call({
        from: fromAddress, gasPrice, gas: gasLimit
    });
    console.log(`data: ${JSON.stringify(data, null, 4)}`);
};
